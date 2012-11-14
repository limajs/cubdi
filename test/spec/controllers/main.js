'use strict';

describe('Main Controller', function() {

    // load the controller's module
    beforeEach(module('cubdiApp'));

    var MainController,
    scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller) {
        scope = {
            todaysMeals: [
                'Lasagne',
                'Sticky Toffee Pudding'
            ]
        };
        MainController = $controller('MainController', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function() {
        expect(scope.awesomeThings.length).toBe(3);
        expect(scope.todaysMeals.length).toBe(2);
    });
});
