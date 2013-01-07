'use strict';

cubdiApp.controller('CupboardCtrl', function($scope, $http) {
    $http.get('/view/cupboard').success(function (data) {

        $scope.itemsInCupboard = data.items;

        $scope.itemsAdded = [];

    });

    $scope.addItem = function () {
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });

        var newItem = {
            id: uuid,
            description: $scope.item.description,
            status: "adding"
        };
        $http.post('/command/addItemToShoppingList', newItem).success(function () {
            console.log("Item Added", $scope.item);
            newItem.status = "added";
        });
        $scope.itemsAdded.push(newItem);
        $scope.item = {};
    };
});
