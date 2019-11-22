/* eslint arrow-body-style: "off" */
const expect = require('expect.js');
const request = require('request-promise-native');

const {
  cancel,
  resend,
  testDelete,
  getInfo,
  getFile,
  deleteFile,
} = require('../../src/faxes/shared-methods');

describe('shared methods', function () { // eslint-disable-line func-names
  this.timeout(6000);
  let url;
  let auth = {};
  let firstFax;

  before(() => {
    url = 'https://api.phaxio.com/v2.1';
    auth = { user: process.env.TEST_APIKEY, pass: process.env.TEST_APISECRET };
  });

  describe('function: getInfo', () => {
    it('should get a fax\'s info', () => {
      const req = request({
        method: 'POST',
        url: `${url}/faxes`,
        auth,
      });

      const form = req.form();
      form.append('content_url', 'https://google.com');
      form.append('to', process.env.PHONE_NUMBER);

      return req
        .then((ores) => { // eslint-disable-line arrow-body-style
          const res = JSON.parse(ores);
          firstFax = res.data.id;
          return getInfo(url, res.data.id, auth);
        })
        .then((gi) => {
          expect(gi.success).to.be.ok();
        })
        .catch((err) => { throw err; });
    });
  });

  describe('function: cancel', () => {
    it('should cancel a fax', () => {
      const req = request({
        method: 'POST',
        url: `${url}/faxes`,
        auth,
      });

      const form = req.form();
      form.append('content_url', 'https://google.com');
      form.append('to', process.env.PHONE_NUMBER);

      return req
        .then((ores) => { // eslint-disable-line arrow-body-style
          const res = JSON.parse(ores);
          return cancel(url, res.data.id, auth);
        })
        .then((canc) => {
          expect(canc.success).to.be.ok();
        })
        .catch((err) => { throw err; });
    });
  });

  describe('functions requiring a delay', () => {
    before((done) => {
      setTimeout(done, 4000);
    });

    describe('function: resend', () => {
      it('should resend a fax', () => {
        return resend(url, firstFax, auth, { id: firstFax })
          .then((resd) => {
            expect(resd.success).to.be.ok();
          })
          .catch((err) => { throw err; });
      });
    });

    describe('function: getFile', () => {
      it('should get a fax\'s thumbnail', () => {
        return getFile(url, firstFax, auth, { id: firstFax, thumbnail: 'l' })
          .then((gf) => {
            expect(Buffer.isBuffer(gf)).to.be.ok();
          })
          .catch((err) => { throw err; });
      });

      it('should get a fax\'s file', () => {
        return getFile(url, firstFax, auth, { id: firstFax })
          .then((gf) => {
            expect(Buffer.isBuffer(gf)).to.be.ok();
          })
          .catch((err) => { throw err; });
      });
    });

    describe('function: deleteFile', () => {
      it('should delete a fax\'s file', () => {
        return deleteFile(url, firstFax, auth)
          .then((gf) => {
            expect(gf.success).to.be.ok();
          })
          .catch((err) => { throw err; });
      });
    });

    describe('function: testDelete', () => {
      it('should delete a test fax', () => {
        return testDelete(url, firstFax, auth)
          .then((gf) => {
            expect(gf.success).to.be.ok();
          })
          .catch((err) => { throw err; });
      });
    });
  });
});
