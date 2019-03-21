const Faxes = require('./src/faxes');
const Public = require('./src/public');
const Account = require('./src/account');
const PhaxCode = require('./src/phax-code');
const PhoneNumber = require('./src/phone-number');

module.exports = class {
  constructor(apiKey, apiSecret, minTLSVersion) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;

    this.url = 'https://api.phaxio.com/v2.1';
    this.agentOptions = { minVersion: minTLSVersion || 'TLSv1.2' };

    this.public = new Public(this.url, this.agentOptions);
    this.faxes = new Faxes(this.apiKey, this.apiSecret, this.url, this.agentOptions);
    this.account = new Account(this.apiKey, this.apiSecret, this.url, this.agentOptions);
    this.phaxCode = new PhaxCode(this.apiKey, this.apiSecret, this.url, this.agentOptions);
    this.phoneNumber = new PhoneNumber(this.apiKey, this.apiSecret, this.url, this.agentOptions);
  }
};
