'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**Choice Schema */
var ChoiceSchema = new Schema({
  text: {
    type: String,
    required: 'Choice text cannot be empty'
  },
  count: {
    type: Number,
    default: 0
  }
});

//Pre-hook to default vote count to 1
ChoiceSchema.pre('save',function(next){
  this.count = 1;
  next();
});

/**
 * Vote Schema
 */
var VoteSchema = new Schema({
  _user: {
    type: String,
    trim: true,
    default: '',
    required: 'A voter is required'
  },
  _poll: {
    type: Schema.ObjectId,
    ref: 'Poll',
    required: 'A poll must be specified',
  },
  choice: {
    type: ChoiceSchema,
    required: 'You must make a choice'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

//Pre-hook to check if user have voted by checking userId and PollId
// VoteSchema.pre('validate', function(next) {
//   var self = this;
//   var PollSchema = mongoose.model('Poll');
//   self.constructor.findOne(
//     {_user:self._user,_poll:self._poll},
//     function(err,doc){
//       if(err) next(err);
//       if(doc) self.invalidate("_user","User have already voted on this poll");
//       next();
//     }
//   );
// });

// VoteSchema.pre('save',function(next){
//   var self = this;
//   self.constructor.findOneAndUpdate(
//     {'choice._id':self.choice._id},
//     {$inc:{'choice.count':1}},
//     {new:true},
//     function(err,doc){
//       if(err) next(err);
//       if(doc) {
//         self.invalidate("choice","Updating Vote");
//         next(new Error("Updating vote"));
//       }
//       next();
//     });
// });
mongoose.model('Vote', VoteSchema);
