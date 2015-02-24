'use strict';

var express = require('express');
var controller = require('./commodity.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/types', auth.isAuthenticated(), controller.types);

router.get('/', auth.hasRole('user'), controller.index);
router.get('/:id', auth.hasRole('user'), controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('user'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;