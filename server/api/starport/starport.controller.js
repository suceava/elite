'use strict'

var _ = require('lodash');
var mongoose = require('mongoose');
var StarPort = require('./starport.model');
var StarSystem = require('../starsystem/starsystem.model');
var errors = require('../../components/errors');

exports.index = function (req, res) {
  var fields = (req.query.fields ? req.query.fields.join(' ') : 'starports.name');

  StarSystem.aggregate([
      { $unwind: "$starports" },
      { $project: { starports: 1 } },
      { $sort: { "starports.name": 1 }}
    ],
    function (err, starports) {
      if (err) {
        return res.send(500, err);  
      }
      return res.json(starports);
    });
};

exports.show = function (req, res) {
  StarSystem
    .find({ 'starports._id': new mongoose.Types.ObjectId(req.params.id) },
      { 'starports.$': 1, name: 1 })
    .exec(function (err, starsystems) {
      if (err) {
        return res.send(500, err);
      }

      if (!starsystems || !starsystems.length || !starsystems[0].starports || !starsystems[0].starports.length) {
        return errors[404](req, res);
      }

      var starsystem = starsystems[0];
      var starport = starsystem.starports[0];
      // add the parent system
      starport.starSystem = {
        _id: starsystem._id,
        name: starsystem.name
      };

      return res.json(starport);
    })
};

exports.create = function (req, res) {
  if (!req.body.starSystem) {
    return res.json(400, 'Missing star system');
  }    

  var starport = new StarPort(req.body);
  starport.createdBy = req.user;

  findStarSystem(req.body.starSystem.name, function (err, starsystem) {
    if (err) {
      return res.json(400, err);
    }
    if (!starsystem) {
      return res.json(400, 'Invalid star system');
    }    

    // add the starport to the star system's list
    if (!starsystem.starports) {
      starsystem.starports = [];
    }
    starsystem.starports.push(starport);

    // save the star system
    starsystem.save(function(err) {
      if (err) {
        return res.json(400, err);
      }

    	return res.json(201, starport);
    });
  });
};

exports.update = function(req, res) {
  if (req.body._id) {
    // remove _id from request body
    delete req.body._id;
  }

  // find the starsystem that has this starport
  findStarSystemWithStarport(req.params.id, function (err, starport, starsystem) {
      if (err) {
        return res.send(500, err);
      }
      if (!starsystem || !starport) {
        return res.send(404);
      }

      // remove this staport from the list from this system
      starsystem.starports.remove(starport);

      // merge the new starport data
      var updatedStarport = _.merge(starport, req.body);

      var newStarSystemName = req.body.starSystem.name;
      // remove star system from body
      delete req.body.starSystem;

      if (newStarSystemName == starsystem.name) {
        // star system hasn't changed

        // re-add updated starport to list
        starsystem.starports.push(updatedStarport);

        starsystem.save(function (err) {
          if (err) { 
            return res.send(500, err);  
          }

          return res.json(200, updatedStarport);
        });
      }
      else {
        // star system changed

/*        findStarSystem(req.body.starSystem.name, function (err, starsystem) {
            if (err) {
              return res.json(400, err);
            }
            if (!starsystem) {
              return res.json(400, 'Invalid star system');
            }    
          }); */
      }
    });
}

exports.destroy = function(req, res) {
  findStarSystemWithStarport(req.params.id, function (err, starport, starsystem) {
    if (err) {
      return res.send(500, err);
    }
    if (!starsystem || !starport) {
      return res.send(404);
    }

    // remove starport from list
    starsystem.starports.remove(starport);

    // save the star system
    starsystem.save(function(err) {
      if (err) {
        return res.send(500, err);
      }
      return res.send(204);
    });
  });
};


exports.recent = function(req, res) {
  StarPort
    .find()
    //.limit(10)
   // .sort('-created')
    .exec(function (err, starports) {
      return res.json(starports);
    });
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

var findStarSystemWithStarport = function(starportId, callback) {
  // find the starsystem that has this starport
  StarSystem
    .find({ 'starports._id': new mongoose.Types.ObjectId(starportId) })
    .exec(function (err, starsystems) {
      if (err) {
        callback(err);
        return;
      }
      if (!starsystems || !starsystems.length) {
        callback(404);
        return;
      }

      var starsystem = starsystems[0];
      var starport;

      // find the starport
      for (var i=0, l=starsystem.starports.length; i<l; i++) {
        var sp = starsystem.starports[i];
        if (sp && sp._id == starportId) {
          starport = sp;
          break;
        }
      }

      callback(null, starport, starsystem);
    });
};