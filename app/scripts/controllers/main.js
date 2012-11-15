'use strict';

cubdiApp.controller('MainCtrl', function($scope) {
    $scope.todaysMeals = [
        'Vegetable Lasagne'
    ];

    $scope.reminders = [
        {description: "Take fish out of freezer"},
        {description: "Bake loaf for croutons"}
    ];
});
