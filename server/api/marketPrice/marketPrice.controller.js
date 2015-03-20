'use strict'

var _ = require('lodash');
var MarketPrice = require('./marketPrice.model');
var Commodity = require('../commodity/commodity.model');
var CommodityPrice = require('../commodityPrice/commodityPrice.model');
var StarSystem = require('../starsystem/starsystem.model');

exports.index = function (req, res) {
  MarketPrice
    .find()
    .populate('commodity')
    .sort('-priceDate')
    .exec(function (err, prices) {
      if (err) {
        return res.send(500, err);  
      }
      return res.json(prices);
    });
};

exports.createForStarport = function(req, res) {
  var starportPrices = req.body;

console.log(starportPrices);

  /**
   * validate schema
   *  {
   *    stationName: '',
   *    date: '',
   *    userName: '',
   *    screenshotUrl: '',
   *    commodityPrices: [
   *    {
   *      commodityName: '',
   *      sellPrice: '',
   *      buyPrice: '',
   *      demandNumber: '',
   *      demandString: '',
   *      supplyNumber: '',
   *      supplyString: ''
   *    }
   *    ]
   *  }
   */
   if (!starportPrices || !starportPrices.stationName || !starportPrices.commodityPrices) {
    return res.send(400, 'Invalid payload');
   }

   // find the starport
   StarSystem
    .findStarportByName(starportPrices.stationName)
    .then(function (starport) {
      if (!starport) {
        return res.send(404, 'Starport not found');
      }

      // get the commodities list
      Commodity
        .find()
        .exec()
        .then(function (commodities) {
          if (!commodities) {
            return res.send(500, 'Cannot load commodities');
          }

          // found starport, now loop through prices and add rows 
          // while also creating list to update latest prices for this starport
          _.forEach(starportPrices.commodityPrices, function (commodityPrice) {

            var commodity = _.find(commodities, function (c) {
              return c.name.toLowerCase() == commodityPrice.commodityName.toLowerCase();
            });
            if (!commodity) {
              // invalid commodity name
              return;
            }
            var sell = _.parseInt(commodityPrice.sellPrice),
                buy = _.parseInt(commodityPrice.buyPrice),
                demand = _.parseInt(commodityPrice.demandNumber),
                supply = _.parseInt(commodityPrice.supplyNumber);

            MarketPrice
              .create({
                starport: starport,
                commodity: commodity,
                sellPrice: _.isNaN(sell) ? 0 : sell,
                buyPrice: _.isNaN(buy) ? 0 : buy,
                demand: _.isNaN(demand) ? 0 : demand,
                demandString: commodityPrice.demandString,
                supply: _.isNaN(supply) ? 0 : supply,
                supplyString: commodityPrice.supplyString,
                priceDate: starportPrices.date,
                imageUrl: starportPrices.screenshotUrl,
                clientUser: starportPrices.userName
                //createdBy: req.user
              })
              .then(function (marketPrice) {
                console.log(marketPrice);
              }, function (err) {
                console.log(err);
              });

          });

          return res.send(201);
        });
    }, function (err) {
      return res.send(500, err);
    });
};

