'use strict';

cubdiApp.controller('ShoppinglistCtrl', function($scope, $http) {
    $http.get('/view/shoppinglist').success(function (data) {
        $scope.items = data.items;
        $scope.numberOfItemsToPurchase = function () {
            return $scope.items.filter(function (item) {
                return !item.isPurchased
            }).length;
        };

        $scope.requiredItems = function () {
            return $scope.items.filter(function (item) {
                return !item.isPurchased
            })
        };

        $scope.itemsInTrolley = function () {
            return $scope.items.filter(function (item) {
                return item.isPurchased
            })
        };

        $scope.trolleyHasItems = function () {
            return $scope.itemsInTrolley().length > 0;
        };
    });
});