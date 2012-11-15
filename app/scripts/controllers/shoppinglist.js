'use strict';

cubdiApp.controller('ShoppinglistCtrl', function($scope, $http) {
    $http.get('/view/shoppinglist').success(function (data) {
        $scope.items = data.items;
        $scope.numberOfItemsToPurchase = function () {
            return $scope.items.filter(function (item) {
                return !item.isPurchased
            }).length;
        };
    });
});
