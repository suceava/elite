'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MarketPriceSchema = new Schema({
  starport: { type: Schema.Types.ObjectId, ref: 'StarPort' },

  // since mongoose doesn't support embedding a schema as a single object
  // we have to re-define the commodityPrice schema inline
  commodity: { type: Schema.Types.ObjectId, ref: 'Commodity' },
  sellPrice: Number,
  buyPrice: Number,
  demand: Number,
  demandString: String,
  supply: Number,
  supplyString: String,
  priceDate: Date,

  imageUrl: String,
  clientUser: String, // this is the user sent by the client
  isVerified: { type: Boolean, default: false },

  created: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('MarketPrice', MarketPriceSchema);