'use strict';

// Votes controller
angular.module('votes').controller('VotesController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Votes',
  function ($scope, $stateParams, $location, Authentication, Votes) {
    $scope.authentication = Authentication;
   
    // Remove existing Vote
    $scope.remove = function (vote) {
      if (vote) {
        vote.$remove();

        for (var i in $scope.votes) {
          if ($scope.votes[i] === vote) {
            $scope.votes.splice(i, 1);
          }
        }
      } else {
        $scope.vote.$remove(function () {
          $location.path('votes');
        });
      }
    };

    // Find a list of Votes
    $scope.find = function () {
      $scope.votes = Votes.query();
    };

    // Find existing Vote
    $scope.findOne = function () {
      $scope.link = $location.path('votes/' + $stateParams.voteId).$$absUrl;
      $scope.vote = Votes.get({
        voteId: $stateParams.voteId
      });
    };
  }
]);
