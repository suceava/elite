/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /commodities              ->  index
 * POST    /commodities              ->  create
 * GET     /commodities/:id          ->  show
 * PUT     /commodities/:id          ->  update
 * DELETE  /commodities/:id          ->  destroy
 */

'use strict'

var Commodity = require('./commodity.model');

exports.index = function (req, res) {
  Commodity
    .find()
    .sort('type name')
    .exec(function (err, commodities) {
      if (err) {
        return res.send(500, err);  
      }
		  return res.json(commodities);
    });
}

exports.create = function (req, res) {
  Commodity.create(req.body, function (err, commodity) {
    if (err) {
      return res.json(400, err);
    }
		return res.json(201, commodity);
	});
}

exports.destroy = function(req, res) {
  Commodity.findById(req.params.id, function (err, commodity) {
    if (err) {
      return res.send(500, err);
    }
    if (!commodity) {
      return res.send(404);
    }
    commodity.remove(function(err) {
      if (err) {
        return res.send(500, err);
      }
      return res.send(204);
    });
  });
};


exports.types = function (req, res) {
  Commodity
    .distinct('type')
    .exec(function (err, types) {
      if (err) {
        return res.send(500, err);
      }
      return res.json(types);
    });
}