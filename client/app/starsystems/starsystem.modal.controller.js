'use strict'

angular.module('eliteApp')
  .controller('starSystemModalController', function($scope, $modalInstance, $modal, starsystem, starSystemList, allegianceList, factionList, governmentList, securityList) {
    $scope.starsystem = starsystem;
    $scope.starSystemList = starSystemList;
    $scope.allegianceList = allegianceList;
    $scope.governmentList = governmentList;
    $scope.securityList = securityList;
    $scope.factionList = factionList;

    $scope.linkedStarSystemsGridOptions = { 
      data: 'starsystem.linkedStarSystems',
      enableSorting: false,
      multiSelect: false,
      height: '50px',
      columnDefs: [
        { field: 'starSystem.name', displayName: 'NAME' },
        { field: 'distance', displayName: 'DISTANCE' }
      ],
      
      afterSelectionChange: function(rowItem, event) {
        $scope.selectedLinkedStarSystem = rowItem.entity;
        return true;
      }
    };

    $scope.ok = function() {
      $modalInstance.close($scope.starsystem);
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

    $scope.showAddLink = function(linkedStarSystem) {
      var modal = $modal.open({
        templateUrl: 'app/starsystems/starsystem.link.modal.html',
        controller: 'linkedStarSystemModalController',
        resolve: {
          linkedStarSystem: function() {
            return {
              starSystem: {
                name: ''
              },
              distance: 0
            };
          },
          starSystemList: function() {
            return $scope.starSystemList;
          }
        }
      });

      modal.result.then(function (linkedStarSystem) {
        if (!$scope.starsystem.linkedStarSystems) {
          $scope.starsystem.linkedStarSystems = [];
        }
        $scope.starsystem.linkedStarSystems.push(linkedStarSystem);
      });

    };
  });
