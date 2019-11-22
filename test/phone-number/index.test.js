/* eslint arrow-body-style: "off", func-names: "off" */
const expect = require('expect.js');

const PhoneNumber = require('../../src/phone-number');

// Running the PhoneNumber tests will use up funds. We skip it by default.
// Change the below variable to `true` to run the tests and accept the loss of funds.
const runPhoneNumbers = false;

// For some of the tests, when run in the during peak hours, they will exceed the 2s timeout.
// Bumping timeout up manually to 3s.
describe('class: PhoneNumber', function () {
  this.timeout(3000);

  it('should be a class', () => {
    // Classes are just special kinds of functions.
    expect(PhoneNumber).to.be.a('function');
  });

  if (runPhoneNumbers) {
    describe('post-instantiation', () => {
      let phoneNumber;
      let sampleNumber;

      before(() => {
        phoneNumber = new PhoneNumber(process.env.TEST_APIKEY, process.env.TEST_APISECRET, 'https://api.phaxio.com/v2.1');
      });

      it('should export appropriate properties and functions', () => {
        expect(phoneNumber).to.have.property('apiKey');
        expect(phoneNumber).to.have.property('apiSecret');
        expect(phoneNumber).to.have.property('url');
        expect(phoneNumber).to.have.property('releaseNumber');
        expect(phoneNumber).to.have.property('listNumbers');
        expect(phoneNumber).to.have.property('getNumberInfo');
        expect(phoneNumber).to.have.property('provisionNumber');
        expect(phoneNumber).to.have.property('agentOptions');
      });

      describe('method: provisionNumber', () => {
        it('should successfully provision a number with the requeted parameters', () => {
          // { country_code: null, area_code: null, callback_url: null }
          return phoneNumber.provisionNumber({ country_code: 1, area_code: 847 })
            .then((response) => {
              sampleNumber = response.data.phone_number;
              expect(response.success).to.be.ok();
              expect(response.message).to.be('Number provisioned successfully!');
              expect(response.data.phone_number).to.match(/\+1847[0-9]{7}/);
              expect(response.data.country).to.be('United States of America');
            })
            .catch((err) => { throw err; });
        });
      });

      describe('method: listNumbers', () => {
        it('should get a list of numbers you have registered based on the set filters', () => {
          return phoneNumber.listNumbers()
            .then((response) => {
              expect(response.success).to.be.ok();
              expect(response.message).to.be('Retrieved user phone numbers successfully');
              expect(response.data).to.be.an(Array);
              expect(response.data.filter((rec) => rec.phone_number === sampleNumber)).to.be.ok();
            })
            .catch((err) => { throw err; });
        });
      });

      describe('method: getNumberInfo', () => {
        it('should get information about the number requested', () => {
          return phoneNumber.getNumberInfo(sampleNumber)
            .then((response) => {
              expect(response.success).to.be.ok();
              expect(response.message).to.be('Retrieved user phone numbers successfully');
              expect(response.data).to.be.an(Object);
              expect(response.data.phone_number).to.be(sampleNumber);
            })
            .catch((err) => { throw err; });
        });
      });

      describe('method: releaseNumber', () => {
        it('should get a message indicating that it successfully released the number', () => {
          return phoneNumber.releaseNumber(sampleNumber)
            .then((response) => {
              expect(response.success).to.be.ok();
              expect(response.message).to.be('Number released successfully!');
            })
            .catch((err) => { throw err; });
        });
      });
    });
  }
});
