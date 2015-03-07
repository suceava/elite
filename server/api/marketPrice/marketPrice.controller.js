'use strict'

var _ = require('lodash');
var MarketPrice = require('./marketPrice.model');

exports.index = function (req, res) {
  MarketPrice
    .find()
    .populate('starport commodity')
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

   // find the starport
   
};

