/* eslint arrow-body-style: "off" */
const expect = require('expect.js');

const Account = require('../../src/account');

describe('class: Account', () => {
  it('should be a class', () => {
    // Classes are just special kinds of functions.
    expect(Account).to.be.a('function');
  });

  describe('post-instantiation', () => {
    let account;

    before(() => {
      account = new Account(process.env.TEST_APIKEY, process.env.TEST_APISECRET, 'https://api.phaxio.com/v2.1');
    });

    it('should export appropriate properties and functions', () => {
      expect(account).to.have.property('apiKey');
      expect(account).to.have.property('apiSecret');
      expect(account).to.have.property('url');
      expect(account).to.have.property('status');
      expect(account).to.have.property('agentOptions');
    });

    describe('method: status', () => {
      it('should retreive account status information', () => {
        return account.status()
          .then((response) => {
            expect(response.success).to.be.ok();
            expect(response.message).to.be('Account status retrieved successfully');
            expect(response.data).to.be.an(Object);
          })
          .catch((err) => { throw err; });
      });
    });
  });
});
