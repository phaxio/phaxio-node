/* eslint arrow-body-style: "off" */
const expect = require('expect.js');

const PhaxCode = require('../../src/phax-code');

describe('class: PhaxCode', () => {
  it('should be a class', () => {
    // Classes are just special kinds of functions.
    expect(PhaxCode).to.be.a('function');
  });

  describe('post-instantiation', () => {
    let phaxcode;
    let id;

    beforeEach((done) => {
      setTimeout(done, 1000);
    });

    before(() => {
      phaxcode = new PhaxCode(process.env.TEST_APIKEY, process.env.TEST_APISECRET, 'https://api.phaxio.com/v2.1');
    });

    it('should export appropriate properties and functions', () => {
      expect(phaxcode).to.have.property('apiKey');
      expect(phaxcode).to.have.property('apiSecret');
      expect(phaxcode).to.have.property('url');
      expect(phaxcode).to.have.property('create');
      expect(phaxcode).to.have.property('get');
      expect(phaxcode).to.have.property('agentOptions');
    });

    describe('method: create', () => {
      it('should create a new JSON PhaxCode and return appropriate JSON', () => {
        return phaxcode.create({ metadata: '1234' })
          .then((response) => {
            id = response.data.identifier;
            expect(response.success).to.be.ok();
            expect(response.message).to.be('PhaxCode generated');
            expect(response.data.identifier).to.be.a('string');
          })
          .catch((err) => { throw err; });
      });

      it('should create a new PNG PhaxCode and return a PNG', () => {
        return phaxcode.create({ metadata: '1234', type: '.png' })
          .then((response) => {
            id = response.data.identifier;
            expect(response.success).to.be.ok();
            expect(response.message).to.be('PhaxCode generated');
            expect(response.data.identifier).to.be.a('string');
          })
          .catch((err) => { throw err; });
      });
    });

    describe('method: get', () => {
      beforeEach((done) => {
        setTimeout(done, 1500);
      });

      it('should get the default PhaxCode if called without an ID', () => {
        return phaxcode.get()
          .then((response) => {
            expect(response.success).to.be.ok();
            expect(response.message).to.be('Info for PhaxCode');
            expect(response.data.identifier).to.be.a('string');
            expect(response.data.created_at).to.be.a('string');
          })
          .catch((err) => { throw err; });
      });

      it('should get an existing JSON PhaxCode', () => {
        return phaxcode.get({ id })
          .then((response) => {
            expect(response.success).to.be.ok();
            expect(response.message).to.be('Info for PhaxCode');
            expect(response.data.identifier).to.be(id);
            expect(response.data.metadata).to.be('1234');
            expect(response.data.metadata).to.be.a('string');
            expect(response.data.created_at).to.be.a('string');
          })
          .catch((err) => { throw err; });
      });

      it('should get an existing PNG PhaxCode', () => {
        return phaxcode.get({ id, type: '.png' })
          .then((response) => {
            expect(response.success).to.be.ok();
            expect(response.message).to.be('Info for PhaxCode');
            expect(response.data.identifier).to.be(id);
            expect(response.data.metadata).to.be('1234');
            expect(response.data.metadata).to.be.a('string');
            expect(response.data.created_at).to.be.a('string');
          })
          .catch((err) => { throw err; });
      });
    });
  });
});
