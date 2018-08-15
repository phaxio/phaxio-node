const expect = require('expect.js');

const Faxes = require('../../src/faxes');

describe('class: Faxes', () => {
  it('should be a class', () => {
    // Classes are just special kinds of functions.
    expect(Faxes).to.be.a('function');
  });

  describe('post-instantiation', () => {
    const faxes = new Faxes('mykey', 'mysecret', 'https://api.phaxio.com/v2.1');
    it('should export appropriate properties and functions', () => {
      expect(faxes).to.have.property('apiKey');
      expect(faxes).to.have.property('apiSecret');
      expect(faxes).to.have.property('uri');
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
      it('should send a single `content_url`');
      it('should send multiple `content_url`s');
      it('should send a single `file`');
      it('should send multiple `file`s');
      it('should send multiple `content_url`s or `file`s together');
      it('should be able to support batched sending of `content_url`s and `file`s');
    });

    describe('method: cancel', () => {
      it('should cancel the requested fax');
    });

    describe('method: resend', () => {
      it('should resend a fax');
    });

    describe('method: testReceive', () => {
      it('should send a file that is subsequently received');
    });

    describe('method: testDelete', () => {
      it('should delete a test fax');
    });

    describe('method: getInfo', () => {
      it('should get the info for a specific fax');
    });

    describe('method: getFile', () => {
      it('should get a small jpg thumbnail of the file');
      it('should get a large jpg thumbnail of the file');
      it('should get the whole file');
    });

    describe('method: deleteFile', () => {
      it('should delete files from Phaxio for the specified fax');
    });

    describe('method: listFaxes', () => {
      it('should get a list of faxes based on filters');
    });
  });
});
