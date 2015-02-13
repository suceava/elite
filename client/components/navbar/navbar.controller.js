'use strict';

angular.module('eliteApp')
  .controller('navbarController', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }, {
      'title': 'Commodities',
      'link': '/commodities'
    }, {
      'title': 'Star Systems',
      'link': '/starsystems'
    }, {
      'title': 'Star Ports',
      'link': '/starports'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });