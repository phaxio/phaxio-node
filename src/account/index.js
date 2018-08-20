const request = require('request-promise-native');

module.exports = class {
  constructor(apiKey, apiSecret, url) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.url = url;

    this.auth = { user: this.apiKey, pass: this.apiSecret };
  }

  status() {
    return new Promise((resolve, reject) => {
      request({
        method: 'GET',
        url: `${this.url}/account/status`,
        auth: this.auth,
      })
        .then((response) => {
          const res = JSON.parse(response);
          if (!res.success) return reject(res);
          return resolve(res);
        })
        .catch(err => reject(err));
    });
  }
};
