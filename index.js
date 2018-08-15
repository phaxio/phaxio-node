const { statSync } = require('fs');

const Account = require('./src/account');
const PhaxCode = require('./src/phax-code');
const PhoneNumber = require('./src/phone-number');
const Faxes = require('./src/faxes');

module.exports = class {
  constructor(apiKey, apiSecret, fileDownloadPath = './') {
    // Fails if the download path does not exist.
    statSync(fileDownloadPath);

    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.fileDownloadPath = fileDownloadPath;

    this.uri = 'https://api.phaxio.com/v2.1';

    this.account = new Account(this.apiKey, this.apiSecret, this.uri);
    this.phaxCode = new PhaxCode(this.apiKey, this.apiSecret, this.uri);
    this.phoneNumber = new PhoneNumber(this.apiKey, this.apiSecret, this.uri);
    this.faxes = new Faxes(this.apiKey, this.apiSecret, this.uri);
  }
};
