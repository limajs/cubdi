'use strict';

cubdiApp.controller('MenuController', function ($scope, $http) {
    console.log("MenuController");
    $http.get('/view/menu').success(function (data) {
        $scope.meals = data.meals;
    });

    $scope.newMealDescription = "";

    $scope.addMealToMenu = function () {
        var newMeal = {
            description: $scope.newMealDescription
        };
        $http.post('/command/addMealToMenu', newMeal).success(function () {
            console.log("Added Meal", newMeal);
        });
        $scope.newMealDescription = "";
    };
});
