const expect = require('expect.js');

const Account = require('../../src/account');

describe('class: Account', () => {
  it('should be a class', () => {
    // Classes are just special kinds of functions.
    expect(Account).to.be.a('function');
  });

  describe('post-instantiation', () => {
    const account = new Account('mykey', 'mysecret', 'https://api.phaxio.com/v2.1');
    it('should export appropriate properties and functions', () => {
      expect(account).to.have.property('apiKey');
      expect(account).to.have.property('apiSecret');
      expect(account).to.have.property('url');
      expect(account).to.have.property('status');
    });

    describe('method: status', () => {
      it('should retreive account status information');
    });
  });
});
