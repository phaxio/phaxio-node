/* eslint arrow-body-style: "off" , max-len: "off" */
const expect = require('expect.js');

const Faxes = require('../../src/faxes');

describe('class: Faxes', () => {
  it('should be a class', () => {
    // Classes are just special kinds of functions.
    expect(Faxes).to.be.a('function');
  });

  describe('post-instantiation', () => {
    let faxes;

    before(() => {
      faxes = new Faxes(process.env.TEST_APIKEY, process.env.TEST_APISECRET, 'https://api.phaxio.com/v2.1');
    });

    it('should export appropriate properties and functions', () => {
      expect(faxes).to.have.property('apiKey');
      expect(faxes).to.have.property('apiSecret');
      expect(faxes).to.have.property('url');
      expect(faxes).to.have.property('auth');
      expect(faxes).to.have.property('create');
      expect(faxes).to.have.property('cancel');
      expect(faxes).to.have.property('resend');
      expect(faxes).to.have.property('testReceive');
      expect(faxes).to.have.property('testDelete');
      expect(faxes).to.have.property('getInfo');
      expect(faxes).to.have.property('getFile');
      expect(faxes).to.have.property('deleteFile');
      expect(faxes).to.have.property('listFaxes');
      expect(faxes).to.have.property('agentOptions');
    });

    describe('method: create', () => {
      // to: null,
      // file: null,
      // content_url: null,
      // header_text: null,
      // batch_delay: null,
      // batch_collision_avoidance: null,
      // callback_url: null,
      // cancel_timeout: null,
      // tags: null,
      // caller_id: null,
      // test_fail: null,

      it('should send a single `content_url` and return a Fax object', () => {
        return faxes.create({
          to: process.env.PHONE_NUMBER,
          content_url: 'https://google.com',
        })
          .then((fax) => {
            expect(fax).to.have.property('apiKey');
            expect(fax).to.have.property('apiSecret');
            expect(fax).to.have.property('url');
            expect(fax).to.have.property('auth');
            expect(fax).to.have.property('id');
            expect(fax).to.have.property('success');
            expect(fax).to.have.property('message');
            expect(fax).to.have.property('cancel');
            expect(fax).to.have.property('resend');
            expect(fax).to.have.property('getInfo');
            expect(fax).to.have.property('getFile');
            expect(fax).to.have.property('deleteFile');
            expect(fax).to.have.property('testDelete');

            expect(fax.success).to.be.ok();
            expect(fax.id).to.be.a('number');
            expect(fax.message).to.be('Fax queued for sending');
          })
          .catch((err) => { throw err; });
      });

      it('should send multiple `content_url`s', () => {
        return faxes.create({
          to: process.env.PHONE_NUMBER,
          content_url: ['https://google.com', 'https://wikipedia.org'],
        })
          .then((fax) => {
            expect(fax.success).to.be.ok();
            expect(fax.message).to.be('Fax queued for sending');
            expect(fax.id).to.be.a('number');
          })
          .catch((err) => { throw err; });
      });

      it('should send a single `file`', () => {
        return faxes.create({
          to: process.env.PHONE_NUMBER,
          file: `${__dirname}/sample1.pdf`,
        })
          .then((fax) => {
            expect(fax.success).to.be.ok();
            expect(fax.message).to.be('Fax queued for sending');
            expect(fax.id).to.be.a('number');
          })
          .catch((err) => { throw err; });
      });

      it('should send multiple `file`s', () => {
        return faxes.create({
          to: process.env.PHONE_NUMBER,
          file: [`${__dirname}/sample1.pdf`, `${__dirname}/sample2.pdf`],
        })
          .then((fax) => {
            expect(fax.success).to.be.ok();
            expect(fax.message).to.be('Fax queued for sending');
            expect(fax.id).to.be.a('number');
          })
          .catch((err) => { throw err; });
      });

      it('should send one `content_url` with multiple `file`s', () => {
        return faxes.create({
          to: process.env.PHONE_NUMBER,
          content_url: 'https://google.com',
          file: [`${__dirname}/sample1.pdf`, `${__dirname}/sample2.pdf`],
        })
          .then((fax) => {
            expect(fax.success).to.be.ok();
            expect(fax.message).to.be('Fax queued for sending');
            expect(fax.id).to.be.a('number');
          })
          .catch((err) => { throw err; });
      });

      it('should send multiple `content_url`s with one `file`', () => {
        return faxes.create({
          to: process.env.PHONE_NUMBER,
          content_url: ['https://google.com', 'https://wikipedia.org'],
          file: `${__dirname}/sample1.pdf`,
        })
          .then((fax) => {
            expect(fax.success).to.be.ok();
            expect(fax.message).to.be('Fax queued for sending');
            expect(fax.id).to.be.a('number');
          })
          .catch((err) => { throw err; });
      });

      it('should send multiple `content_url`s and `file`s together', () => {
        return faxes.create({
          to: process.env.PHONE_NUMBER,
          content_url: ['https://google.com', 'https://wikipedia.org'],
          file: [`${__dirname}/sample1.pdf`, `${__dirname}/sample2.pdf`],
        })
          .then((fax) => {
            expect(fax.success).to.be.ok();
            expect(fax.message).to.be('Fax queued for sending');
            expect(fax.id).to.be.a('number');
          })
          .catch((err) => { throw err; });
      });

      // eslint-disable-next-line func-names
      it('should be able to support batched sending of `content_url`s and `file`s', function () {
        this.timeout(5000);
        return faxes.create({
          to: process.env.PHONE_NUMBER,
          content_url: 'https://google.com',
          batch_delay: 2,
        })
          .then((leadFax) => {
            return faxes.create({
              to: process.env.PHONE_NUMBER,
              content_url: 'https://wikipedia.org',
            })
              .then((fax) => {
                expect(leadFax.success).to.be.ok();
                expect(fax.success).to.be.ok();
              })
              .catch((err) => { throw err; });
          })
          .catch((err) => { throw err; });
      });
    });

    describe('method: testReceive', () => {
      it('should send a file that is subsequently received', () => {
        return faxes.testReceive({ file: `${__dirname}/sample1.pdf` })
          .then((response) => {
            expect(response.success).to.be.ok();
            // eslint-disable-next-line no-regex-spaces
            expect(response.message).to.match(/^Test fax received from \+[0-9]{11} to \+[0-9]{11}\.  Calling back now\.\.\.$/);
          })
          .catch((err) => { throw err; });
      });
    });

    describe('method: listFaxes', () => {
      it('should get a list of faxes based on filters', () => {
        return faxes.listFaxes()
          .then((response) => {
            expect(response.success).to.be.ok();
            expect(response.message).to.be('Retrieved faxes successfully');
            expect(response.data).to.be.an(Array);
          })
          .catch((err) => { throw err; });
      });

      it('should get a list of faxes based on tags', () => {
        const tags = { myTagName: 'myTagValue' };
        return faxes.listFaxes({ tags })
          .then((response) => {
            response.data.forEach((fax) => {
              expect(fax.tags).to.eql(tags);
            });
          })
          .catch((err) => { throw err; });
      });
    });

    describe('using Fax object', function () { // eslint-disable-line func-names
      this.timeout(6000);
      let faxObject;
      const tags = { myTagName: 'myTagValue' };
      before((done) => {
        faxes.create({
          to: process.env.PHONE_NUMBER,
          content_url: 'https://google.com',
          tags,
        })
          .then((fo) => {
            faxObject = fo;
          })
          .catch((err) => { throw err; });
        setTimeout(done, 4000);
      });

      it('should cancel', () => {
        return faxes.create({
          to: process.env.PHONE_NUMBER,
          content_url: 'https://google.com',
        })
          .then(async (fax) => {
            const canc = await fax.cancel();
            expect(canc.success).to.be.ok();
          })
          .catch((err) => { throw err; });
      });

      it('should resend', () => {
        return faxObject.resend()
          .then((res) => {
            expect(res.success).to.be.ok();
          })
          .catch((err) => { throw err; });
      });

      it('should fetch new metadata and include tags', () => {
        return faxObject.getInfo()
          .then((md) => {
            expect(md.success).to.be.ok();
            expect(md.data.tags).to.eql(tags);
          })
          .catch((err) => { throw err; });
      });

      it('should fetch the fax\'s file', () => {
        return faxObject.getFile()
          .then((file) => {
            expect(Buffer.isBuffer(file)).to.be.ok();
          })
          .catch((err) => { throw err; });
      });

      it('should delete the fax\'s file', () => {
        return faxObject.deleteFile()
          .then((dfile) => {
            expect(dfile.success).to.be.ok();
          })
          .catch((err) => { throw err; });
      });

      it('should delete a test fax', () => {
        return faxObject.testDelete()
          .then((dfax) => {
            expect(dfax.success).to.be.ok();
          })
          .catch((err) => { throw err; });
      });
    });
  });
});
