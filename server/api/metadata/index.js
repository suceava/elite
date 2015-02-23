'use strict';

var express = require('express');
var controller = require('./metadata.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('user'), controller.metadata);
router.get('/starSystemList', auth.hasRole('user'), controller.starSystemList);
router.get('/commodityList', auth.hasRole('user'), controller.commodityList);
router.get('/factionList', auth.hasRole('user'), controller.factionList);
router.get('/governmentList', auth.hasRole('user'), controller.governmentList);
router.get('/securityList', auth.hasRole('user'), controller.securityList);
router.get('/allegianceList', auth.hasRole('user'), controller.allegianceList);

module.exports = router;