'use strict';

/**
 * Module dependencies.
 */
var votesPolicy = require('../policies/votes.server.policy'),
  votes = require('../controllers/votes.server.controller');

module.exports = function (app) {
  // Votes collection routes
  app.route('/api/votes').all(votesPolicy.isAllowed)
    .get(votes.list)
    .post(votes.create);

  // Single vote routes
  app.route('/api/votes/:voteId').all(votesPolicy.isAllowed)
    .get(votes.read)
    .put(votes.update)
    .delete(votes.delete);

  // Finish by binding the vote middleware
  app.param('voteId', votes.voteByID);
};
