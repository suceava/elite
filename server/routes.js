/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/metadata', require('./api/metadata'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/starsystems', require('./api/starsystem'));
  app.use('/api/starports', require('./api/starport'));
  app.use('/api/commodities', require('./api/commodity'));
  app.use('/api/marketPrices', require('./api/marketPrice'));

  app.use('/auth', require('./auth'));
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
