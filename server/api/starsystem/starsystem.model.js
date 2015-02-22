'use strict'

var _ = require('lodash');
var mongoose = require('mongoose');
var Starport = require('../starport/starport.model');
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

StarSystemSchema.methods = {
  /**
   * Add a link to the given star system and save to DB
   *
   * @param {LinkedStarSystem} linkedStarSystem
   * @return {Promise}
   */
  addLinkedStarSystem: function(linkedStarSystem) {
    var promise = new mongoose.Promise();

    if (!this.linkedStarSystems) {
      this.linkedStarSystems = [];
    }
    this.linkedStarSystems.push(linkedStarSystem);
    this.save(function(err) {
      if (err) {
        promise.reject(err);
      }
      else {
        promise.resolve(null, this);
      }
    });

    return promise;
  },

  /**
   * Remove a link to the given star system and save to DB
   *
   * @param {ObjectID} starSystemId
   * @return {Promise}
   */
  removeLinkedStarSystem: function(starSystemId) {
    var promise = new mongoose.Promise();

    // remove the give star system from our list of linked systems
    _.remove(this.linkedStarSystems, function(elem) {
      var id = (elem.starSystem._id) ? elem.starSystem._id : elem.starSystem;
      return starSystemId.equals(id);
    });
    // update the star system
    this.markModified('linkedStarSystems');
    this.save(function(err, starsystem) {
      if (err) {
        promise.reject(err);
      }
      else {
        promise.resolve(null, this);
      }
    });

    return promise;
  },

  /**
   * Update the linked star systems from a new list of linked systems
   * does not save to DB
   *
   * @param {Array} linkedStarSystems
   * @return {Promise}
   */
  updateLinkedSystems: function(linkedStarSystems) {
    var promise = new mongoose.Promise();

    // check for empty array
    if (!linkedStarSystems || linkedStarSystems.length == 0) {
      this.linkedStarSystems = [];
      promise.resolve(null, this);
    }
    else {
      var thisSystem = this, // scoped var
          linked = 0,
          linkedLength = linkedStarSystems.length;

      // clear list
      this.linkedStarSystems = [];

      // loop through the changed linked systems
      _.forEach(linkedStarSystems, function(linkedSystem) {
        // find the linked system
        mongoose.model('StarSystem')
          .findByName(linkedSystem.starSystem.name)
          .then(function(starsystem) {
            if (starsystem && starsystem.name != thisSystem.name && linkedSystem.distance) {
              // system exists and it's not the one being updated
              thisSystem.linkedStarSystems.push({
                starSystem: starsystem,
                distance: linkedSystem.distance
              });
            }

            if (++linked == linkedLength) {
              // return null array if no items in it
              promise.resolve(null, thisSystem);
            }
          }, function(err) {
            // error
            promise.reject(err);
          });
      }, this);

    }

    return promise;
  }
};


/* Static methods */

/**
 * Find a star system by name
 * 
 * @param {String} starSystemName
 * @return {Promise}
 */
StarSystemSchema.statics.findByName = function(starSystemName) {
  // find the star system by name
  return this
    .findOne({ 'name': starSystemName })
    .populate('linkedStarSystems.starSystem', 'name')
    .exec();
}

module.exports = mongoose.model('StarSystem', StarSystemSchema);