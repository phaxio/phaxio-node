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
      }).then(response => resolve(JSON.parse(response)))
        .catch(err => reject(err));
    });
  }

  listNumbers(options = { country_code: null, area_code: null }) {
    return new Promise((resolve, reject) => {
      const query = {};
      Object.keys(options).forEach((rec) => {
        if (options[rec] !== null) query[rec] = options[rec];
      });

      const req = {
        method: 'GET',
        url: `${this.url}/phone_numbers`,
        auth: this.auth,
      };

      if (query.length !== 0) req.qs = query;

      request(req)
        .then(response => resolve(JSON.parse(response)))
        .catch(err => reject(err));
    });
  }

  getNumberInfo(number) {
    return new Promise((resolve, reject) => {
      request({
        method: 'GET',
        url: `${this.url}/phone_numbers/${number}`,
        auth: this.auth,
      }).then(response => resolve(JSON.parse(response)))
        .catch(err => reject(err));
    });
  }

  provisionNumber(options = { country_code: null, area_code: null, callback_url: null }) {
    return new Promise((resolve, reject) => {
      const formData = {};
      Object.keys(options).forEach((rec) => {
        if (options[rec] !== null) formData[rec] = options[rec];
      });

      const req = {
        method: 'POST',
        url: `${this.url}/phone_numbers`,
        auth: this.auth,
      };

      if (formData.length !== 0) req.formData = formData;

      request(req)
        .then(response => resolve(JSON.parse(response)))
        .catch(err => reject(err));
    });
  }
};
