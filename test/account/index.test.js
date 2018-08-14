const expect = require('expect.js');

const Account = require('../../src/account');

describe('class: Account', () => {
  it('should be a class', () => {
    // Classes are just special kinds of functions.
    expect(Account).to.be.a('function');
  });

  describe('post-instantiation', () => {
    const account = new Account('mykey', 'mysecret');
    it('should export appropriate properties and functions', () => {
      expect(account).to.have.property('apiKey');
      expect(account).to.have.property('apiSecret');
      expect(account).to.have.property('status');
    });

    it('should have a method `status()`', () => {
      expect(account.status).to.be.a('function');
    });

    describe('method: status', () => {
      it('should retreive account status information');
    });
  });
});
