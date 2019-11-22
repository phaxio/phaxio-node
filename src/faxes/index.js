const fs = require('fs');
const request = require('request-promise-native');
const errorHandler = require('../error-handler');

const Fax = require('./fax');
const {
  cancel,
  resend,
  testDelete,
  getInfo,
  getFile,
  deleteFile,
} = require('./shared-methods');

module.exports = class {
  constructor(apiKey, apiSecret, url, agentOptions) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.url = url;
    this.agentOptions = agentOptions;

    this.auth = { user: this.apiKey, pass: this.apiSecret };
  }

  async cancel(id) {
    const canc = await cancel(this.url, id, this.auth, this.agentOptions);
    return canc;
  }

  async resend(options = { id: null, callback_url: null }) {
    const res = await resend(this.url, options.id, this.auth, options, this.agentOptions);
    return res;
  }

  async testDelete(id) {
    const td = await testDelete(this.url, id, this.auth, this.agentOptions);
    return td;
  }

  async getInfo(id) {
    const gi = await getInfo(this.url, id, this.auth, this.agentOptions);
    return gi;
  }

  async getFile(options = { id: null, thumbnail: null }) {
    const gf = await getFile(this.url, options.id, this.auth, options, this.agentOptions);
    return gf;
  }

  async deleteFile(id) {
    const df = await deleteFile(this.url, id, this.auth, this.agentOptions);
    return df;
  }

  create(options = {
    to: null,
    file: null,
    content_url: null,
    header_text: null,
    batch_delay: null,
    batch_collision_avoidance: null,
    callback_url: null,
    cancel_timeout: null,
    tags: null,
    caller_id: null,
    test_fail: null,
  }) {
    // eslint-disable-next-line consistent-return
    return new Promise((resolve, reject) => {
      const formData = {};

      Object.keys(options).forEach((rec) => {
        if (options[rec] !== null) formData[rec] = options[rec];
        if (typeof formData[rec] === 'boolean') formData[rec] = formData[rec].toString();
      });

      const req = {
        method: 'POST',
        url: `${this.url}/faxes`,
        auth: this.auth,
        agentOptions: this.agentOptions,
      };

      const caller = request(req);
      const form = caller.form();
      Object.keys(formData).forEach((key) => {
        if (typeof formData[key] === 'object' && key === 'tags' && formData[key] !== null) {
          Object.keys(formData[key]).forEach((tagkey) => {
            form.append(`tag[${tagkey}]`, formData[key][tagkey]);
          });
        } else if (Array.isArray(formData[key]) && key === 'file') {
          formData[key].forEach((val) => {
            form.append(`${key}[]`, fs.createReadStream(val));
          });
        } else if (Array.isArray(formData[key])) {
          formData[key].forEach((val) => {
            form.append(`${key}[]`, val);
          });
        } else if (key === 'file') {
          form.append(key, fs.createReadStream(formData[key]));
        } else {
          form.append(key, formData[key]);
        }
      });

      caller
        .then((response) => {
          const res = JSON.parse(response);
          if (!res.success) return reject(errorHandler(res.message));
          // eslint-disable-next-line max-len
          return resolve(new Fax(this.apiKey, this.apiSecret, this.url, res.success, res.message, res.data));
        })
        .catch((err) => reject(err));
    });
  }

  testReceive(options = {
    file: null,
    from_number: null,
    to_number: null,
  }) {
    return new Promise((resolve, reject) => {
      const formData = { direction: 'received' };

      Object.keys(options).forEach((rec) => {
        if (rec === 'file' && options[rec] !== null) {
          formData[rec] = fs.createReadStream(options[rec]);
        } else if (options[rec] !== null) {
          formData[rec] = options[rec];
        }
      });

      request({
        method: 'POST',
        url: `${this.url}/faxes`,
        auth: this.auth,
        formData,
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

  listFaxes(options = {
    created_before: null,
    created_after: null,
    direction: null,
    status: null,
    phone_number: null,
    tags: null,
    per_page: null,
    page: null,
  }) {
    return new Promise((resolve, reject) => {
      const query = {};
      Object.keys(options).forEach((rec) => {
        if (rec === 'tags' && typeof options[rec] === 'object' && options[rec] !== null) {
          Object.keys(options[rec]).forEach((tag) => {
            const newrec = `tag[${tag}]`;
            query[newrec] = options[rec][tag];
          });
        } else if (options[rec] !== null) {
          query[rec] = options[rec];
        }
      });

      request({
        method: 'GET',
        url: `${this.url}/faxes`,
        auth: this.auth,
        qs: query,
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
