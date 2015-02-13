'use strict';

angular.module('eliteApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/signup/signup.html',
        controller: 'signupController'
      });
  });