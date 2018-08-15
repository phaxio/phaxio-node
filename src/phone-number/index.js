const request = require('request-promise-native');

module.exports = class {
  constructor(apiKey, apiSecret, url) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.url = url;

    this.auth = { user: this.apiKey, pass: this.apiSecret };
  }

  releaseNumber(number) {
    return new Promise((resolve, reject) => {
      request({
        method: 'DELETE',
        url: `${this.url}/phone_numbers/${number}`,
        auth: this.auth,
      }).then(response => resolve(response))
        .catch(err => reject(err));
    });
  }

  listNumbers(options = { country_code: null, area_code: null }) {
    return new Promise((resolve, reject) => {
      request({
        method: 'GET',
        url: `${this.url}/phone_numbers`,
        qs: options,
        auth: this.auth,
      }).then(response => resolve(response))
        .catch(err => reject(err));
    });
  }

  getNumberInfo(number) {
    return new Promise((resolve, reject) => {
      request({
        method: 'GET',
        url: `${this.url}/phone_numbers/${number}`,
        auth: this.auth,
      }).then(response => resolve(response))
        .catch(err => reject(err));
    });
  }

  provisionNumber(options = { country_code: null, area_code: null, callback_url: null }) {
    return new Promise((resolve, reject) => {
      request({
        method: 'POST',
        url: `${this.url}/phone_numbers`,
        formData: options,
        auth: this.auth,
      }).then(response => resolve(response))
        .catch(err => reject(err));
    });
  }
};
