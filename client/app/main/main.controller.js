'use strict';

angular.module('eliteApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.recentStarSystems = [];
    $scope.recentStarPorts = [];

    var loadData = function() {
      $http.get('/api/starsystems/recent').success(function(recentStarSystems) {
        $scope.recentStarSystems = recentStarSystems;
      });
      $http.get('/api/starports/recent').success(function(recentStarPorts) {
        $scope.recentStarPorts = recentStarPorts;
      });
    }

    $scope.starSystemsGridOptions = { 
      data: 'recentStarSystems',
      enableSorting: false,
      multiSelect: false,
      columnDefs: [
        { field: 'name', displayName: 'NAME' },
        { field: 'controllingFaction', displayName: 'FACTION' },
        { field: 'government', displayName: 'GOVERNMENT' },
        { field: 'allegiance', displayName: 'ALLEGIANCE' },
        { field: 'security', displayName: 'SECURITY' },
        { field: 'created', displayName: 'CREATED' }
      ]
    };

    $scope.starPortsGridOptions = { 
      data: 'recentStarPorts',
      enableSorting: false,
      multiSelect: false,
      columnDefs: [
        { field: 'name', displayName: 'NAME' },
        { field: 'faction', displayName: 'FACTION' },
        { field: 'government', displayName: 'GOVERNMENT' },
        { field: 'allegiance', displayName: 'ALLEGIANCE' },
        { field: 'created', displayName: 'CREATED' }
      ]
    };

    loadData();
  });
