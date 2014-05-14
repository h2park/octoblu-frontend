'use strict';

var mongoose = require('mongoose');

// define the schema for our user model
var GroupSchema = mongoose.Schema({
    uuid: {type : String, required : true },
    name: String,
    type: {
        type: String,
        default : 'default',
        enum : ['default', 'operators'],
        required : true
    },
    permissions : {
        discover : Boolean,
        configure : Boolean,
        message : Boolean
    },
    members: [{
        name : String,
        email : String,
        uuid : String,
        imageUrl : String
    }],
    devices: [{
        name : String,
        uuid : String,
        type : String,
        imageUrl : String

    }]
});

mongoose.exports = GroupSchema;
