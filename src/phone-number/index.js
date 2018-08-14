const request = require('request-promise-native');

module.exports = class {
  constructor(apiKey, apiSecret, uri) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.uri = uri;
  }

  getAreaCodes(options = {
    toll_free: false,
    country_code: 1,
    country: 'US',
    state: null,
    per_page: 1000,
    page: 1,
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
};
