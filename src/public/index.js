const request = require('axios');
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

    return request
      .get(`${this.url}/public/area_codes`, qs)
      .then((response) => {
        const res = JSON.parse(response);
        if (!res.success) return reject(errorHandler(res.message));
        return resolve(res);
      })
      .catch((err) => reject(err));
  }

  getCountries(options = {
    per_page: null,
    page: null,
  }) {
    return request
      .get(`${this.url}/public/countries`)
      .then((response) => {
        const res = JSON.parse(response);
        if (!res.success) return reject(errorHandler(res.message));
        return resolve(res);
      })
      .catch((err) => reject(err));
  }
};
