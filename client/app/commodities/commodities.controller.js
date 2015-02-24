'use strict'

angular.module('eliteApp')
  .controller('commoditiesController', function ($scope, $http, $modal) {

    var loadData = function() {
      $scope.selectedCommodity = null;

      $http.get('api/commodities')
        .success(function (commodities) {
          $scope.commodities = commodities;
        });
    };

    var loadMetadata = function() {
      // load combined metadata
      $http.get('api/metadata?include=economy')
        .success(function (metadata) {
          $scope.metadata = metadata;
        });
    };

    var showAddEditModal = function(commodity) {
      // load types
      $http.get('api/commodities/types')
        .success(function (types) {
          var modal = $modal.open({
            templateUrl: 'app/commodities/commodity.modal.html',
            controller: 'commodityModalController',
            resolve: {
              commodity: function() {
                return commodity;
              },
              metadata: function() {
                return $scope.metadata;
              },
              types: function() {
                return types;
              }
            }
          });

          modal.result.then(function (commodity) {
            console.log(commodity);
            if (commodity._id) {
              // edit
              $http.put('api/commodities/' + commodity._id, commodity)
                .success(function () {
                  // refresh
                  loadData();
                })
                .error(function (data, status, headers, config) {
                  console.log(data);
                  if (data && data.message) {
                    alert(data.message);
                  }
                  else {
                    alert('Error updating commodity');
                  }
                });
            }
            else {
              // add
              $http.post('api/commodities', commodity)
                .success(function () {
                  // refresh
                  loadData();
                })
                .error(function (data, status, headers, config) {
                  console.log(data);
                  if (data && data.message) {
                    alert(data.message);
                  }
                  else {
                    alert('Error adding commodity');
                  }
                });
            }
          });
        });
    };

    $scope.commodities = [];

    $scope.gridOptions = { 
      data: 'commodities',
      groups: [ 'type' ],
      groupsCollapsedByDefault: false,
      enableSorting: false,
      multiSelect: false,
      columnDefs: [
        { field: 'type', displayName: 'TYPE', visible: false },
        { field: 'name', displayName: 'NAME', width: '250px' },
        { field: 'producedBy.join(",")', displayName: 'PRODUCED BY' },
        { field: 'consumedBy.join(",")', displayName: 'CONSUMED BY' }
      ],
      plugins: [new ngGridFlexibleHeightPlugin()],
      aggregateTemplate: '<div ng-style="rowStyle(row)" class="ngAggregate ng-scope"><span class="ngAggregateText">{{toUpperCase(row.label)}}</span></div>',
      
      afterSelectionChange: function(rowItem, event) {
        $scope.selectedCommodity = rowItem.entity;
        return true;
      }
    };

    $scope.showAddModal = function() {
      showAddEditModal({
        name: '',
        type: '',
        producedBy: [],
        consumedBy: []
      });
    };

    $scope.showEditModal = function() {
      showAddEditModal($scope.selectedCommodity);
    };

    $scope.confirmDelete = function() {
      var commodity = $scope.selectedCommodity;

      if (!commodity) {
        return;
      }

      if (confirm('Are you sure you want to delete "' + commodity.name + '"?')) {
        // delete
        console.log('deleting ' + commodity._id);
        $http.delete('api/commodities/' + commodity._id)
          .success(function() {
            // refresh
            loadData();
          });
      }
    };

    $scope.toUpperCase = function(str) {
      return str.toUpperCase();
    };


    loadData();
    loadMetadata();
  });