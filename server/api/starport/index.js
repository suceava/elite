'use strict';

var express = require('express');
var controller = require('./starport.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/recent', auth.isAuthenticated(), controller.recent);
router.get('/latestMarketPrices/:id', auth.isAuthenticated(), controller.latestMarketPrices);

router.get('/', auth.hasRole('user'), controller.index);
router.get('/:id', auth.hasRole('user'), controller.show);
router.post('/', auth.hasRole('user'), controller.create);
router.put('/:id', auth.hasRole('user'), controller.update);
router.delete('/:id', auth.hasRole('user'), controller.destroy);

module.exports = router;