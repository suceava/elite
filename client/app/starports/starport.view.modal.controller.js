'use strict'

angular.module('eliteApp')
  .controller('starPortViewModalController', function($scope, $modalInstance, starport) {
    $scope.starport = starport;

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  });
