'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**Option1 Schema */
var Option1Schema = new Schema({
  text:{
    type:String,
    default:'',
    trim:true,
    required:'All options must be filled'
  }
});
/**Option2 Schema */
var Option2Schema = new Schema({
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
    type:Array,
    default: [{Option1Schema},{Option2Schema}],
    required: "You must fill all options"
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Poll', PollSchema);
