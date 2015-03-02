'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MarketPriceSchema = new Schema({
  starport: { type: Schema.Types.ObjectId, ref: 'StarPort' },

  // since mongoose doesn't support embedding a schema as a single object
  // we have to re-define the commodityPrice schema inline
  commodity: { type: Schema.Types.ObjectId, ref: 'Commodity' },
  sell: Number,
  buy: Number,
  demand: Number,
  suply: Number,
  priceDate: Date,

  imageUrl: String,
  clientUserInfo: String, // this is the user sent by the client

  created: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('MarketPrice', MarketPriceSchema);