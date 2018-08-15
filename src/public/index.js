const request = require('request-promise-native');

module.exports = class {
  constructor(url) {
    this.url = url;
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
      };

      if (qs.length !== 0) req.qs = qs;

      request(req)
        .then(response => resolve(JSON.parse(response)))
        .catch(err => reject(err));
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
      }).then(response => resolve(JSON.parse(response)))
        .catch(err => reject(err));
    });
  }
};
