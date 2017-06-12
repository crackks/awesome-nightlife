'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Going = new Schema({
    cityId:String,
    peopleGoing:Number

},{ versionKey: false });

module.exports = mongoose.model('Going', Going);
