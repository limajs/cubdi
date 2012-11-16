'use strict';

cubdiApp.controller('ShoppinglistCtrl', function($scope, $http) {
    $http.get('/view/shoppinglist').success(function (data) {
        $scope.items = data.items;

        $scope.placeInTrolley = function (item) {
            item.isPurchased = true;
        };

        $scope.purchaseItemsInTrolley = function () {
            $scope.itemsInTrolley().forEach(function (item) {
                console.log("Purchasing", item);
                $http.post('/command/purchaseItem', item);
            });
        };

        $scope.numberOfItemsToPurchase = function () {
            return $scope.items.filter(function (item) {
                return !item.isPurchased;
            }).length;
        };

        $scope.requiredItems = function () {
            return $scope.items.filter(function (item) {
                return !item.isPurchased;
            });
        };

        $scope.itemsInTrolley = function () {
            return $scope.items.filter(function (item) {
                return item.isPurchased;
            });
        };

        $scope.trolleyHasItems = function () {
            return $scope.itemsInTrolley().length > 0;
        };
    });
});
