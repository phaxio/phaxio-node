const expect = require('expect.js');

const Phaxio = require('../index.js');

describe('class: Phaxio', () => {
  it('should be a class', () => {
    // Classes are just special kinds of functions.
    expect(Phaxio).to.be.a('function');
  });

  describe('post-instantiation', () => {
    const phaxio = new Phaxio('mykey', 'mysecret');
    it('should export appropriate properties and functions', () => {
      expect(phaxio).to.have.property('apiKey');
      expect(phaxio).to.have.property('apiSecret');
      expect(phaxio).to.have.property('fileDownloadPath');
      expect(phaxio).to.have.property('account');
    });

    it('should have the appropriate values for properties', () => {
      expect(phaxio.apiKey).to.be('mykey');
      expect(phaxio.apiSecret).to.be('mysecret');
      expect(phaxio.fileDownloadPath).to.be('./');
    });
  });
});
