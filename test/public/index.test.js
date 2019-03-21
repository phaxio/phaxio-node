/* eslint arrow-body-style: "off" */
const expect = require('expect.js');

const Public = require('../../src/public');

describe('class: Public', () => {
  it('should be a class', () => {
    // Classes are just special kinds of functions.
    expect(Public).to.be.a('function');
  });

  describe('post-instantiation', () => {
    // `public` by itself is a reserved word in JavaScript.
    let pub;
    before(() => {
      pub = new Public('https://api.phaxio.com/v2.1');
    });

    it('should export appropriate properties and functions', () => {
      expect(pub).to.have.property('url');
      expect(pub).to.have.property('getAreaCodes');
      expect(pub).to.have.property('getCountries');
      expect(pub).to.have.property('agentOptions');
    });

    describe('method: getAreaCodes', () => {
      it('should get a list of area codes when called without filters', () => {
        return pub.getAreaCodes()
          .then((response) => {
            expect(response.success).to.be.ok();
            expect(response.message).to.be('Data contains found available area codes');
            expect(response.data).to.be.an(Array);
          })
          .catch((err) => { throw err; });
      });

      it('should get a list of specific area codes when called with filters', () => {
        return pub.getAreaCodes({ country: 'US', state: 'RI' })
          .then((response) => {
            expect(response.success).to.be.ok();
            expect(response.message).to.be('Data contains found available area codes');
            expect(response.data).to.be.an(Array);
            expect(response.data).to.eql([{
              country_code: 1,
              area_code: 401,
              city: 'Cranston, Pawtucket, Providence',
              state: 'Rhode Island',
              country: 'United States of America',
              toll_free: false,
            }]);
          })
          .catch((err) => { throw err; });
      });
    });

    describe('method: getCountries', () => {
      it('should get a list of countries', () => {
        return pub.getCountries({ per_page: 1 })
          .then((response) => {
            expect(response.success).to.be.ok();
            expect(response.message).to.be('Data contains countries info');
            expect(response.data).to.be.an(Array);
            expect(response.data).to.eql([{
              name: 'United States of America',
              alpha2: 'US',
              country_code: 1,
              price_per_page: 7,
              send_support: 'full',
              receive_support: 'full',
            }]);
          })
          .catch((err) => { throw err; });
      });
    });
  });
});
