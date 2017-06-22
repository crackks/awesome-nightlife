'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Going = new Schema({
    id:String,
    peopleGoing:Number,
    nbrGoing:String

},{ versionKey: false });

module.exports = mongoose.model('Going', Going);
