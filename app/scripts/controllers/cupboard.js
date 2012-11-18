'use strict';

cubdiApp.controller('CupboardCtrl', function($scope, $http) {
    $scope.addItem = function () {
        $http.post('/command/addItemToShoppingList', $scope.item).success(function () {
            console.log("Item Added", $scope.item);
        });
    };
});
