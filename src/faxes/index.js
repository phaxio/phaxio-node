const fs = require('fs');
const request = require('axios');
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
      const formData = {};

      Object.keys(options).forEach((rec) => {
        if (options[rec] !== null) formData[rec] = options[rec];
        if (typeof formData[rec] === 'boolean') formData[rec] = formData[rec].toString();
      });

      const form = new FormData();
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

      return request
        .post(`${this.url}/account/status`, form, {
          auth: this.auth
        })
        .then((response) => {
          const res = JSON.parse(response);
          if (!res.success) return Promise.reject(errorHandler(res.message));
          // eslint-disable-next-line max-len
          return resolve(new Fax(this.apiKey, this.apiSecret, this.url, res.success, res.message, res.data));
        })
        .catch((err) => Promise.reject(err));
  }

  testReceive(options = {
    file: null,
    from_number: null,
    to_number: null,
  }) {
    const form = new FormData();

    form.append('direction', 'received');

    Object.keys(options).forEach((rec) => {
      if (rec === 'file' && options[rec] !== null) {
        form.append('fileAttachment', fs.createReadStream(options[rec]));
      } else if (options[rec] !== null) {
        form.append('rec', options[rec]);
      }
    });

    return request
      .post(`${this.url}/faxes`, form, {
        auth: this.auth
      })
      .then((response) => {
        const res = JSON.parse(response);
        if (!res.success) return Promise.reject(errorHandler(res.message));
        return resolve(res);
      })
      .catch((err) => Promise.reject(err));
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

    return request
      .get(`${this.url}/faxes`, query, {
        auth: this.auth
      })
      .then((response) => {
        const res = JSON.parse(response);
        if (!res.success) return Promise.reject(errorHandler(res.message));
        return resolve(res);
      })
      .catch((err) => Promise.reject(err));
  }
};
