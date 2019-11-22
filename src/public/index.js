const request = require('request-promise-native');
const errorHandler = require('../error-handler');

module.exports = class {
  constructor(url, agentOptions) {
    this.url = url;
    this.agentOptions = agentOptions;
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
      const qs = {};
      Object.keys(options).forEach((rec) => {
        if (options[rec] !== null) qs[rec] = options[rec];
      });

      const req = {
        method: 'GET',
        url: `${this.url}/public/area_codes`,
        agentOptions: this.agentOptions,
      };

      if (qs.length !== 0) req.qs = qs;

      request(req)
        .then((response) => {
          const res = JSON.parse(response);
          if (!res.success) return reject(errorHandler(res.message));
          return resolve(res);
        })
        .catch((err) => reject(err));
    });
  }

  getCountries(options = {
    per_page: null,
    page: null,
  }) {
    return new Promise((resolve, reject) => {
      request({
        method: 'GET',
        url: `${this.url}/public/countries`,
        qs: options,
      })
        .then((response) => {
          const res = JSON.parse(response);
          if (!res.success) return reject(errorHandler(res.message));
          return resolve(res);
        })
        .catch((err) => reject(err));
    });
  }
};
