describe('Main controller', function() {

    describe('Main', function(){
        var scope, ctrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('/view/main').respond({
                todaysMeals: [
                    'Lasagne',
                    'Sticky Toffee Pudding'
                ],
                reminders: [
                    {description: 'Reminder 1'},
                    {description: 'Reminder 2'}
                ]
            });

            scope = $rootScope.$new();
            ctrl = $controller(MainCtrl, {$scope: scope});
        }));

        it('Has todays meals', function () {
            $httpBackend.flush();
            expect(scope.todaysMeals.length).toBe(2);
            expect(scope.todaysMeals[0]).toBe('Lasagne');
            expect(scope.todaysMeals[1]).toBe('Sticky Toffee Pudding');
        });

        it('Has a list of reminders', function () {
            $httpBackend.flush();
            expect(scope.reminders.length).toBe(2);
        });
    });
});
