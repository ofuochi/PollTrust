'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Vote = mongoose.model('Vote'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, vote;

/**
 * Vote routes tests
 */
describe('Vote CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new vote
    user.save(function () {
      vote = {
        title: 'Vote Title',
        content: 'Vote Content'
      };

      done();
    });
  });

  it('should be able to save an vote if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new vote
        agent.post('/api/votes')
          .send(vote)
          .expect(200)
          .end(function (voteSaveErr, voteSaveRes) {
            // Handle vote save error
            if (voteSaveErr) {
              return done(voteSaveErr);
            }

            // Get a list of votes
            agent.get('/api/votes')
              .end(function (votesGetErr, votesGetRes) {
                // Handle vote save error
                if (votesGetErr) {
                  return done(votesGetErr);
                }

                // Get votes list
                var votes = votesGetRes.body;

                // Set assertions
                (votes[0].user._id).should.equal(userId);
                (votes[0].title).should.match('Vote Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an vote if not logged in', function (done) {
    agent.post('/api/votes')
      .send(vote)
      .expect(403)
      .end(function (voteSaveErr, voteSaveRes) {
        // Call the assertion callback
        done(voteSaveErr);
      });
  });

  it('should not be able to save an vote if no title is provided', function (done) {
    // Invalidate title field
    vote.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new vote
        agent.post('/api/votes')
          .send(vote)
          .expect(400)
          .end(function (voteSaveErr, voteSaveRes) {
            // Set message assertion
            (voteSaveRes.body.message).should.match('Title cannot be blank');

            // Handle vote save error
            done(voteSaveErr);
          });
      });
  });

  it('should be able to update an vote if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new vote
        agent.post('/api/votes')
          .send(vote)
          .expect(200)
          .end(function (voteSaveErr, voteSaveRes) {
            // Handle vote save error
            if (voteSaveErr) {
              return done(voteSaveErr);
            }

            // Update vote title
            vote.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing vote
            agent.put('/api/votes/' + voteSaveRes.body._id)
              .send(vote)
              .expect(200)
              .end(function (voteUpdateErr, voteUpdateRes) {
                // Handle vote update error
                if (voteUpdateErr) {
                  return done(voteUpdateErr);
                }

                // Set assertions
                (voteUpdateRes.body._id).should.equal(voteSaveRes.body._id);
                (voteUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of votes if not signed in', function (done) {
    // Create new vote model instance
    var voteObj = new Vote(vote);

    // Save the vote
    voteObj.save(function () {
      // Request votes
      request(app).get('/api/votes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single vote if not signed in', function (done) {
    // Create new vote model instance
    var voteObj = new Vote(vote);

    // Save the vote
    voteObj.save(function () {
      request(app).get('/api/votes/' + voteObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', vote.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single vote with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/votes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Vote is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single vote which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent vote
    request(app).get('/api/votes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No vote with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an vote if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new vote
        agent.post('/api/votes')
          .send(vote)
          .expect(200)
          .end(function (voteSaveErr, voteSaveRes) {
            // Handle vote save error
            if (voteSaveErr) {
              return done(voteSaveErr);
            }

            // Delete an existing vote
            agent.delete('/api/votes/' + voteSaveRes.body._id)
              .send(vote)
              .expect(200)
              .end(function (voteDeleteErr, voteDeleteRes) {
                // Handle vote error error
                if (voteDeleteErr) {
                  return done(voteDeleteErr);
                }

                // Set assertions
                (voteDeleteRes.body._id).should.equal(voteSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an vote if not signed in', function (done) {
    // Set vote user
    vote.user = user;

    // Create new vote model instance
    var voteObj = new Vote(vote);

    // Save the vote
    voteObj.save(function () {
      // Try deleting vote
      request(app).delete('/api/votes/' + voteObj._id)
        .expect(403)
        .end(function (voteDeleteErr, voteDeleteRes) {
          // Set message assertion
          (voteDeleteRes.body.message).should.match('User is not authorized');

          // Handle vote error error
          done(voteDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Vote.remove().exec(done);
    });
  });
});
