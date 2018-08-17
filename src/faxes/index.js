/* eslint camelcase: "off" */
const fs = require('fs');
const request = require('request-promise-native');

module.exports = class {
  constructor(apiKey, apiSecret, url) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.url = url;

    this.auth = { user: this.apiKey, pass: this.apiSecret };
  }

  create(options = {
    to: null,
    file: null,
    content_url: null,
    header_text: null,
    batch: null,
    batch_delay: null,
    batch_collision_avoidance: null,
    callback_url: null,
    cancel_timeout: null,
    tags: null,
    caller_id: null,
    test_fail: null,
  }) {
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
      };

      const r = request(req);
      const form = r.form();
      Object.keys(formData).forEach((key) => {
        if (Array.isArray(formData[key]) && key === 'file') {
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

      r.then(response => resolve(JSON.parse(response))).catch(err => reject(err));
    });
  }

  cancel(id) {
    return new Promise((resolve, reject) => {
      request({
        method: 'POST',
        url: `${this.url}/faxes/${id}/cancel`,
        auth: this.auth,
      }).then(response => resolve(JSON.parse(response)))
        .catch(err => reject(err));
    });
  }

  resend(options = { id: null, callback_url: null }) {
    return new Promise((resolve, reject) => {
      const { id, callback_url } = options;

      const req = {
        method: 'POST',
        url: `${this.url}/faxes/${id}/resend`,
        auth: this.auth,
        callback_url,
      };

      if (req.callback_url === null || req.callback_url === undefined) delete req.callback_url;

      request(req)
        .then(response => resolve(JSON.parse(response)))
        .catch(err => reject(err));
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
      }).then(response => resolve(JSON.parse(response)))
        .catch(err => reject(err));
    });
  }

  testDelete(id) {
    return new Promise((resolve, reject) => {
      request({
        method: 'DELETE',
        url: `${this.url}/faxes/${id}`,
        auth: this.auth,
      }).then(response => resolve(JSON.parse(response)))
        .catch(err => reject(err));
    });
  }

  getInfo(id) {
    return new Promise((resolve, reject) => {
      request({
        method: 'GET',
        url: `${this.url}/faxes/${id}`,
        auth: this.auth,
      }).then(response => resolve(JSON.parse(response)))
        .catch(err => reject(err));
    });
  }

  getFile(options = { id: null, thumbnail: null }) {
    return new Promise((resolve, reject) => {
      const { id, thumbnail } = options;

      const req = {
        method: 'GET',
        url: `${this.url}/faxes/${id}/file`,
        auth: this.auth,
        qs: { thumbnail },
      };

      if (req.qs.thumbnail === undefined) delete req.qs;

      request(req)
        .then(response => resolve(response))
        .catch(err => reject(err));
    });
  }

  deleteFile(id) {
    return new Promise((resolve, reject) => {
      request({
        method: 'DELETE',
        url: `${this.url}/faxes/${id}/file`,
        auth: this.auth,
      }).then(response => resolve(JSON.parse(response)))
        .catch(err => reject(err));
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
        if (options[rec] !== null) query[rec] = options[rec];
      });

      request({
        method: 'GET',
        url: `${this.url}/faxes`,
        auth: this.auth,
        qs: query,
      }).then(response => resolve(JSON.parse(response)))
        .catch(err => reject(err));
    });
  }
};
