'use strict'

angular.module('eliteApp')
  .controller('commodityModalController', function($scope, $modalInstance, commodity, metadata, types) {
    $scope.commodity = commodity;
    $scope.metadata = metadata;
    $scope.types = types;

    $scope.ok = function() {
      $modalInstance.close($scope.commodity);
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  });
