'use strict';

angular.module('eliteApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('starports', {
        url: '/starports',
        templateUrl: 'app/starports/starports.html',
        controller: 'starportsController'
      });
  });