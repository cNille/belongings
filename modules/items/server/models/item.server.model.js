'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Item Schema
 */
var ItemSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Item name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  owner: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  storeroom: {
    type: String,
    default: '',
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  last_edited: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Item', ItemSchema);
