'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    //empty poll with two options
    $scope.poll = {
      question: null,
      options: [{
        id: 1,
        text: null
      }, {
        id: 2,
        text: null
      }]
    };

    var poll = $scope.poll;
    //add extra options 
    $scope.addOption = function() {
      var length = poll.options.length;
      poll.options.push({
        id: length + 1
      });
    };

    //remove an option
    $scope.removeOption = function(id){
      poll.options.splice(id, 1);
    };

    //create poll
    $scope.submitPoll = function() {
    };
  }
]);
