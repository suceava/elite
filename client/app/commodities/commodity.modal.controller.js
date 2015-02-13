'use strict'

angular.module('eliteApp')
  .controller('commodityModalController', function($scope, $modalInstance, commodity, types) {
    $scope.commodity = commodity;
    $scope.types = types;

    $scope.ok = function() {
      $modalInstance.close($scope.commodity);
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  });
