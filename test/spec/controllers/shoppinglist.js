'use strict';

describe('Shopping List Controller', function() {

    // load the controller's module
    beforeEach(module('cubdiApp'));

    var ShoppinglistCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
        scope = $rootScope.$new();

        _$httpBackend_.expectGET('/view/shoppinglist').respond({
            items: [
                {description: 'Apples'},
                {description: 'Pears'},
                {description: 'Oranges', isPurchased: true}
            ]
        });

        ShoppinglistCtrl = $controller('ShoppinglistCtrl', {
            $scope: scope
        });

        _$httpBackend_.flush();
    }));

    it('has a list of shopping list items', function() {
        expect(scope.items.length).toBe(3);
    });

    it('has one item which is already purchased', function () {
        expect(scope.numberOfItemsToPurchase()).toBe(2);
    });
});
