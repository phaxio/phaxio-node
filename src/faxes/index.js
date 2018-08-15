/* eslint camelcase: "off" */

const request = require('request-promise-native');

module.exports = class {
  constructor(apiKey, apiSecret, uri) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.uri = uri;

    this.auth = { user: this.apiKey, pass: this.apiSecret };
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
    return new Promise((resolve, reject) => {
      request({
        method: 'POST',
        uri: `${this.uri}/faxes`,
        auth: this.auth,
        formData: options,
      }).then(response => resolve(response))
        .catch(err => reject(err));
    });
  }

  cancel(id) {
    return new Promise((resolve, reject) => {
      request({
        method: 'POST',
        uri: `${this.uri}/faxes/${id}/cancel`,
        auth: this.auth,
      }).then(response => resolve(response))
        .catch(err => reject(err));
    });
  }

  resend(options = { id: null, callback_url: null }) {
    const { id, callback_url } = options;
    return new Promise((resolve, reject) => {
      request({
        method: 'POST',
        uri: `${this.uri}/faxes/${id}/resend`,
        auth: this.auth,
        formData: { callback_url },
      }).then(response => resolve(response))
        .catch(err => reject(err));
    });
  }

  testReceive(options = {
    direction: null,
    file: null,
    from_number: null,
    to_number: null,
  }) {
    return new Promise((resolve, reject) => {
      request({
        method: 'POST',
        uri: `${this.uri}/faxes`,
        auth: this.auth,
        formData: options,
      }).then(response => resolve(response))
        .catch(err => reject(err));
    });
  }

  testDelete(id) {
    return new Promise((resolve, reject) => {
      request({
        method: 'DELETE',
        uri: `${this.uri}/faxes/${id}`,
        auth: this.auth,
      }).then(response => resolve(response))
        .catch(err => reject(err));
    });
  }

  getInfo(id) {
    return new Promise((resolve, reject) => {
      request({
        method: 'GET',
        uri: `${this.uri}/faxes/${id}`,
        auth: this.auth,
      }).then(response => resolve(response))
        .catch(err => reject(err));
    });
  }

  getFile(options = { id: null, thumbnail: null }) {
    const { id, thumbnail } = options;
    return new Promise((resolve, reject) => {
      request({
        method: 'GET',
        uri: `${this.uri}/faxes/${id}/file`,
        auth: this.auth,
        qs: { thumbnail },
      }).then(response => resolve(response))
        .catch(err => reject(err));
    });
  }

  deleteFile(id) {
    return new Promise((resolve, reject) => {
      request({
        method: 'DELETE',
        uri: `${this.uri}/faxes/${id}/file`,
        auth: this.auth,
      }).then(response => resolve(response))
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
      request({
        method: 'GET',
        uri: `${this.uri}/faxes`,
        auth: this.auth,
        qs: options,
      }).then(response => resolve(response))
        .catch(err => reject(err));
    });
  }
};
