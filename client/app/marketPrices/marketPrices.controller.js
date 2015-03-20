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
      groups: [ 'commodity.type' ],
      groupsCollapsedByDefault: false,
      enableSorting: false,
      multiSelect: false,
      columnDefs: [
        { field: 'commodity.name', displayName: 'COMMODITY' },
        { field: 'starport.name', displayName: 'STARPORT'},
        { field: 'sellPrice', displayName: 'SELL', width: '100px',
          cellTemplate: '<div><div class="ngCellText">{{row.getProperty(col.field) | number}}</div></div>'
        },
        { field: 'buyPrice', displayName: 'BUY', width: '100px',
          cellTemplate: '<div><div class="ngCellText">{{row.getProperty(col.field) | number}}</div></div>'
        },
        { field: 'demand', displayName: 'DEMAND', width: '200px',
          cellTemplate: '<div><div class="ngCellText">{{row.getProperty(col.field) | number}} {{row.getProperty("demandString")}}</div></div>'
        },
        { field: 'supply', displayName: 'SUPPLY', width: '200px',
          cellTemplate: '<div><div class="ngCellText">{{row.getProperty(col.field) | number}} {{row.getProperty("supplyString")}}</div></div>'
        },
        { field: 'priceDate', displayName: 'DATE', width: '200px',
          cellTemplate: '<div><div class="ngCellText">{{row.getProperty(col.field) | date: "short"}}</div></div>'
        }
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