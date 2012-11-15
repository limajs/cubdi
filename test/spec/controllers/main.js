'use strict';

describe('Controller: MainCtrl', function() {

    // load the controller's module
    beforeEach(module('cubdiApp'));

    var MainCtrl,
    scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller) {
        scope = {};
        MainCtrl = $controller('MainCtrl', {
            $scope: scope
        });
    }));

    it('shows a list of todays meals', function() {
        expect(scope.todaysMeals.length).toBe(1);
    });

    it('shows a list of reminders', function () {
        expect(scope.reminders.length).toBe(2);
    });
});
