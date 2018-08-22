const request = require('request-promise-native');
const errorHandler = require('../error-handler');

function cancel(url, id, auth) {
  return new Promise((resolve, reject) => {
    request({
      method: 'POST',
      url: `${url}/faxes/${id}/cancel`,
      auth,
    })
      .then((response) => {
        const res = JSON.parse(response);
        if (!res.success) return reject(errorHandler(res.message));
        return resolve(res);
      })
      .catch(err => reject(err));
  });
}

function resend(url, id, auth, options = { id: null, callback_url: null }) {
  return new Promise((resolve, reject) => {
    const { callback_url } = options; // eslint-disable-line camelcase

    const req = {
      method: 'POST',
      url: `${url}/faxes/${id}/resend`,
      auth,
      callback_url,
    };

    if (req.callback_url === null || req.callback_url === undefined) delete req.callback_url;

    request(req)
      .then((response) => {
        const res = JSON.parse(response);
        if (!res.success) return reject(errorHandler(res.message));
        return resolve(res);
      })
      .catch(err => reject(err));
  });
}

function testDelete(url, id, auth) {
  return new Promise((resolve, reject) => {
    request({
      method: 'DELETE',
      url: `${url}/faxes/${id}`,
      auth,
    })
      .then((response) => {
        const res = JSON.parse(response);
        if (!res.success) return reject(errorHandler(res.message));
        return resolve(res);
      })
      .catch(err => reject(err));
  });
}

function getInfo(url, id, auth) {
  return new Promise((resolve, reject) => {
    request({
      method: 'GET',
      url: `${url}/faxes/${id}`,
      auth,
    })
      .then((response) => {
        const res = JSON.parse(response);
        if (!res.success) return reject(errorHandler(res.message));
        return resolve(res);
      })
      .catch(err => reject(err));
  });
}

function getFile(url, id, auth, options = { id: null, thumbnail: null }) {
  return new Promise((resolve, reject) => { // eslint-disable-line consistent-return
    const thumbnail = options.thumbnail === undefined ? null : options.thumbnail;

    if (!['s', 'l', null].includes(thumbnail)) {
      return reject(new Error('ThumbnailSizeInvalid: Must be \'s\', \'l\', or null (default) for full file.'));
    }

    const req = {
      method: 'GET',
      url: `${url}/faxes/${id}/file`,
      auth,
    };

    if (thumbnail !== null) req.qs.thumbnail = thumbnail;

    request(req)
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
}

function deleteFile(url, id, auth) {
  return new Promise((resolve, reject) => {
    request({
      method: 'DELETE',
      url: `${url}/faxes/${id}/file`,
      auth,
    })
      .then((response) => {
        const res = JSON.parse(response);
        if (!res.success) return reject(errorHandler(res.message));
        return resolve(res);
      })
      .catch(err => reject(err));
  });
}

module.exports = {
  cancel,
  resend,
  testDelete,
  getInfo,
  getFile,
  deleteFile,
};
