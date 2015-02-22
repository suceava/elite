'use strict'

angular.module('eliteApp')
  .directive('autocomplete', function($timeout) {
    return function(scope, iElement, iAttrs) {
      iElement.autocomplete({
        source: scope[iAttrs.uiItems],
        select: function() {
          iElement.trigger('input');
        }
      });
    };
  });