'use strict'

angular.module('eliteApp')
  .controller('starSystemsController', function ($scope, $http, $modal, $window) {

    var loadData = function() {
      $scope.selectedStarSystem = null;

      $http.get('api/starsystems?fields=name&fields=controllingFaction&fields=government&fields=allegiance&fields=security')
        .success(function (starsystems) {
          $scope.starsystems = starsystems;
        });
    };
    var loadMetadata = function() {
      // load combined metadata
      $http.get('api/metadata?include=allegiance&include=government&include=security')
        .success(function (metadata) {
          $scope.metadata = metadata;
        });

      // load star systems
      $http.get('api/metadata/starSystemList')
        .success(function (starSystemList) {
          $scope.starSystemList = starSystemList;
        });

      // load faction list
      $http.get('api/metadata/factionList')
        .success(function (factionList) {
          $scope.factionList = factionList;
        });
    };

    var showAddEditModal = function(starsystem) {
      var modal = $modal.open({
        templateUrl: 'app/starsystems/starsystem.modal.html',
        controller: 'starSystemModalController',
        resolve: {
          starsystem: function() {
            return starsystem;
          },
          starSystemList: function() {
            return $scope.starSystemList;
          },
          metadata: function() {
            return $scope.metadata;
          },
          factionList: function() {
            return $scope.factionList;
          }
        }
      });

      modal.result.then(function (starsystem) {
        console.log('add/edit save');
        console.log(starsystem);
        if (starsystem._id) {
          // edit
          $http.put('api/starsystems/' + starsystem._id, starsystem)
            .success(function () {
              // refresh
              loadData();
            })
            .error(function (data, status, headers, config) {
              console.log(data);
              if (data && data.message)
                alert(data.message);
              else
                alert('Error updating star system');
            });
        }
        else {
          // add
          $http.post('api/starsystems', starsystem)
            .success(function () {
              // refresh
              loadData();
            })
            .error(function (data, status, headers, config) {
              console.log(data);
              if (data && data.message)
                alert(data.message);
              else
                alert('Error adding star system');
            });
        }
      });
    };


    $scope.starsystems = [];
    $scope.selectedStarSystem = null;

    $scope.gridOptions = { 
      data: 'starsystems',
      enableSorting: false,
      multiSelect: false,
      columnDefs: [
        { field: 'name', displayName: 'NAME' },
        { field: 'government', displayName: 'GOVERNMENT' },
        { field: 'allegiance', displayName: 'ALLEGIANCE' },
        { field: 'security', displayName: 'SECURITY' }
      ],
      plugins: [new ngGridFlexibleHeightPlugin({ maxHeight: $window.innerHeight - 350 })],
      
      afterSelectionChange: function(rowItem, event) {
        if (!rowItem.selected) {
          return;
        }
        $scope.selectedStarSystem = rowItem.entity;
        return true;
      }
    };


    $scope.showAddModal = function() {
      showAddEditModal({
        name: ''
      });
    };
    $scope.showEditModal = function() {
      if (!$scope.selectedStarSystem) {
        return;
      }

      // re-load star system from server
      $http.get('api/starsystems/' + $scope.selectedStarSystem._id)
        .success(function(starsystem) {
          showAddEditModal(starsystem);
        });
    }

    $scope.confirmDelete = function() {
      var starsystem = $scope.selectedStarSystem;

      if (!starsystem) {
        return;
      }

      if (confirm('Are you sure you want to delete "' + starsystem.name + '"?')) {
        // delete
        $http.delete('api/starsystems/' + starsystem._id)
          .success(function() {
            // refresh
            loadData();
          });
      }
    };


    loadData();
    loadMetadata();
  });