'use strict';

describe('Controller: CupboardCtrl', function() {

  // load the controller's module
  beforeEach(module('cubdiApp'));

  var CupboardCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    scope = {};
    CupboardCtrl = $controller('CupboardCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
