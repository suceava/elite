'use strict'

angular.module('eliteApp')
  .controller('starPortViewModalController', function($scope, $modalInstance, $window, starport) {
    $scope.starport = starport;

    $scope.marketGridOptions = {
      data: 'starport.latestMarketPrices',
      //groups: [ 'commodity.type' ],
      groupsCollapsedByDefault: false,
      enableSorting: false,
      multiSelect: false,
      columnDefs: [
        { field: 'commodity.name', displayName: 'COMMODITY' },
        { field: 'sellPrice', displayName: 'SELL', width: '100px',
          cellTemplate: '<div><div class="ngCellText">{{row.getProperty(col.field) | number}}</div></div>'
        },
        { field: 'buyPrice', displayName: 'BUY', width: '100px',
          cellTemplate: '<div><div class="ngCellText">{{row.getProperty(col.field) | number}}</div></div>'
        },
        { field: 'demand', displayName: 'DEMAND', width: '170px',
          cellTemplate: '<div><div class="ngCellText">{{row.getProperty(col.field) | number}} {{row.getProperty("demandString")}}</div></div>'
        },
        { field: 'supply', displayName: 'SUPPLY', width: '170px',
          cellTemplate: '<div><div class="ngCellText">{{row.getProperty(col.field) | number}} {{row.getProperty("supplyString")}}</div></div>'
        },
        { field: 'priceDate', displayName: 'DATE', width: '100px',
          cellTemplate: '<div><div class="ngCellText">{{row.getProperty(col.field) | date: "short"}}</div></div>'
        }
      ],
      plugins: [ new ngGridFlexibleHeightPlugin({ maxHeight: $window.innerHeight - 350, window: $window }) ]
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  });
