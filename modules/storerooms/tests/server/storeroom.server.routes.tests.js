'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Storeroom = mongoose.model('Storeroom'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, storeroom;

/**
 * Storeroom routes tests
 */
describe('Storeroom CRUD tests', function () {

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

    // Save a user to the test db and create new Storeroom
    user.save(function () {
      storeroom = {
        name: 'Storeroom name'
      };

      done();
    });
  });

  it('should be able to save a Storeroom if logged in', function (done) {
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

        // Save a new Storeroom
        agent.post('/api/storerooms')
          .send(storeroom)
          .expect(200)
          .end(function (storeroomSaveErr, storeroomSaveRes) {
            // Handle Storeroom save error
            if (storeroomSaveErr) {
              return done(storeroomSaveErr);
            }

            // Get a list of Storerooms
            agent.get('/api/storerooms')
              .end(function (storeroomsGetErr, storeroomsGetRes) {
                // Handle Storeroom save error
                if (storeroomsGetErr) {
                  return done(storeroomsGetErr);
                }

                // Get Storerooms list
                var storerooms = storeroomsGetRes.body;

                // Set assertions
                (storerooms[0].user._id).should.equal(userId);
                (storerooms[0].name).should.match('Storeroom name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Storeroom if not logged in', function (done) {
    agent.post('/api/storerooms')
      .send(storeroom)
      .expect(403)
      .end(function (storeroomSaveErr, storeroomSaveRes) {
        // Call the assertion callback
        done(storeroomSaveErr);
      });
  });

  it('should not be able to save an Storeroom if no name is provided', function (done) {
    // Invalidate name field
    storeroom.name = '';

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

        // Save a new Storeroom
        agent.post('/api/storerooms')
          .send(storeroom)
          .expect(400)
          .end(function (storeroomSaveErr, storeroomSaveRes) {
            // Set message assertion
            (storeroomSaveRes.body.message).should.match('Please fill Storeroom name');

            // Handle Storeroom save error
            done(storeroomSaveErr);
          });
      });
  });

  it('should be able to update an Storeroom if signed in', function (done) {
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

        // Save a new Storeroom
        agent.post('/api/storerooms')
          .send(storeroom)
          .expect(200)
          .end(function (storeroomSaveErr, storeroomSaveRes) {
            // Handle Storeroom save error
            if (storeroomSaveErr) {
              return done(storeroomSaveErr);
            }

            // Update Storeroom name
            storeroom.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Storeroom
            agent.put('/api/storerooms/' + storeroomSaveRes.body._id)
              .send(storeroom)
              .expect(200)
              .end(function (storeroomUpdateErr, storeroomUpdateRes) {
                // Handle Storeroom update error
                if (storeroomUpdateErr) {
                  return done(storeroomUpdateErr);
                }

                // Set assertions
                (storeroomUpdateRes.body._id).should.equal(storeroomSaveRes.body._id);
                (storeroomUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Storerooms if not signed in', function (done) {
    // Create new Storeroom model instance
    var storeroomObj = new Storeroom(storeroom);

    // Save the storeroom
    storeroomObj.save(function () {
      // Request Storerooms
      request(app).get('/api/storerooms')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Storeroom if not signed in', function (done) {
    // Create new Storeroom model instance
    var storeroomObj = new Storeroom(storeroom);

    // Save the Storeroom
    storeroomObj.save(function () {
      request(app).get('/api/storerooms/' + storeroomObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', storeroom.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Storeroom with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/storerooms/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Storeroom is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Storeroom which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Storeroom
    request(app).get('/api/storerooms/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Storeroom with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Storeroom if signed in', function (done) {
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

        // Save a new Storeroom
        agent.post('/api/storerooms')
          .send(storeroom)
          .expect(200)
          .end(function (storeroomSaveErr, storeroomSaveRes) {
            // Handle Storeroom save error
            if (storeroomSaveErr) {
              return done(storeroomSaveErr);
            }

            // Delete an existing Storeroom
            agent.delete('/api/storerooms/' + storeroomSaveRes.body._id)
              .send(storeroom)
              .expect(200)
              .end(function (storeroomDeleteErr, storeroomDeleteRes) {
                // Handle storeroom error error
                if (storeroomDeleteErr) {
                  return done(storeroomDeleteErr);
                }

                // Set assertions
                (storeroomDeleteRes.body._id).should.equal(storeroomSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Storeroom if not signed in', function (done) {
    // Set Storeroom user
    storeroom.user = user;

    // Create new Storeroom model instance
    var storeroomObj = new Storeroom(storeroom);

    // Save the Storeroom
    storeroomObj.save(function () {
      // Try deleting Storeroom
      request(app).delete('/api/storerooms/' + storeroomObj._id)
        .expect(403)
        .end(function (storeroomDeleteErr, storeroomDeleteRes) {
          // Set message assertion
          (storeroomDeleteRes.body.message).should.match('User is not authorized');

          // Handle Storeroom error error
          done(storeroomDeleteErr);
        });

    });
  });

  it('should be able to get a single Storeroom that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Storeroom
          agent.post('/api/storerooms')
            .send(storeroom)
            .expect(200)
            .end(function (storeroomSaveErr, storeroomSaveRes) {
              // Handle Storeroom save error
              if (storeroomSaveErr) {
                return done(storeroomSaveErr);
              }

              // Set assertions on new Storeroom
              (storeroomSaveRes.body.name).should.equal(storeroom.name);
              should.exist(storeroomSaveRes.body.user);
              should.equal(storeroomSaveRes.body.user._id, orphanId);

              // force the Storeroom to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Storeroom
                    agent.get('/api/storerooms/' + storeroomSaveRes.body._id)
                      .expect(200)
                      .end(function (storeroomInfoErr, storeroomInfoRes) {
                        // Handle Storeroom error
                        if (storeroomInfoErr) {
                          return done(storeroomInfoErr);
                        }

                        // Set assertions
                        (storeroomInfoRes.body._id).should.equal(storeroomSaveRes.body._id);
                        (storeroomInfoRes.body.name).should.equal(storeroom.name);
                        should.equal(storeroomInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Storeroom.remove().exec(done);
    });
  });
});
