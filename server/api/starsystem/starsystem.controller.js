'use strict'

var _ = require('lodash');
var StarSystem = require('./starsystem.model');
var errors = require('../../components/errors');

exports.index = function (req, res) {
  var fields = (req.query.fields ? req.query.fields.join(' ') : 'name');

  StarSystem
    .find()
    .sort('name')
    .select(fields)
    .exec(function (err, starsystems) {
      if (err) {
        return res.send(500, err);  
      }
      return res.json(starsystems);
    });
}

exports.show = function (req, res) {
  StarSystem
    .findById(req.params.id)
    .populate('linkedStarSystems.starSystem', 'name')
    .exec(function (err, starsystem) {
      if (err) {
        return res.send(500, err);
      }
      if (!starsystem) {
        return errors[404](req, res);
      }

      return res.json(starsystem);
    })
};

exports.create = function (req, res) {
  var starsystem = new StarSystem(req.body);
  starsystem.createdBy = req.user;

  updateLinkedSystems(req.body.linkedStarSystems, starsystem.name, function(err, linkedStarSystems) {
    if (err) {
      return res.json(400, err);
    }
    starsystem.linkedStarSystems = linkedStarSystems;

    StarSystem.create(starsystem, function (err, starsystem) {
      if (err) {
        return res.json(400, err);
      }
      return res.json(201, starsystem);
    });
  });
}

exports.update = function(req, res) {
  if (req.body._id) {
    // remove _id from request body
    delete req.body._id;
  }
  StarSystem.findById(req.params.id, function (err, starsystem) {
    if (err) {
      return res.send(500, err);  
    }
    if (!starsystem) {
      return res.send(404);
    }

    updateLinkedSystems(req.body.linkedStarSystems, starsystem.name, function(err, linkedStarSystems) {
      if (err) {
        return res.json(400, err);
      }
      starsystem.linkedStarSystems = linkedStarSystems;

      if (req.body.linkedStarSystems) {
        // remove linked systems from request body before merge
        delete req.body.linkedStarSystems;
      }

      var updated = _.merge(starsystem, req.body);
      updated.save(function (err) {
        if (err) { 
          return res.send(500, err);  
        }

        return res.json(200, starsystem);
      });
    });
  });
}

exports.destroy = function(req, res) {
  StarSystem.findById(req.params.id, function (err, starsystem) {
    if (err) {
      return res.send(500, err);
    }
    if (!starsystem) {
      return res.send(404);
    }
    starsystem.remove(function(err) {
      if (err) {
        return res.send(500, err);
      }
      return res.send(204);
    });
  });
};


exports.recent = function(req, res) {
  StarSystem
    .find()
    .limit(10)
    .sort('-created')
    .exec(function (err, starsystems) {
      return res.json(starsystems);
    });
};


var updateLinkedSystems = function(linkedStarSystems, thisStarSystemName, callback) {
  if (!linkedStarSystems) {
    callback(null, null);
    return;
  }

  var linked = 0;
  var newLinkedSystems = [];

  for (var i=0,l=linkedStarSystems.length; i<l; i++) {
    var linkedSystem = linkedStarSystems[i];

    findStarSystem(linkedSystem.starSystem.name, function (err, starsystem) {
      if (err) {
        callback(err);
        return;
      }

      if (starsystem && starsystem.name != thisStarSystemName && linkedSystem.distance) {
        newLinkedSystems.push({
          starSystem: starsystem,
          distance: linkedSystem.distance
        });
      }

      if (++linked == l) {
        // return null array if no items in it
        callback(null, (newLinkedSystems.length > 0) ? newLinkedSystems : null);
      }
    });
  }
};

var findStarSystem = function(starSystemName, callback) {
  // find the star system by name
  StarSystem.findOne({ 'name': starSystemName }, function (err, starsystem) {
    if (err) {
      callback(err, null);
      return;
    }

    callback(null, starsystem);
  });
};
