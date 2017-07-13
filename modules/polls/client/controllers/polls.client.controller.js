'use strict';

// Polls controller
angular.module('polls').controller('PollsController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Polls',
  'Votes',
  function ($scope, $stateParams, $location, Authentication, Polls, Votes) {
    $scope.authentication = Authentication;
    $scope.options = [{
      text: null
    }, {
      text: null
    }];

    //Add an option
    $scope.addOption = function () {
      $scope.options.push({
        text: null
      });
    };

    //Remove an option
    $scope.removeOption = function (id) {
      $scope.options.splice(id, 1);
    };

    // Create new Poll
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'pollForm');
        return false;
      }

      // Create new Poll object
      var poll = new Polls({
        title: this.title,
        options: $scope.options
      });
      // Redirect after save
      poll.$save(
        function (response) {
          $location.path('polls/' + response._id);
          // Clear form fields
        },
        function (errorResponse) {
          $scope.error = errorResponse.data.message;
        }
      );
    };

    // Remove existing Poll
    $scope.remove = function (poll) {
      if (poll) {
        poll.$remove();

        for (var i in $scope.polls) {
          if ($scope.polls[i] === poll) {
            $scope.polls.splice(i, 1);
          }
        }
      } else {
        $scope.poll.$remove(function () {
          $location.path('polls');
        });
      }
    };

    // Update existing Poll
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'pollForm');

        return false;
      }

      var poll = $scope.poll;

      poll.$update(
        function () {
          $location.path('polls/' + poll._id);
        },
        function (errorResponse) {
          $scope.error = errorResponse.data.message;
        }
      );
    };

    // Find a list of Polls
    $scope.find = function () {
      $scope.polls = Polls.query();
    };

    // Find existing Poll
    $scope.findOne = function () {
      $scope.link = $location.path('polls/' + $stateParams.pollId).$$absUrl;
      $scope.poll = Polls.get({
        pollId: $stateParams.pollId
      });
    };

    $scope.selectOption = function (optionText) {
      $scope.selectedOptionText = optionText;
    };

    //Vote on a poll
    $scope.vote = function () {

      var poll = $scope.poll;
      var options = $scope.poll.options;
      var optionId = $scope.selectedOptionId;
      var optionText = options.find(function (item) {
        return item._id === optionId;
      }).text;
      var voteCount = ++options.find(function (item) {
        return item._id === optionId;
      }).voteCount;

      var vote = new Votes({
        _poll: $scope.poll._id,
        _user: $scope.authentication.user._id || 'IP',
        choice: {
          _id: optionId,
          text: optionText
        }
      });
      vote.$save(function (response) {
          $location.path('votes/' + response._id);
          console.log(response.choice);
        },
        function (errorResponse) {
          var errorMessage = errorResponse.data.message;
          $scope.error = errorMessage;
          console.log(errorMessage);
        }
      );

    };
  }
]);
