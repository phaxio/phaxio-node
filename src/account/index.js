const request = require('request-promise-native');

module.exports = class {
  constructor(apiKey, apiSecret, uri) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.uri = uri;

    this.auth = { user: this.apiKey, pass: this.apiSecret };
  }

  status() {
    return new Promise((resolve, reject) => {
      request({
        method: 'GET',
        uri: `${this.uri}/account/status`,
        auth: this.auth,
      }).then(response => resolve(response))
        .catch(err => reject(err));
    });
  }
};
