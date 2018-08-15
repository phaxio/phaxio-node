const expect = require('expect.js');

const PhoneNumber = require('../../src/phone-number');

describe('class: PhoneNumber', () => {
  it('should be a class', () => {
    // Classes are just special kinds of functions.
    expect(PhoneNumber).to.be.a('function');
  });

  describe('post-instantiation', () => {
    const phoneNumber = new PhoneNumber('mykey', 'mysecret', 'https://api.phaxio.com/v2.1');
    it('should export appropriate properties and functions', () => {
      expect(phoneNumber).to.have.property('apiKey');
      expect(phoneNumber).to.have.property('apiSecret');
      expect(phoneNumber).to.have.property('url');
      expect(phoneNumber).to.have.property('releaseNumber');
      expect(phoneNumber).to.have.property('listNumbers');
      expect(phoneNumber).to.have.property('getNumberInfo');
      expect(phoneNumber).to.have.property('provisionNumber');
    });

    describe('method: releaseNumber', () => {
      it('should get a message indicating that it successfully released the number');
    });

    describe('method: listNumbers', () => {
      it('should get a list of numbers you have registered based on the set filters');
    });

    describe('method: getNumberInfo', () => {
      it('should get information about the number requested');
    });

    describe('method: provisionNumber', () => {
      it('should successfully provision a number with the requeted parameters');
    });
  });
});
