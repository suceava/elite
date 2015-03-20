'use strict'

angular.module('eliteApp')
  .controller('marketPricesController', function ($scope, $http, $modal, $window) {

    var loadData = function() {
      $scope.selectedMarketPrice = null;

      $http.get('api/marketPrices')
        .success(function (marketPrices) {
          $scope.marketPrices = marketPrices;
        });
    };


    $scope.marketPrices = [];

    $scope.gridOptions = { 
      data: 'marketPrices',
      groups: [ 'type' ],
      groupsCollapsedByDefault: false,
      enableSorting: false,
      multiSelect: false,
      columnDefs: [
        { field: 'commodity.name', displayName: 'COMMODITY' },
        { field: 'starport.name', displayName: 'STARPORT'},
        { field: 'sellPrice', displayName: 'SELL' },
        { field: 'buyPrice', displayName: 'BUY' },
        { field: 'demand', displayName: 'DEMAND' },
        { field: 'supply', displayName: 'SUPPLY' },
        { field: 'priceDate', displayName: 'DATE', width: '200px' }
      ],
      plugins: [ new ngGridFlexibleHeightPlugin({ maxHeight: $window.innerHeight - 350, window: $window }) ],
      
      afterSelectionChange: function(rowItem, event) {
        $scope.selectedMarketPrice = rowItem.entity;
        return true;
      }
    };


    loadData();
    //loadMetadata();
  });