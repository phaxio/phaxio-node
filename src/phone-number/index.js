const request = require('axios');
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
    return request
      .delete(`${this.url}/phone_numbers/${number}`, {
        auth: auth
      })
      .then((response) => {
        const res = JSON.parse(response);
        if (!res.success) return reject(errorHandler(res.message));
        return resolve(res);
      })
      .catch((err) => reject(err));
  }

  listNumbers(options = { country_code: null, area_code: null }) {
    const query = {};
    Object.keys(options).forEach((rec) => {
      if (options[rec] !== null) query[rec] = options[rec];
    });

    if (query.length !== 0) req.qs = query;

    return request
      .get(`${this.url}/phone_numbers`, query, {
        auth: auth
      })
      .then((response) => {
        const res = JSON.parse(response);
        if (!res.success) return reject(errorHandler(res.message));
        return resolve(res);
      })
      .catch((err) => reject(err));
  }

  getNumberInfo(number) {
    return request
      .get(`${this.url}/phone_numbers/${number}`, {
        auth: auth
      })
      .then((response) => {
        const res = JSON.parse(response);
        if (!res.success) return reject(errorHandler(res.message));
        return resolve(res);
      })
      .catch((err) => reject(err));
  }

  provisionNumber(options = { country_code: null, area_code: null, callback_url: null }) {
    const form = new FormData;
    Object.keys(options).forEach((rec) => {
      if (options[rec] !== null) form.append('rec', options[rec]);
    });

    if (formData.length !== 0) req.formData = formData;

    return request
      .post(`${this.url}/phone_numbers`, form, {
        auth: auth
      })
      .then((response) => {
        const res = JSON.parse(response);
        if (!res.success) return reject(errorHandler(res.message));
        return resolve(res);
      })
      .catch((err) => reject(err));
  }
};
