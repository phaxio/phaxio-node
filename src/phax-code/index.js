const request = require('request-promise-native');

module.exports = class {
  constructor(apiKey, apiSecret, url) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.url = url;

    this.auth = { user: this.apiKey, pass: this.apiSecret };
  }

  create(options) {
    return new Promise((resolve, reject) => {
      request({
        method: 'POST',
        url: `${this.url}/phax_codes`,
        auth: this.auth,
        formData: options,
      }).then(response => resolve(response))
        .catch(err => reject(err));
    });
  }

  get(id = null) {
    return new Promise((resolve, reject) => {
      request({
        method: 'GET',
        url: `${this.url}/phax_codes/${id}`,
        auth: this.auth,
      }).then(response => resolve(response))
        .catch(err => reject(err));
    });
  }
};
