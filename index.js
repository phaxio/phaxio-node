const { statSync } = require('fs');

module.exports = class {
  constructor(apiKey, apiSecret, fileDownloadPath = './') {
    // Fails if the download path does not exist.
    statSync(fileDownloadPath);

    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.fileDownloadPath = fileDownloadPath;
  }
};
