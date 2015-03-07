/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /commodities              ->  index
 * POST    /commodities              ->  create
 * GET     /commodities/:id          ->  show
 * PUT     /commodities/:id          ->  update
 * DELETE  /commodities/:id          ->  destroy
 */

'use strict'

var _ = require('lodash');
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
};

exports.show = function (req, res) {
  Commodity
    .findById(req.params.id)
    .exec(function (err, commodity) {
      if (err) {
        return res.send(500, err);
      }
      if (!commodity) {
        return errors[404](req, res);
      }

      return res.json(commodity);
    })
};

exports.create = function (req, res) {
  Commodity.create(req.body, function (err, commodity) {
    if (err) {
      return res.json(400, err);
    }
		return res.json(201, commodity);
	});
};

exports.update = function(req, res) {
  if (req.body._id) {
    // remove _id from request body
    delete req.body._id;
  }

  Commodity
    .findById(req.params.id)
    .exec()
    .then(function (commodity) {
      if (!commodity) {
        return res.send(404);
      }

      var updated = _.merge(commodity, req.body);
      
      // mark changed fields
      updated.markModified('producedBy');
      updated.markModified('consumedBy');

      updated.save(function (err) {
        if (err) { 
          return res.send(500, err);  
        }

        return res.json(200, commodity);
      });
    }, function(err) {
      return res.send(500, err);  
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