'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StarportSchema = new Schema({
  name: { type: String, required: true },
  distanceFromStar: Number,
  faction: String,
  government: String,
  allegiance: String,
  facillities: [String],
  economies: [{ type: Schema.Types.ObjectId, ref: 'Commodity' }],
  imports: [{ type: Schema.Types.ObjectId, ref: 'Commodity' }],
  exports: [{ type: Schema.Types.ObjectId, ref: 'Commodity' }],
  prohibited: [String],
  created: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Starport', StarportSchema);