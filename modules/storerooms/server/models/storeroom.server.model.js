'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Storeroom Schema
 */
var StoreroomSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Storeroom name',
    trim: true
  },
  parent: {
    type: Schema.ObjectId,
    ref: 'Storeroom'
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Storeroom', StoreroomSchema);
