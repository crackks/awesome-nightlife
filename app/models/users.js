'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    _id:String,
    userName:String,
    Email:String,
    Password:String,
    isGoingTo:Array

},{ versionKey: false });

module.exports = mongoose.model('User', User);
