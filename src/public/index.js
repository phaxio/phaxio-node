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
      request({
        method: 'GET',
        url: `${this.url}/public/area_codes`,
        qs: options,
      }).then(response => resolve(response))
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
      }).then(response => resolve(response))
        .catch(err => reject(err));
    });
  }
};
