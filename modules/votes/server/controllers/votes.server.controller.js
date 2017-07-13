'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Vote = mongoose.model('Vote'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a vote
 */
exports.create = function (req, res) {

  var vote = new Vote(req.body);

  Vote.findOne(
    {_user:vote._user,_poll:vote._poll},
    function(err,doc){
      if(doc){
        console.log(doc._user+"                "+vote._user);
        console.log(doc._poll+"                "+vote._poll);
      }
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } 
      if (doc) {
        console.log("Error here");
        var error = new Error('User have voted');

        return res.status(400).send({
          message: errorHandler.getErrorMessage(error)
        });
      } 
      Vote.findOneAndUpdate(
        {'choice._id':vote.choice._id},
        {$inc:{'choice.count':1}},
        {new:true},
        function(err,doc){
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } 
          if(doc) return res.json(doc);
          vote.save(function (err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.json(vote);
            }
          });
        }
      );
    }
  );



 
};

/**
 * Show the current vote
 */
exports.read = function (req, res) {
  res.json(req.vote);
};

/**
 * Update a vote
 */
exports.update = function (req, res) {
  var vote = req.vote;

  vote.title = req.body.title;
  vote.options = req.body.options;

  vote.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json({vote});
    }
  });
};

/**
 * Delete an vote
 */
exports.delete = function (req, res) {
  var vote = req.vote;
  vote.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(vote);
    }
  });
};

/**
 * List of Votes
 */
exports.list = function (req, res) {
  Vote.find().sort('-created').exec(function (err, votes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(votes);
    }
  });
};

/**
 * Vote middleware
 */
exports.voteByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Vote is invalid'
    });
  }

  Vote.findById(id).exec(function (err, vote) {
    if (err) {
      return next(err);
    } else if (!vote) {
      return res.status(404).send({
        message: 'No vote with that identifier has been found'
      });
    }
    req.vote = vote;
    next();
  });
};
