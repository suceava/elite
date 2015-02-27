'use strict'

angular.module('eliteApp')
  .directive('autoresize', function($window, $document) {
    return function(scope, element, attr) {
      $window.on('resize', function(e) {
        
      });
    };
  });