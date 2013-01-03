'use strict';

cubdiApp.controller('MenuController', function ($scope, $http) {
    console.log("MenuController");
    $http.get('/view/menu').success(function (data) {
        $scope.meals = data.meals;
    });
});
