const request = require('axios');
const errorHandler = require('../error-handler');

function cancel(url, id, auth, agentOptions) {
  return request
    .post(`${url}/faxes/${id}/cancel`, {
      auth: auth
    })
    .then((response) => {
      const res = JSON.parse(response);
      if (!res.success) return reject(errorHandler(res.message));
      return resolve(res);
    })
    .catch((err) => reject(err));
}

function resend(url, id, auth, options = { id: null, callback_url: null }, agentOptions) {
  const { callback_url } = options; // eslint-disable-line camelcase

  request
    .post(`${url}/faxes/${id}/resend`, {
      auth: auth,
      callback_url: callback_url
    })
    .then((response) => {
      const res = JSON.parse(response);
      if (!res.success) return reject(errorHandler(res.message));
      return resolve(res);
    })
    .catch((err) => reject(err));
}

function testDelete(url, id, auth, agentOptions) {
  return request
    .delete(`${url}/faxes/${id}`, {
      auth: auth
    })
    .then((response) => {
      const res = JSON.parse(response);
      if (!res.success) return reject(errorHandler(res.message));
      return resolve(res);
    })
    .catch((err) => reject(err));
}

function getInfo(url, id, auth, agentOptions) {
  return request
    .get(`${url}/faxes/${id}`, {
      auth: auth
    })
    .then((response) => {
      const res = JSON.parse(response);
      if (!res.success) return reject(errorHandler(res.message));
      return resolve(res);
    })
    .catch((err) => reject(err));
}

function getFile(url, id, auth, options = { id: null, thumbnail: null }, agentOptions) {
  const thumbnail = options.thumbnail === undefined ? null : options.thumbnail;

  if (!['s', 'l', null].includes(thumbnail)) {
    return reject(new Error('ThumbnailSizeInvalid: Must be \'s\', \'l\', or null (default) for full file.'));
  }

  return request
    .get(`${url}/faxes/${id}/file`, {
      auth: auth,
      encoding: null,
      thumbnail: thumbnail
    })
    .then((response) => resolve(response))
    .catch((err) => reject(err));
}

function deleteFile(url, id, auth, agentOptions) {
  return request
    .delete(`${url}/faxes/${id}/file`, {
      auth: auth
    })
    .then((response) => {
      const res = JSON.parse(response);
      if (!res.success) return reject(errorHandler(res.message));
      return resolve(res);
    })
    .catch((err) => reject(err));
}

module.exports = {
  cancel,
  resend,
  testDelete,
  getInfo,
  getFile,
  deleteFile,
};
