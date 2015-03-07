'use strict';

var express = require('express');
var controller = require('./marketPrice.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/starport', controller.createForStarport);
//router.get('/recent', auth.isAuthenticated(), controller.recent);

router.get('/', auth.hasRole('user'), controller.index);
//router.get('/:id', auth.hasRole('user'), controller.show);
//router.post('/', auth.hasRole('user'), controller.create);
//router.put('/:id', auth.hasRole('user'), controller.update);
//router.delete('/:id', auth.hasRole('user'), controller.destroy);

module.exports = router;