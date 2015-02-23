'use strict'

var _ = require('lodash');
var StarSystem = require('../starsystem/starsystem.model');
var StarPort = require('../starport/starport.model');
var Commodity = require('../commodity/commodity.model');
var errors = require('../../components/errors');


var getAllegianceList = function() {
  return [ 
    'None',
    'Alliance', 
    'Empire', 
    'Federation', 
    'Independent'
  ];
};

var getEconomyList = function() {
  return [
    'None',
    'Agricultural',
    'Extraction',
    'High Tech',
    'Industrial',
    'Military',
    'Refinery',
    'Service',
    'Terraforming'
  ];
};

var getFacilityList = function() {
  return [ 
    'Black Market',
    'Commodities',
    'Outfitting',
    'Re-arm',
    'Refuel',
    'Repair',
    'Shipyard'
  ];
};

var getGovernmentList = function() {
  return [
    'None',
    'Anarchy',
    'Communism',
    'Confederacy',
    'Corporate',
    'Democracy',
    'Feudal',
    'Patronage'
  ];
};

var getSecurityList = function() {
  return [
    'None',
    'High',
    'Medium',
    'Low'
  ];
};


exports.allegianceList = function(req, res) {
  return res.json(getAllegianceList());
};

exports.economyList = function(req, res) {
  return res.json(getEconomyList());
};

exports.facilityList = function(req, res) {
  return res.json(getFacilityList());
};

exports.governmentList = function(req, res) {
  return res.json(getGovernmentList());
};

exports.securityList = function(req, res) {
  return res.json(getSecurityList());
};


exports.starSystemList = function(req, res) {
  StarSystem
    .distinct('name')
    .exec(function (err, starSystemList) {
      if (err) {
        return res.send(500, err);
      }
      return res.json(starSystemList);
    });
};

exports.factionList = function(req, res) {
  StarSystem
    .distinct('starports.faction')
    .exec(function (err, factionList) {
      if (err) {
        return res.send(500, err);
      }
      return res.json(factionList);
    });
};

exports.commodityList = function(req, res) {
  Commodity
    .find()
    .select('_id name')
    .sort('name')
    .exec(function(err, commodityList) {
      if (err) {
        return res.send(500, err);
      }
      return res.json(commodityList);
    });
};


exports.metadata = function(req, res) {
  var include = req.query.include;
  if (!include) {
    return res.send(400, 'Must specify include');
  }
  if (!_.isArray(include)) {
    // make it an array
    include = [include];
  }

  var obj = {};

  _.forEach(include, function(elem) {
    switch (elem) {
      case 'allegiance':
        obj.allegianceList = getAllegianceList();
        break;
      case 'economy':
        obj.economyList = getEconomyList();
        break;
      case 'facility':
        obj.facilityList = getFacilityList();
        break;
      case 'faction':
        break;
      case 'government':
        obj.governmentList = getGovernmentList();
        break;
      case 'security':
        obj.securityList = getSecurityList();
        break;
      case 'starsystem':
        break;

    }
  }, this);

  return res.json(obj);

};