const request = require('request-promise-native');
const errorHandler = require('../error-handler');

module.exports = class {
  constructor(apiKey, apiSecret, url, agentOptions) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.url = url;
    this.agentOptions = agentOptions;

    this.auth = { user: this.apiKey, pass: this.apiSecret };
  }

  releaseNumber(number) {
    return new Promise((resolve, reject) => {
      request({
        method: 'DELETE',
        url: `${this.url}/phone_numbers/${number}`,
        auth: this.auth,
        agentOptions: this.agentOptions,
      })
        .then((response) => {
          const res = JSON.parse(response);
          if (!res.success) return reject(errorHandler(res.message));
          return resolve(res);
        })
        .catch((err) => reject(err));
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
        agentOptions: this.agentOptions,
      };

      if (query.length !== 0) req.qs = query;

      request(req)
        .then((response) => {
          const res = JSON.parse(response);
          if (!res.success) return reject(errorHandler(res.message));
          return resolve(res);
        })
        .catch((err) => reject(err));
    });
  }

  getNumberInfo(number) {
    return new Promise((resolve, reject) => {
      request({
        method: 'GET',
        url: `${this.url}/phone_numbers/${number}`,
        auth: this.auth,
        agentOptions: this.agentOptions,
      })
        .then((response) => {
          const res = JSON.parse(response);
          if (!res.success) return reject(errorHandler(res.message));
          return resolve(res);
        })
        .catch((err) => reject(err));
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
        agentOptions: this.agentOptions,
      };

      if (formData.length !== 0) req.formData = formData;

      request(req)
        .then((response) => {
          const res = JSON.parse(response);
          if (!res.success) return reject(errorHandler(res.message));
          return resolve(res);
        })
        .catch((err) => reject(err));
    });
  }
};
