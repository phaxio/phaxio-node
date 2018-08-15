const request = require('request-promise-native');

module.exports = class {
  constructor(uri) {
    this.uri = uri;
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

  getCountries(options = {
    per_page: null,
    page: null,
  }) {
    return new Promise((resolve, reject) => {
      request({
        method: 'GET',
        uri: `${this.uri}/public/countries`,
        qs: options,
      }).then(response => resolve(response))
        .catch(err => reject(err));
    });
  }
};
