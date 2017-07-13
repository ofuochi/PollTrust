'use strict';

//Votes service used for communicating with the votes REST endpoints
angular.module('votes').factory('Votes', ['$resource',
  function ($resource) {
    return $resource('api/votes/:voteId', {
      voteId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
