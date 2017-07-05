"use strict";

/**
 * Module dependencies.
 */
var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

/**Option Schema */
var OptionSchema = new Schema({
    text: {
        type: String,
        default: '',
        trim: true,
        required: 'All options must be filled'
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
        default: "",
        trim: true,
        required: "Title cannot be blank"
    },
    // content: {
    //   type: String,
    //   default: '',
    //   trim: true,
    //   required: "Content cannot be blank"
    // },
    options: {
        type: [OptionSchema]
    },
    user: { type: Schema.ObjectId, ref: "User" }
});

PollSchema.path('options').validate(function(value) {
    return value.length >= 2;
}, "At least two options are required");
mongoose.model("Poll", PollSchema);