'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MarketPriceSchema = new Schema({
  starport: { type: Schema.Types.ObjectId, ref: 'StarPort' },
  commodity: { type: Schema.Types.ObjectId, ref: 'Commodity' },
  sell: Number,
  buy: Number,
  marketDate: Date,
  created: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('MarketPrice', MarketPriceSchema);