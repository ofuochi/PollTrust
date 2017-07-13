'use strict';

// Configuring the Votes module
angular.module('votes').run(['Menus',
  function (Menus) {
    // Add the votes dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Votes',
      state: 'votes',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'votes', {
      title: 'List Votes',
      state: 'votes.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'votes', {
      title: 'Create Votes',
      state: 'votes.create',
      roles: ['user']
    });
  }
]);
