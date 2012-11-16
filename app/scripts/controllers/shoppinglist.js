'use strict';

cubdiApp.controller('ShoppinglistCtrl', function($scope, $http) {
    $http.get('/view/shoppinglist').success(function (data) {
        $scope.items = data.items;

        $scope.showItemDialog = function (item) {
            console.log("Show Item", item);
        };

        $scope.purchaseItemsInTrolley = function () {
            $scope.itemsInTrolley().forEach(function (item) {
                console.log("Purchasing", item);
                $http.post('/command/purchaseItem', item);
            });
        };

        $scope.numberOfItemsToPurchase = function () {
            return $scope.items.length;
        };

    });
});
