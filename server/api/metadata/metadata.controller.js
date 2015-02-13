'use strict'

var StarSystem = require('../starsystem/starsystem.model');
var StarPort = require('../starport/starport.model');
var errors = require('../../components/errors');


var getAllegianceList = function() {
  return [ 
    'Alliance', 
    'Empire', 
    'Federation', 
    'Independent'
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

var getEconomyList = function() {
  return [
    'Agriculture',
    'Extraction',
    'Refinery',
    'Service'
  ];
};

var getSecurityList = function() {
  return [
    'High',
    'Medium',
    'Low'
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


exports.allegianceList = function(req, res) {
  return res.json(getAllegianceList());
};

exports.facilityList = function(req, res) {
  return res.json(getFacilityList());
};

exports.economyList = function(req, res) {
  return res.json(getEconomyList());
};

exports.securityList = function(req, res) {
  return res.json(getSecurityList());
};

exports.governmentList = function(req, res) {
  return res.json(getGovernmentList());
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
    .distinct('controllingFaction')
    .exec(function (err, factionList) {
      if (err) {
        return res.send(500, err);
      }
      return res.json(factionList);
    });
};

/*
exports.governmentList = function(req, res) {
  StarSystem
    .distinct('government')
    .exec(function (err, governments) {
      if (err) {
        return res.send(500, err);
      }
      return res.json(governments);
    });
};

exports.securityList = function(req, res) {
  StarSystem
    .distinct('security')
    .exec(function (err, securities) {
      if (err) {
        return res.send(500, err);
      }
      return res.json(securities);
    });
};
*/