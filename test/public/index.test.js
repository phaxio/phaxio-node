const expect = require('expect.js');

const Public = require('../../src/public');

describe('class: Public', () => {
  it('should be a class', () => {
    // Classes are just special kinds of functions.
    expect(Public).to.be.a('function');
  });

  describe('post-instantiation', () => {
    // `public` by itself is reserved in JavaScript.
    const pub = new Public('https://api.phaxio.com/v2.1');
    it('should export appropriate properties and functions', () => {
      expect(pub).to.have.property('url');
      expect(pub).to.have.property('getAreaCodes');
      expect(pub).to.have.property('getCountries');
    });

    describe('method: getAreaCodes', () => {
      it('should get a list of area codes based on the filters');
    });

    describe('method: getCountries', () => {
      it('should get a list of countries based on paging filters');
    });
  });
});
