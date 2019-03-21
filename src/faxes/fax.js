const {
  cancel,
  resend,
  testDelete,
  getInfo,
  getFile,
  deleteFile,
} = require('./shared-methods');

module.exports = class {
  constructor(apiKey, apiSecret, url, success, message, data, agentOptions) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.url = url;
    this.success = success;
    this.message = message;
    this.id = data.id;
    this.agentOptions = agentOptions;

    this.auth = { user: this.apiKey, pass: this.apiSecret };
  }

  async cancel() {
    const canc = await cancel(this.url, this.id, this.auth, this.agentOptions);
    return canc;
  }

  async resend(callback_url = null) {
    // eslint-disable-next-line max-len
    const res = await resend(this.url, this.id, this.auth, { id: this.id, callback_url }, this.agentOptions);
    return res;
  }

  async getInfo() {
    const metadata = await getInfo(this.url, this.id, this.auth, this.agentOptions);
    return metadata;
  }

  async getFile(thumbnail = null) {
    // eslint-disable-next-line max-len
    const gf = await getFile(this.url, this.id, this.auth, { id: this.id, thumbnail }, this.agentOptions);
    return gf;
  }

  async deleteFile() {
    const df = await deleteFile(this.url, this.id, this.auth, this.agentOptions);
    return df;
  }

  async testDelete() {
    const td = await testDelete(this.url, this.id, this.auth, this.agentOptions);
    return td;
  }
};
