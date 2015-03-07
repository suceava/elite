'use strict'

var _ = require('lodash');
var mongoose = require('mongoose');
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
};

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

exports.find = function (req, res) {
  if (!req.query.name) {
    return res.json(400, 'Invalid star system name');
  }

  StarSystem
    .findByName(req.query.name)
    .then(function (starsystem) {
      if (!starsystem) {
        return errors[404](req, res);
      }

      return res.json(starsystem);
    }, function(err) {
      // error
      return res.json(400, err);
    });
};

/* ADD */
exports.create = function (req, res) {
  var starsystem,
      postedLinkedStarSystems = req.body.linkedStarSystems;

  if (req.body.linkedStarSystems) {
    // remove linked systems from request body before creating it
    delete req.body.linkedStarSystems;
  }

  // instantiate star system from posted data (without the linked star systems)
  starsystem = new StarSystem(req.body);
  // set the current user
  starsystem.createdBy = req.user;

  // first save the system
  StarSystem.create(starsystem, function (err, starsystem) {
    if (err) {
      return res.json(400, err);
    }

    // now update the linked star systems
    updateLinkedSystems(starsystem, postedLinkedStarSystems, req.user, function(err, linkedStarSystems) {
      if (err) {
        return res.json(400, err);
      }

      starsystem.save(function (err) {
        if (err) { 
          return res.send(500, err);  
        }

        return res.json(201, starsystem);
      });
    });
  });
}

/* UPDATE */
exports.update = function(req, res) {
  if (req.body._id) {
    // remove _id from request body
    delete req.body._id;
  }
  console.log('update system ' + req.params.id);

  StarSystem
    .findById(req.params.id)
    .populate('linkedStarSystems.starSystem', 'name')
    .exec()
    .then(function (starsystem) {
      if (!starsystem) {
        return res.send(404);
      }

      updateLinkedSystems(starsystem, req.body.linkedStarSystems, req.user, function(err, linkedStarSystems) {
        if (err) {
          return res.json(400, err);
        }

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
    }, function(err) {
      return res.send(500, err);  
    });
}

/* DELETE */
exports.destroy = function(req, res) {
  StarSystem
    .findById(req.params.id)
    .populate('linkedStarSystems.starSystem', 'name')
    .exec()
    .then(function (starsystem) {
      if (!starsystem) {
        return res.send(404);
      }

      // first we remove the link to this system from all linked systems
      updateDeletedLinks(starsystem.linkedStarSystems, starsystem)
        .then(function() {
          // deleted links updated => now remove this system
          starsystem.remove(function(err) {
            if (err) {
              return res.send(500, err);
            }
            return res.send(204);
          });
        })
        .then(null, function(err) {
          return res.send(500, err);
        });
    }, function(err) {
      return res.send(500, err);  
    });
};

/* RECENTLY ADDED SYSTEMS */
exports.recent = function(req, res) {
  StarSystem
    .find()
    .limit(10)
    .sort('-created')
    .exec(function (err, starsystems) {
      return res.json(starsystems);
    });
};





  var updateLinkedSystems = function(thisSystem, linkedStarSystems, user, callback) {
    // update the star system's list of linked systems from the list sent from the client
    if (!linkedStarSystems) {
      callback(null, null);
      return;
    }
    console.log('updateLinkedSystems');
    console.log(linkedStarSystems);

    // update the 2-way links for the other systems first
    updateLinksOnLinkedSystems(thisSystem, linkedStarSystems, user)
      .then(function() {
        // update the links for this system
        return thisSystem.updateLinkedSystems(linkedStarSystems);
      })
      .then(function() {
        // all done
        console.log('updated');
        callback(null, thisSystem.linkedStarSystems);
      })
      .then(null, function(err) {
        callback(err);
      })
      .end();

    return;
  };

  var updateLinksOnLinkedSystems = function(thisSystem, linkedStarSystems, user) {
    var promise = new mongoose.Promise(),
        deletedLinks, addedLinks, changedLinks;

    if (thisSystem.linkedStarSystems) {
      // deleted links
      deletedLinks = thisSystem.linkedStarSystems.filter(function(elem) {
        // filter only links from current system not found in new links list
        // (must match name & distance)
        for (var j=0, lj=linkedStarSystems.length; j<lj; j++) {
          if ((elem.starSystem.name == linkedStarSystems[j].starSystem.name) &&
              (elem.distance.toString() == linkedStarSystems[j].distance)) {
            return false;
          }
        }
        return true;
      });
console.log('deleted links');
console.log(deletedLinks);

      // added links
      addedLinks = linkedStarSystems.filter(function(elem) {
        // filter only elems from new list not found in current system
        // (must match name & distance)
        for (var j=0, lj=thisSystem.linkedStarSystems.length; j<lj; j++) {
          if (elem.starSystem.name == thisSystem.linkedStarSystems[j].starSystem.name &&
              elem.distance.toString() == thisSystem.linkedStarSystems[j].distance) {
            return false;
          }
        }
        return true;
      });
console.log('added links');
console.log(addedLinks);
    }
    else {
      // current system has no links => all new are added
      addedLinks = linkedStarSystems;
    }

    updateDeletedLinks(deletedLinks, thisSystem)
      .then(function() {
        // deleted links updated
        return updateAddedLinks(addedLinks, thisSystem, user);
      })
      .then(function() {
        // added links updated
        promise.resolve(null, null);
      })
      .then(null, function(err) {
        promise.reject(err);
      });

    return promise;
  };

  var updateDeletedLinks = function(deletedLinks, thisSystem) {
    var promise = new mongoose.Promise();

    if (deletedLinks && deletedLinks.length) {
      var linked = 0,
          linkedLength = deletedLinks.length;

      // remove links to this system from deleted linked systems
      _.forEach(deletedLinks, function(link) {
        if (!link.starSystem || !link.starSystem._id) {
          // star system is gone => skip it
          linkedLength--;
          return;
        }

        StarSystem
          .findById(link.starSystem._id)
          .populate('linkedStarSystems.starSystem', 'name')
          .exec()
          .then(function (system) {
            return system.removeLinkedStarSystem(thisSystem._id);
          }, function (err) {
console.log('error finding system in updateDeletedLinks - ' + link.starSystem._id);
console.log(err);
            return new mongoose.Promise().reject(err);
          })
          .then(function(system) {
            if (++linked == linkedLength) {
              promise.resolve(null, null);
            }
          })
          .then(null, function(err) {
            promise.reject(err);
          });
      });
    }
    else {
      // nothing to delete
      promise.resolve(null, null);
    }

    return promise;
  };

  var updateAddedLinks = function(addedLinks, thisSystem, user) {
    var promise = new mongoose.Promise();
console.log('updateAddedLinks');

    if (addedLinks && addedLinks.length) {
      var linked = 0,
          linkedLength = addedLinks.length;

      // add links to this system to the newly linked system
      _.forEach(addedLinks, function(link) {
        StarSystem
          .findByName(link.starSystem.name)
          .then(function (system) {
            var addPromise = new mongoose.Promise();
console.log('after found system by name for ' + link.starSystem.name);

            if (!system) {
              // system not found but we will add it
console.log('system not found => add it ' + link.starSystem.name);

              StarSystem
                .create({
                  name: link.starSystem.name,
                  createdBy: user
                })
                .then(function (newSystem) {
                  // system added
console.log('new linked system added ' + newSystem.name);
                  addPromise.resolve(null, newSystem);
                },
                function (err) {
                  // error adding new system ??
console.log('error creating new system ');
console.log(err);
                  addPromise.reject(err);
                });
            }
            else {
              // simply resolve the promise
              addPromise.resolve(null, system);
            }

            addPromise
              .then(function (system) {
console.log('adding linked system to ' + system.name);
                if (system) {
                  // cache the id
                  link.starSystem._id = system._id;

                  return system.addLinkedStarSystem({ 
                    starSystem: thisSystem._id,
                    distance: link.distance
                  });
                }
              }, function (err) {
                console.log('error in addPromise');
                console.log(err);
                promise.reject(err);
              });

            return addPromise;
          })
          .then(function (system) {
            if (++linked == linkedLength) {
              promise.resolve(null, null);
            }
          })
          .then(null, function(err) {
            console.log('error in add updateAddedLinks');
            console.log(err);
            promise.reject(err);
          });
      });
    }
    else {
      // nothing to add
      promise.resolve(null, null);
    }


    return promise;
  };

