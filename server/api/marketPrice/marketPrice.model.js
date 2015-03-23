'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MarketPriceSchema = new Schema({
  starport: { type: Schema.Types.ObjectId, ref: 'Starport' },

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
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: false }
});


/* Static methods */

/*
 * Get latest commodity prices for a starport
 *
 * @param {ObjectId} starportId
 * @return {Promise}
 */
MarketPriceSchema.statics.getLatestForStarport = function(starportId) {
  var promise = new mongoose.Promise();
  var self = this;
  this
    .aggregate([
        { $match: { 'starport': starportId } },
        { $sort: { 'priceDate': -1 } },
        { $group: { 
            _id: '$commodity',
            commodity: { $first: '$commodity' },
            priceDate: { $first: '$priceDate' },
            sellPrice: { $first: '$sellPrice' },
            buyPrice: { $first: '$buyPrice' },
            demand: { $first: '$demand' },
            demandString: { $first: '$demandString' },
            supply: { $first: '$supply' },
            supplyString: { $first: '$supplyString' }
          }
        }
      ], function (err, marketPrices) {
        if (err) {
console.log(err);
          promise.reject(err);
        }

        self
          .populate(marketPrices, [ { path: 'commodity' } ], function (err, marketPrices) {
            if (err) {
console.log(err);
              promise.reject(err);
            }

            promise.resolve(null, marketPrices);
          });
      });

  return promise;

/*    
    .find({ 'starport': starportId })
    .populate('commodity')
    .sort('commodity.name')
    .exec();*/
};

module.exports = mongoose.model('MarketPrice', MarketPriceSchema);