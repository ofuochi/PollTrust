'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**Option Schema */
var OptionSchema = new Schema({
  text: {
    type: String,
    default: '',
    trim: true,
    required: 'All options must be filled'
  },
  voteCount: {
    type: Number,
    default: 0
  }
});

/**
 * Poll Schema
 */
var PollSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  options: {
    type: [OptionSchema],
    required: 'Options are required'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

PollSchema.path('options').validate(function (value) {
  return value.length >= 2;
}, 'At least two options are required');
mongoose.model('Poll', PollSchema);
