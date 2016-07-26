'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Storeroom = mongoose.model('Storeroom'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Storeroom
 */
exports.create = function(req, res) {
  var storeroom = new Storeroom(req.body);
  storeroom.user = req.user;

  storeroom.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(storeroom);
    }
  });
};

/**
 * Show the current Storeroom
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var storeroom = req.storeroom ? req.storeroom.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  storeroom.isCurrentUserOwner = req.user && storeroom.user && storeroom.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(storeroom);
};

/**
 * Update a Storeroom
 */
exports.update = function(req, res) {
  var storeroom = req.storeroom ;

  storeroom = _.extend(storeroom , req.body);

  storeroom.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(storeroom);
    }
  });
};

/**
 * Delete an Storeroom
 */
exports.delete = function(req, res) {
  var storeroom = req.storeroom ;

  storeroom.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(storeroom);
    }
  });
};

/**
 * List of Storerooms
 */
exports.list = function(req, res) { 
  Storeroom.find().sort('-created').populate('user', 'displayName').exec(function(err, storerooms) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(storerooms);
    }
  });
};

/**
 * Storeroom middleware
 */
exports.storeroomByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Storeroom is invalid'
    });
  }

  Storeroom.findById(id).populate('user', 'displayName').exec(function (err, storeroom) {
    if (err) {
      return next(err);
    } else if (!storeroom) {
      return res.status(404).send({
        message: 'No Storeroom with that identifier has been found'
      });
    }
    req.storeroom = storeroom;
    next();
  });
};
