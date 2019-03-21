const expect = require('expect.js');

const { config } = require('dotenv');

before(() => {
  const result = config();
  if (result.error) throw result.error;
});

const Phaxio = require('../index.js');

describe('class: Phaxio', () => {
  it('should be a class', () => {
    // Classes are just special kinds of functions.
    expect(Phaxio).to.be.a('function');
  });

  describe('post-instantiation', () => {
    let phaxio;
    before(() => {
      phaxio = new Phaxio(process.env.TEST_APIKEY, process.env.TEST_APISECRET);
    });

    it('should export appropriate properties and functions', () => {
      expect(phaxio).to.have.property('apiKey');
      expect(phaxio).to.have.property('apiSecret');
      expect(phaxio).to.have.property('url');
      expect(phaxio).to.have.property('faxes');
      expect(phaxio).to.have.property('public');
      expect(phaxio).to.have.property('account');
      expect(phaxio).to.have.property('phaxCode');
      expect(phaxio).to.have.property('phoneNumber');
      expect(phaxio).to.have.property('agentOptions');
      expect(phaxio.agentOptions).to.have.property('minVersion');
    });

    it('should have the appropriate values for properties', () => {
      expect(phaxio.apiKey).to.be(process.env.TEST_APIKEY);
      expect(phaxio.apiSecret).to.be(process.env.TEST_APISECRET);
      expect(phaxio.agentOptions.minVersion).to.be('TLSv1.2');
    });
  });
});
