'use strict'

var Starport = require('../starport/starport.model');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StarSystemSchema = new Schema({
  name: { type: String, required: true },
  controllingFaction: String,
  allegiance: String,
  government: String,
  security: String,
  created: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  linkedStarSystems: [{
    starSystem: { type: Schema.Types.ObjectId, ref: 'StarSystem' },
    distance: Number
  }],

  starports : [ Starport.Schema ]
});


module.exports = mongoose.model('StarSystem', StarSystemSchema);