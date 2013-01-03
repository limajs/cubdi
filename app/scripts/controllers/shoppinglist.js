'use strict';

cubdiApp.controller('ShoppinglistCtrl', function($scope, $http) {
    $http.get('/view/shoppinglist').success(function (data) {
        $scope.items = data.items;

        $scope.itemsRequired = function () {
            return $scope.items.filter(function (item) {
                return (item.state !== 'inBasket' &&
                    item.state !== 'isBeingPurchased' &&
                item.state !== 'error');
            });
        };

        $scope.itemsInBasket = function () {
            return $scope.items.filter(function (item) {
                return (item.state === 'inBasket' ||
                    item.state === 'isBeingPurchased' ||
                item.state === 'error');
            });
        };

        $scope.select = function (item) {
            $scope.currentlySelectedItem = item;
        };

        $scope.isCurrentlySelected = function (item) {
            if (item === $scope.currentlySelectedItem) {
                return "isSelected";
            };
            return "";
        };

        $scope.removeItemFromBasket = function (item) {
            $http.post('/command/removeItemFromBasket', item).success(function (data) {
                item.state = 'isRequired';
            });
            item.state = "removingFromBasket";
            $scope.currentlySelectedItem = null;
        };

        $scope.addItemToBasket = function (item) {
            $http.post('/command/addItemToBasket', item).success(function (data) {
                if (!data) {
                    item.state = 'inBasket';
                } else {
                    item.comments = data.message;
                    item.state = 'error';
                }
            });
            item.state = 'isBeingPurchased';
            $scope.currentlySelectedItem = null;
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

        $scope.basketListHeading = function () {
            var itemsInBasketCount = $scope.itemsInBasket().length;
            if (itemsInBasketCount === 0) {
                return "";
            }
            if (itemsInBasketCount === 1) {
                return "you have 1 thing in your basket";
            }
            return "you have " + itemsInBasketCount + " things in your basket";
        }
    });
});
