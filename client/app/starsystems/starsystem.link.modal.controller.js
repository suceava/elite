'use strict'

angular.module('eliteApp')
  .controller('linkedStarSystemModalController', function($scope, $http, $modalInstance, $window, linkedStarSystem, starSystemList) {
    $scope.linkedStarSystem = linkedStarSystem;
    $scope.starSystemList = starSystemList;

    $scope.ok = function() {
      // find the linked star system by name
      $http.get('api/starsystems/find?name=' + $scope.linkedStarSystem.starSystem.name)
        .success(function(starsystem) {
          // star system found => just close modal
          $modalInstance.close($scope.linkedStarSystem);
        })
        .error(function (data, status, headers, config) {
          if (status != 404) {
            $window.alert('There was an error validating star system');
            return;
          }

          if ($window.confirm('The system ' + $scope.linkedStarSystem.starSystem.name + ' does not exist. Create it?')) {
            $modalInstance.close($scope.linkedStarSystem);
          }
        });
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  });
