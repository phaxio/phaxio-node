const request = require('request-promise-native');

module.exports = class {
  constructor(apiKey, apiSecret, uri) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.uri = uri;

    this.auth = { user: this.apiKey, pass: this.apiSecret };
  }

  getAreaCodes(options = {
    toll_free: null,
    country_code: null,
    country: null,
    state: null,
    per_page: null,
    page: null,
  }) {
    return new Promise((resolve, reject) => {
      request({
        method: 'GET',
        uri: `${this.uri}/public/area_codes`,
        qs: options,
      }).then(response => resolve(response))
        .catch(err => reject(err));
    });
  }

  releaseNumber(number) {
    return new Promise((resolve, reject) => {
      request({
        method: 'DELETE',
        uri: `${this.uri}/phone_numbers/${number}`,
        auth: this.auth,
      }).then(response => resolve(response))
        .catch(err => reject(err));
    });
  }

  listNumbers(options = { country_code: null, area_code: null }) {
    return new Promise((resolve, reject) => {
      request({
        method: 'GET',
        uri: `${this.uri}/phone_numbers`,
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
        uri: `${this.uri}/phone_numbers/${number}`,
        auth: this.auth,
      }).then(response => resolve(response))
        .catch(err => reject(err));
    });
  }

  provisionNumber(options = { country_code: null, area_code: null, callback_url: null }) {
    return new Promise((resolve, reject) => {
      request({
        method: 'POST',
        uri: `${this.uri}/phone_numbers`,
        formData: options,
        auth: this.auth,
      }).then(response => resolve(response))
        .catch(err => reject(err));
    });
  }
};
