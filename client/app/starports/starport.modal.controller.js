'use strict'

angular.module('eliteApp')
  .controller('starPortModalController', function($scope, $modalInstance, starport, metadata, starSystemList, commodityList, factionList) {
    $scope.starport = starport;
    $scope.metadata = metadata;
    $scope.starSystemList = starSystemList;
    $scope.commodityList = commodityList;
    $scope.factionList = factionList;

    $scope.ok = function() {
      $modalInstance.close($scope.starport);
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  });
