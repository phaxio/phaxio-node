const request = require('request-promise-native');

module.exports = class {
  constructor(apiKey, apiSecret) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  status() {
    return new Promise((resolve, reject) => {
      request({
        method: 'GET',
        uri: 'https://api.phaxio.com/v2.1/account/status',
        auth: {
          user: this.apiKey,
          pass: this.apiSecret,
        },
      }).then(response => resolve(response))
        .catch(err => reject(err));
    });
  }
};
