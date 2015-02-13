'use strict'

angular.module('eliteApp')
  .controller('starPortModalController', function($scope, $modalInstance, starport, starSystemList, allegianceList, factionList, governmentList) {
    $scope.starport = starport;
    $scope.starSystemList = starSystemList;
    $scope.allegianceList = allegianceList;
    $scope.governmentList = governmentList;
    $scope.factionList = factionList;

    $scope.ok = function() {
      $modalInstance.close($scope.starport);
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  });
