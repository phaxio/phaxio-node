const request = require('axios');
const errorHandler = require('../error-handler');

module.exports = class {
  constructor(apiKey, apiSecret, url, agentOptions) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.url = url;
    this.agentOptions = agentOptions;

    this.auth = { username: this.apiKey, password: this.apiSecret };
  }

  status() {
    return request
      .get(`${this.url}/account/status`, {
        auth: this.auth
      })
      .then((response) => {
        const tempResponse = response;
        if (!response.data.success) return Promise.reject(errorHandler(response.data.message));
        return Promise.resolve(response.data);
      })
      .catch((err) => Promise.reject(err));
  }
};
