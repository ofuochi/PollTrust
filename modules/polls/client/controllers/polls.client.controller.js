'use strict';

// Polls controller
angular.module('polls').controller('PollsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Polls',
    function($scope, $stateParams, $location, Authentication, Polls) {
        $scope.authentication = Authentication;
        $scope.options = [{ text: null }, { text: null }];

        //Add an option
        $scope.addOption = function() {
            $scope.options.push({ text: null });
        };

        //Remove an option
        $scope.removeOption = function(id) {
            $scope.options.splice(id, 1);
        };

        // Create new Poll
        $scope.create = function(isValid) {
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
            console.log(poll);
            // Redirect after save
            poll.$save(function(response) {
                $location.path('polls/' + response._id);

                // Clear form fields
                $scope.title = '';
                // $scope.content = '';
                $scope.options = [{ text: "", id: 1 }, { text: "", id: 2 }];
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Poll
        $scope.remove = function(poll) {
            if (poll) {
                poll.$remove();

                for (var i in $scope.polls) {
                    if ($scope.polls[i] === poll) {
                        $scope.polls.splice(i, 1);
                    }
                }
            } else {
                $scope.poll.$remove(function() {
                    $location.path('polls');
                });
            }
        };

        // Update existing Poll
        $scope.update = function(isValid) {
            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'pollForm');

                return false;
            }

            var poll = $scope.poll;

            poll.$update(function() {
                $location.path('polls/' + poll._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Polls
        $scope.find = function() {
            $scope.polls = Polls.query();
        };

        // Find existing Poll
        $scope.findOne = function() {
            $scope.poll = Polls.get({
                pollId: $stateParams.pollId
            });
        };
    }
]);