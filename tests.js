var expect = require('chai').expect;

describe("Smoke Test", function () {
  it("Works", function () {
    expect('foo').to.be.a('string');
    expect('foo').to.have.length(3);
  });
});
