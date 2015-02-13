'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommoditySchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  producedBy: [String],
  consumedBy: [String]
});

module.exports = mongoose.model('Commodity', CommoditySchema);