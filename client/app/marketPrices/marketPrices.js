'use strict';

angular.module('eliteApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('marketPrices', {
        url: '/marketPrices',
        templateUrl: 'app/marketPrices/marketPrices.html',
        controller: 'marketPricesController'
      });
  });