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

  create(options = { metadata: null, type: null }) {
    const form = new FormData;
    Object.keys(options).forEach((rec) => {
      if (options[rec] !== null) form.append('rec', options[rec]);
    });

    const req = {
      method: 'POST',
      url: `${this.url}/phax_codes`,
      auth: this.auth,
      agentOptions: this.agentOptions,
    };

    return request
      .post(`${this.url}/phax_codes`, form, {
        auth: auth
      })
      .then((response) => {
        const res = JSON.parse(response);
        if (!res.success) return reject(errorHandler(res.message));
        return resolve(res);
      })
      .catch((err) => reject(err));
  }

  get(options = { id: null, type: null }) {
    let phaxCode;
    if (options.id === null) {
      phaxCode = 'phax_code';
    } else {
      phaxCode = `phax_codes/${options.id}`;
    }

    if (options.type !== null) req.type = options.type;

    return request
      .get(`${this.url}/${phaxCode}`, {
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
