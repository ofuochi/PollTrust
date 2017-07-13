'use strict';

// Setting up route
angular.module('votes').config(['$stateProvider',
  function ($stateProvider) {
    // Votes state routing
    $stateProvider
      .state('votes', {
        abstract: true,
        url: '/votes',
        template: '<ui-view/>'
      })
      .state('votes.list', {
        url: '',
        templateUrl: 'modules/votes/client/views/list-votes.client.view.html'
      })
      .state('votes.create', {
        url: '/create',
        templateUrl: 'modules/votes/client/views/create-vote.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('votes.view', {
        url: '/:voteId',
        templateUrl: 'modules/votes/client/views/view-vote.client.view.html'
      })
      .state('votes.edit', {
        url: '/:voteId/edit',
        templateUrl: 'modules/votes/client/views/edit-vote.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
