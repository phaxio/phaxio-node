const request = require('request-promise-native');

module.exports = class {
  constructor(apiKey, apiSecret, uri) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.uri = uri;
  }

  create(options) {
    return new Promise((resolve, reject) => {
      request({
        method: 'POST',
        uri: `${this.uri}/phax_codes`,
        auth: {
          user: this.apiKey,
          pass: this.apiSecret,
        },
        qs: options,
      }).then(response => resolve(response))
        .catch(err => reject(err));
    });
  }

  get(id = null) {
    return new Promise((resolve, reject) => {
      request({
        method: 'GET',
        uri: `${this.uri}/phax_codes/${id}`,
        auth: {
          user: this.apiKey,
          pass: this.apiSecret,
        },
      }).then(response => resolve(response))
        .catch(err => reject(err));
    });
  }
};
