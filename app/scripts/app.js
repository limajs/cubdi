'use strict';

var cubdiApp = angular.module('cubdiApp', [])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainController'
    })
    .otherwise({
        redirectTo: '/'
    });
}]);
