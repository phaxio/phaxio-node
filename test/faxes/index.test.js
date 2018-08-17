/* eslint arrow-body-style: "off" */
const expect = require('expect.js');

const Faxes = require('../../src/faxes');

describe('class: Faxes', () => {
  it('should be a class', () => {
    // Classes are just special kinds of functions.
    expect(Faxes).to.be.a('function');
  });

  describe('post-instantiation', () => {
    let faxes;
    let firstFax;

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

      it('should send a single `content_url`', () => {
        return faxes.create({
          to: process.env.PHONE_NUMBER,
          content_url: 'https://google.com',
        })
          .then((response) => {
            firstFax = response.data.id;
            expect(response.success).to.be.ok();
            expect(response.message).to.be('Fax queued for sending');
            expect(response.data.id).to.be.a('number');
          })
          .catch((err) => { throw err; });
      });

      it('should send multiple `content_url`s', () => {
        return faxes.create({
          to: process.env.PHONE_NUMBER,
          content_url: ['https://google.com', 'https://wikipedia.org'],
        })
          .then((response) => {
            expect(response.success).to.be.ok();
            expect(response.message).to.be('Fax queued for sending');
            expect(response.data.id).to.be.a('number');
          })
          .catch((err) => { throw err; });
      });

      it('should send a single `file`', () => {
        return faxes.create({
          to: process.env.PHONE_NUMBER,
          file: `${__dirname}/sample1.pdf`,
        })
          .then((response) => {
            expect(response.success).to.be.ok();
            expect(response.message).to.be('Fax queued for sending');
            expect(response.data.id).to.be.a('number');
          })
          .catch((err) => { throw err; });
      });

      it('should send multiple `file`s', () => {
        return faxes.create({
          to: process.env.PHONE_NUMBER,
          file: [`${__dirname}/sample1.pdf`, `${__dirname}/sample2.pdf`],
        })
          .then((response) => {
            expect(response.success).to.be.ok();
            expect(response.message).to.be('Fax queued for sending');
            expect(response.data.id).to.be.a('number');
          })
          .catch((err) => { throw err; });
      });

      it('should send one `content_url` with multiple `file`s', () => {
        return faxes.create({
          to: process.env.PHONE_NUMBER,
          content_url: 'https://google.com',
          file: [`${__dirname}/sample1.pdf`, `${__dirname}/sample2.pdf`],
        })
          .then((response) => {
            expect(response.success).to.be.ok();
            expect(response.message).to.be('Fax queued for sending');
            expect(response.data.id).to.be.a('number');
          })
          .catch((err) => { throw err; });
      });

      it('should send multiple `content_url`s with one `file`', () => {
        return faxes.create({
          to: process.env.PHONE_NUMBER,
          content_url: ['https://google.com', 'https://wikipedia.org'],
          file: `${__dirname}/sample1.pdf`,
        })
          .then((response) => {
            expect(response.success).to.be.ok();
            expect(response.message).to.be('Fax queued for sending');
            expect(response.data.id).to.be.a('number');
          })
          .catch((err) => { throw err; });
      });

      it('should send multiple `content_url`s and `file`s together', () => {
        return faxes.create({
          to: process.env.PHONE_NUMBER,
          content_url: ['https://google.com', 'https://wikipedia.org'],
          file: [`${__dirname}/sample1.pdf`, `${__dirname}/sample2.pdf`],
        })
          .then((response) => {
            expect(response.success).to.be.ok();
            expect(response.message).to.be('Fax queued for sending');
            expect(response.data.id).to.be.a('number');
          })
          .catch((err) => { throw err; });
      });

      // eslint-disable-next-line func-names
      it('should be able to support batched sending of `content_url`s and `file`s', function () {
        this.timeout(5000);
        return faxes.create({
          to: process.env.PHONE_NUMBER,
          content_url: 'https://google.com',
          batch: true,
          batch_delay: 2,
        })
          .then((fResponse) => {
            return faxes.create({
              to: process.env.PHONE_NUMBER,
              content_url: 'https://wikipedia.org',
            })
              .then((response) => {
                expect(fResponse.success).to.be.ok();
                expect(response.success).to.be.ok();
              })
              .catch((err) => { throw err; });
          })
          .catch((err) => { throw err; });
      });
    });

    describe('method: cancel', () => {
      it('should cancel the requested fax', () => {
        return faxes.create({
          to: process.env.PHONE_NUMBER,
          content_url: 'https://google.com',
        })
          .then((created) => {
            return faxes.cancel(created.data.id)
              .then((response) => {
                expect(response.success).to.be.ok();
                expect(response.message).to.be('Fax cancellation scheduled successfully.');
                expect(response.data.id).to.be.a('number');
              })
              .catch((err) => { throw err; });
          })
          .catch((err) => { throw err; });
      });
    });

    describe('method: getInfo', () => {
      it('should get the info for a specific fax', () => {
        return faxes.getInfo(firstFax)
          .then((response) => {
            expect(response.success).to.be.ok();
            expect(response.message).to.be('Metadata for fax');
            expect(response.data.id).to.be(firstFax);
          })
          .catch((err) => { throw err; });
      });
    });

    describe('method: resend', () => {
      it('should resend a fax', () => {
        return faxes.resend({ id: firstFax })
          .then((response) => {
            expect(response.success).to.be.ok();
            expect(response.message).to.be('Fax queued for resending');
            expect(response.data.id).to.be.a('number');
            expect(response.data.id).to.not.be(firstFax);
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


    describe('method: getFile', () => {
      it('should get a small jpg thumbnail of the file', () => {
        return faxes.getFile({ id: firstFax, thumbnail: 's' })
          .then((response) => {
            expect(response).to.be.a('string');
          })
          .catch((err) => { throw err; });
      });

      it('should get a large jpg thumbnail of the file', () => {
        return faxes.getFile({ id: firstFax, thumbnail: 'l' })
          .then((response) => {
            expect(response).to.be.a('string');
          })
          .catch((err) => { throw err; });
      });

      it('should get the whole file', () => {
        return faxes.getFile({ id: firstFax })
          .then((response) => {
            expect(response).to.be.a('string');
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
    });

    describe('method: deleteFile', () => {
      it('should delete files from Phaxio for the specified fax', () => {
        return faxes.deleteFile(firstFax)
          .then((response) => {
            expect(response.success).to.be.ok();
            expect(response.message).to.be('Deleted files successfully!');
          })
          .catch((err) => { throw err; });
      });
    });

    describe('method: testDelete', () => {
      it('should delete a test fax', () => {
        return faxes.testDelete(firstFax)
          .then((response) => {
            expect(response.success).to.be.ok();
            expect(response.message).to.be('Deleted fax successfully!');
          })
          .catch((err) => { throw err; });
      });
    });
  });
});
