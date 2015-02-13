'use strict'

angular.module('eliteApp')
  .controller('starportsController', function ($scope, $http, $modal) {

    var loadData = function() {
      $scope.selectedStarPort = null;

      $http.get('api/starports')
        .success(function (starports) {
        	$scope.starports = starports;
        });
    };

    var loadMetadata = function() {
      // load star systems
      $http.get('api/metadata/starSystemList')
        .success(function (starSystemList) {
          $scope.starSystemList = starSystemList;
        });

      // load allegiance list
      $http.get('api/metadata/allegianceList')
        .success(function (allegianceList) {
          $scope.allegianceList = allegianceList;
        });

      // load faction list
      $http.get('api/metadata/factionList')
        .success(function (factionList) {
          $scope.factionList = factionList;
        });

      // load government list
      $http.get('api/metadata/governmentList')
        .success(function (governmentList) {
          $scope.governmentList = governmentList;
        });
    };

    var showAddEditModal = function(starport) {
      var modal = $modal.open({
        templateUrl: 'app/starports/starport.modal.html',
        controller: 'starPortModalController',
        resolve: {
          starport: function() {
            return starport;
          },
          starSystemList: function() {
            return $scope.starSystemList;
          },
          allegianceList: function() {
            return $scope.allegianceList;
          },
          factionList: function() {
            return $scope.factionList;
          },
          governmentList: function() {
            return $scope.governmentList;
          }
        }
      });

      modal.result.then(function (starport) {
        console.log(starport);
        if (starport._id) {
          // edit
          $http.put('api/starports/' + starport._id, starport)
            .success(function () {
              // refresh
              loadData();
            })
            .error(function (data, status, headers, config) {
              console.log(data);
              alert(data.message);
            });
        }
        else {
          // add
          $http.post('api/starports', starport)
            .success(function () {
              // refresh
              loadData();
            })
            .error(function (data, status, headers, config) {
              console.log(data);
              alert(data.message);
            });
        }
      });
    };


    $scope.starports = [];
    $scope.selectedStarPort = null;

    $scope.gridOptions = { 
      data: 'starports',
      enableSorting: false,
      multiSelect: false,
      columnDefs: [
        { field: 'starports.name', displayName: 'NAME' },
        { field: 'starports.faction', displayName: 'FACTION' },
        { field: 'starports.government', displayName: 'GOVERNMENT' },
        { field: 'starports.allegiance', displayName: 'ALLEGIANCE' }
      ],
      
      afterSelectionChange: function(rowItem, event) {
        $scope.selectedStarPort = rowItem.entity.starports;
        return true;
      }
    };


    $scope.showAddModal = function() {
      showAddEditModal({
        name: '',
        starSystem: {
          name: ''
        }
      });
    };
    $scope.showEditModal = function() {
      if (!$scope.selectedStarPort) {
        return;
      }

      // re-load star port from server
      $http.get('api/starports/' + $scope.selectedStarPort._id)
        .success(function(starport) {
          showAddEditModal(starport);
        });
    }

    $scope.confirmDelete = function() {
      var starport = $scope.selectedStarPort;

      if (!starport) {
        return;
      }

      if (confirm('Are you sure you want to delete "' + starport.name + '"?')) {
        // delete
        console.log('deleting ' + starport._id);
        $http.delete('api/starports/' + starport._id)
          .success(function() {
            // refresh
            loadData();
          });
      }
    };


    loadData();
    loadMetadata();
  });