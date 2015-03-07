'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommodityPriceSchema = new Schema({
  commodity: { type: Schema.Types.ObjectId, ref: 'Commodity' },
  sellPrice: Number,
  buyPrice: Number,
  demand: Number,
  demandString: String,
  supply: Number,
  supplyString: String,
  priceDate: Date
});

module.exports = mongoose.model('CommodityPrice', CommodityPriceSchema);