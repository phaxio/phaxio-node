const expect = require('expect.js');

const PhoneNumber = require('../../src/phone-number');

describe('class: PhoneNumber', () => {
  it('should be a class', () => {
    // Classes are just special kinds of functions.
    expect(PhoneNumber).to.be.a('function');
  });

  describe('post-instantiation', () => {
    const phoneNumber = new PhoneNumber('mykey', 'mysecret');
    it('should export appropriate properties and functions', () => {
      expect(phoneNumber).to.have.property('apiKey');
      expect(phoneNumber).to.have.property('apiSecret');
      expect(phoneNumber).to.have.property('getAreaCodes');
    });
  });
});
