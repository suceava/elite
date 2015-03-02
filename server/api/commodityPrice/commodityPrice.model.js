'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommodityPriceSchema = new Schema({
  commodity: { type: Schema.Types.ObjectId, ref: 'Commodity' },
  sell: Number,
  buy: Number,
  demand: Number,
  suply: Number,
  priceDate: Date
});

module.exports = mongoose.model('CommodityPrice', CommodityPriceSchema);