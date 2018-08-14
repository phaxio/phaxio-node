const { statSync } = require('fs');

const Account = require('./src/account');

module.exports = class {
  constructor(apiKey, apiSecret, fileDownloadPath = './') {
    // Fails if the download path does not exist.
    statSync(fileDownloadPath);

    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.fileDownloadPath = fileDownloadPath;

    this.account = new Account(this.apiKey, this.apiSecret);
  }
};
