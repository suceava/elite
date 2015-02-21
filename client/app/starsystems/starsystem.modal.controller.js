'use strict'

angular.module('eliteApp')
  .controller('starSystemModalController', function($scope, $modalInstance, $modal, starsystem, starSystemList, allegianceList, factionList, governmentList, securityList) {
    $scope.starsystem = starsystem;
    $scope.starSystemList = starSystemList;
    $scope.allegianceList = allegianceList;
    $scope.governmentList = governmentList;
    $scope.securityList = securityList;
    $scope.factionList = factionList;
    $scope.selectedLinkedStarSystem = null;

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
        // make sure added system isn't this system
        if (linkedStarSystem.starSystem.name == $scope.starsystem.name) {
            window.alert('Star system cannot be linked to itself');
            return;
        }

        if (!$scope.starsystem.linkedStarSystems) {
          // initialize the links array
          $scope.starsystem.linkedStarSystems = [];
        }
        else {
          // make sure added star system isn't already linked
          var i = _.findIndex($scope.starsystem.linkedStarSystems, function(elem) {
              return elem.name == linkedStarSystem.starSystem.name;
            });
          if (i >= 0) {
            window.alert('Star system already linked');
            return;
          }
        }
        $scope.starsystem.linkedStarSystems.push(linkedStarSystem);
      });
    };

    $scope.confirmDeleteLink = function() {
      var linkedSystem = $scope.selectedLinkedStarSystem;

      if (!linkedSystem) {
        return;
      }

      if (confirm('Are you sure you want to delete link to "' + linkedSystem.starSystem.name + '"?')) {
        // delete link to the named system
        $scope.starsystem.linkedStarSystems = _.remove($scope.starsystem.linkedStarSystems, function(elem) {
          return elem.name == linkedSystem.starSystem.name;
        });
      }
    };
  });
