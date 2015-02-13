'use strict';

angular.module('eliteApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('commodities', {
        url: '/commodities',
        templateUrl: 'app/commodities/commodities.html',
        controller: 'commoditiesController'
      });
  });