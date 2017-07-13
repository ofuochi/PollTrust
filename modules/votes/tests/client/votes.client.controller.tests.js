'use strict';

(function () {
  // Votes Controller Spec
  describe('Votes Controller Tests', function () {
    // Initialize global variables
    var VotesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Votes,
      mockVote;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Votes_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Votes = _Votes_;

      // create mock vote
      mockVote = new Votes({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Vote about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Votes controller.
      VotesController = $controller('VotesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one vote object fetched from XHR', inject(function (Votes) {
      // Create a sample votes array that includes the new vote
      var sampleVotes = [mockVote];

      // Set GET response
      $httpBackend.expectGET('api/votes').respond(sampleVotes);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.votes).toEqualData(sampleVotes);
    }));

    it('$scope.findOne() should create an array with one vote object fetched from XHR using a voteId URL parameter', inject(function (Votes) {
      // Set the URL parameter
      $stateParams.voteId = mockVote._id;

      // Set GET response
      $httpBackend.expectGET(/api\/votes\/([0-9a-fA-F]{24})$/).respond(mockVote);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.vote).toEqualData(mockVote);
    }));

    describe('$scope.create()', function () {
      var sampleVotePostData;

      beforeEach(function () {
        // Create a sample vote object
        sampleVotePostData = new Votes({
          title: 'An Vote about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Vote about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Votes) {
        // Set POST response
        $httpBackend.expectPOST('api/votes', sampleVotePostData).respond(mockVote);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the vote was created
        expect($location.path.calls.mostRecent().args[0]).toBe('votes/' + mockVote._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/votes', sampleVotePostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock vote in scope
        scope.vote = mockVote;
      });

      it('should update a valid vote', inject(function (Votes) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/votes\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/votes/' + mockVote._id);
      }));

      it('should set scope.error to error response message', inject(function (Votes) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/votes\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(vote)', function () {
      beforeEach(function () {
        // Create new votes array and include the vote
        scope.votes = [mockVote, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/votes\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockVote);
      });

      it('should send a DELETE request with a valid voteId and remove the vote from the scope', inject(function (Votes) {
        expect(scope.votes.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.vote = mockVote;

        $httpBackend.expectDELETE(/api\/votes\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to votes', function () {
        expect($location.path).toHaveBeenCalledWith('votes');
      });
    });
  });
}());
