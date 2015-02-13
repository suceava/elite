'use strict'

angular.module('eliteApp')
  .controller('commoditiesController', function ($scope, $http, $modal) {

    var loadCommodities = function() {
      $http.get('api/commodities')
        .success(function (commodities) {
          $scope.commodities = commodities;
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
              types: function() {
                return types;
              }
            }
          });

          modal.result.then(function (commodity) {
            console.log(commodity);
            if (commodity._id) {
              // edit
            }
            else {
              // add
              $http.post('api/commodities', commodity)
                .success(function () {
                  // refresh
                  loadCommodities();
                })
                .error(function (data, status, headers, config) {
                  console.log(data);
                  alert(data.message);
                });
            }
          });
        });
    };



    $scope.commodities = [];
    $scope.selectedCommodity = null;

    $scope.gridOptions = { 
      data: 'commodities',
      groups: [ 'type' ],
      groupsCollapsedByDefault: false,
      enableSorting: false,
      multiSelect: false,
      columnDefs: [
        { field: 'type', displayName: 'TYPE', visible: false },
        { field: 'name', displayName: 'NAME' },
        { field: 'producedBy', displayName: 'PRODUCED BY' },
        { field: 'consumedBy', displayName: 'CONSUMED BY' }
      ],
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
      showAddEditModal(null);
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
            loadCommodities();
          });
      }
    };

    $scope.toUpperCase = function(str) {
      return str.toUpperCase();
    };


    loadCommodities();
  });