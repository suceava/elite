'use strict'

angular.module('eliteApp')
  .controller('linkedStarSystemModalController', function($scope, $modalInstance, linkedStarSystem, starSystemList) {
    $scope.linkedStarSystem = linkedStarSystem;
    $scope.starSystemList = starSystemList;

    $scope.ok = function() {
      $modalInstance.close($scope.linkedStarSystem);
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  });
