'use strict';

var cubdiApp = angular.module('cubdiApp', [])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/shoppinglist', {
        templateUrl: 'views/shoppinglist.html',
        controller: 'ShoppinglistCtrl'
      })
      .when('/cupboard', {
        templateUrl: 'views/cupboard.html',
        controller: 'CupboardCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
