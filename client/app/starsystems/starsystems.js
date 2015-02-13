'use strict';

angular.module('eliteApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('starsystems', {
        url: '/starsystems',
        templateUrl: 'app/starsystems/starsystems.html',
        controller: 'starSystemsController'
      });
  });