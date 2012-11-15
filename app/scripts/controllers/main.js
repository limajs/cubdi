'use strict';

cubdiApp.controller('MainCtrl', function($scope, $http) {
    $http.get('/view/main').
        success(function (data, status, headers, config) {
            $scope.todaysMeals = data.todaysMeals;
            $scope.reminders = data.reminders;
        });
});
