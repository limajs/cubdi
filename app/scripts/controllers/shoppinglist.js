'use strict';

cubdiApp.controller('ShoppinglistCtrl', function($scope, $http) {
    $http.get('/view/shoppinglist').success(function (data) {
        $scope.items = data.items;

        $scope.itemsRequired = function () {
            return $scope.items.filter(function (item) {
                return (item.state !== 'isPurchased' &&
                    item.state !== 'isBeingPurchased' &&
                item.state !== 'error');
            });
        };

        $scope.itemsPurchased = function () {
            return $scope.items.filter(function (item) {
                return (item.state === 'isPurchased' ||
                    item.state === 'isBeingPurchased' ||
                item.state === 'error');
            });
        };

        $scope.select = function (item) {
            item.state = 'isSelected';
            $scope.currentlySelectedItem = item;
        };

        $scope.removeItemFromBasket = function (item) {
            $http.post('/command/removeItemFromBasket', item).success(function (data) {
                item.state = '';
            });
        };

        $scope.purchaseItem = function (item) {
            $http.post('/command/purchaseItem', item).success(function (data) {
                if (!data) {
                    item.state = 'isPurchased';
                } else {
                    item.comments = data.message;
                    item.state = 'error';
                }
            });
            item.state = 'isBeingPurchased';
        };

        $scope.shoppingListHeading = function () {
            var itemsRequiredCount = $scope.itemsRequired().length;
            if (itemsRequiredCount === 0) {
                return "you don't need to buy any more things :)";
            }
            if (itemsRequiredCount === 1) {
                return "you need to buy 1 thing"
            }
            return "you need to buy " + $scope.itemsRequired().length + " thing(s)"
        };
    });
});
