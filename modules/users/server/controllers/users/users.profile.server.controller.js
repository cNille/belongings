'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  User = mongoose.model('User');

// AWS
var multerS3 = require('multer-s3');
var AWS = require('aws-sdk');
AWS.config.region = 'eu-west-1';
var s3 = new AWS.S3({ params: { Bucket: config.s3bucket } });

/**
 * Update user details
 */
exports.update = function (req, res) {
  // Init Variables
  var user = req.user;

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  if (user) {
    // Merge existing user
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;

    user.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.login(user, function (err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.json(user);
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Get profile picture
 */
exports.getProfilePicture = function (req, res) {
  var img = req.params.image;
  var url;
  if(process.env.NODE_ENV !== 'production'){
    url = 'http://' + req.headers.host + '/uploads/' + img; 
  } else {
    url = s3.getSignedUrl('getObject', { Bucket: config.s3bucket, Key: img });
  }
  res.redirect(url);
};

/**
 * Update profile picture
 */
exports.changeProfilePicture = function (req, res) {
  var user = req.user;
  var message = null;
  var upload, fileKey;
  
  // Upload locally if not production.
  if(process.env.NODE_ENV !== 'production'){
    upload = multer(config.uploads.profileUpload).single('newProfilePicture');
  } else {
    // Production - upload to s3.
    fileKey = 'profile_pic_' + Date.now().toString();
    upload = multer({
      storage: multerS3({
        s3: s3,
        bucket: config.s3bucket,
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
          cb(null, fileKey);
        }
      })
    }).single('newProfilePicture');
  }
  
  // Filtering to upload only images
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;
  upload.fileFilter = profileUploadFileFilter;

  if (user) {
    upload(req, res, function (uploadError) {
      if(uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading profile picture'
        });
      } else {
        //Success, Delete old profileImg if exists.
        if(process.env.NODE_ENV){
          fileKey = req.file.filename;
        } else if(user.profileImageURL){
          s3.deleteObjects({
            Bucket: config.s3bucket,
            Delete: {
              Objects: [
               { Key: user.profileImageURL }
              ]
            }
          }, function(err, data) {
            if (err)
              return console.log(err);
            console.log('Old profile image removed safely.');
          });
        }

        //Replace imgurl on user with new one.
        user.profileImageURL = fileKey;

        user.save(function (saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            req.login(user, function (err) {
              if (err) {
                res.status(400).send(err);
              } else {
                res.json(user);
              }
            });
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Send User
 */
exports.me = function (req, res) {
  res.json(req.user || null);
};
