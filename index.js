const Faxes = require('./src/faxes');
const Public = require('./src/public');
const Account = require('./src/account');
const PhaxCode = require('./src/phax-code');
const PhoneNumber = require('./src/phone-number');

module.exports = class {
  constructor(apiKey, apiSecret) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;

    this.url = 'https://api.phaxio.com/v2.1';

    this.public = new Public(this.url);
    this.faxes = new Faxes(this.apiKey, this.apiSecret, this.url);
    this.account = new Account(this.apiKey, this.apiSecret, this.url);
    this.phaxCode = new PhaxCode(this.apiKey, this.apiSecret, this.url);
    this.phoneNumber = new PhoneNumber(this.apiKey, this.apiSecret, this.url);
  }
};
