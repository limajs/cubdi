'use strict';

function removeEntity(entity, fromArray) {
    console.log("Removing entity", entity, "from", fromArray);
    for(var i=fromArray.length; i-- > 0;) {
        console.log("Checking", fromArray[i]);
        if (fromArray[i] === entity) {
            console.log("Removing entity", entity, "from array", fromArray);
            fromArray.splice(i, 1);
        }
        console.log("Removed entity, array now", fromArray)};
    };

function moveEntity(entity, fromArray, toArray) {
    removeEntity(entity, fromArray);
    console.log("Adding entity", entity, "to", toArray);
    toArray.push(entity);
};

cubdiApp.controller('ShoppinglistCtrl', function($scope, $http) {
    $http.get('/view/shoppinglist').success(function (data) {
        $scope.itemsRequired = data.itemsRequired;
        $scope.itemsInBasket = data.itemsPurchased;

        $scope.showBasketList = function () {
            if ($scope.itemsInBasket.length > 0) {
                return "show";
            }
            return "";
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
            moveEntity(item, $scope.itemsRequired, $scope.itemsInBasket);

            item.state = 'isBeingPurchased';
            $scope.currentlySelectedItem = null;
        };

        $scope.checkoutAllItems = function () {
            $http.post('/command/checkoutItems', $scope.itemsInBasket).success(function () {
                $scope.itemsInBasket = [];
            });
        };

        $scope.itemNoLongerNeeded = function (item) {
            $http.post('/command/itemNoLongerNeeded', item).success(function (data) {
                for(var i=$scope.itemsRequired.length; i-- > 0;) {
                    if ($scope.itemsRequired[i].id === item.id) {
                        console.log("Removing item", $scope.itemsRequired[i]);
                        $scope.itemsRequired.splice(i, 1);
                    }
                }
            });
            item.state = "beingRemoved";
        };

        $scope.shoppingListHeading = function () {
            var itemsRequiredCount = $scope.itemsRequired.length;
            if (itemsRequiredCount === 0) {
                return "you don't need to buy any more things :)";
            }
            if (itemsRequiredCount === 1) {
                return "you need to buy 1 thing"
            }
            return "you need to buy " + $scope.itemsRequired.length + " things"
        };

        $scope.basketListHeading = function () {
            var itemsInBasketCount = $scope.itemsInBasket.length;
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
