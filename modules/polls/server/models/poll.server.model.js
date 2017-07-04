'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**Option Schema */
var OptionSchema = new Schema({
  text:{
    type:String,
    default:'',
    trim:true,
    required:'All options must be filled'
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
  // content: {
  //   type: String,
  //   default: '',
  //   trim: true,
  //   required: "Content cannot be blank"
  // },
  options:{
     type: [{
      type: Schema.Types.ObjectId,
      ref: 'Option'
    }],
    validate: [arrayLimit, '{PATH} must be at least two options']
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});
function arrayLimit(val) {
  return val.length > 2;
}
mongoose.model('Poll', PollSchema);
