'use strict';

cubdiApp.controller('CupboardCtrl', function($scope, $http) {
    $scope.itemsAdded = [];
    $scope.addItem = function () {
        var newItem = {
            description: $scope.item.description,
            status: "adding"
        };
        $http.post('/command/addItemToShoppingList', $scope.item).success(function () {
            console.log("Item Added", $scope.item);
            newItem.status = "added";
        });
        $scope.itemsAdded.push(newItem);
        $scope.item = {};
    };
});
