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

  status() {
    return new Promise((resolve, reject) => {
      request({
        method: 'GET',
        url: `${this.url}/account/status`,
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
};
