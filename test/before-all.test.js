/* eslint no-console: "off" */
const { config } = require('dotenv');

before(() => {
  const result = config();
  if (result.error) throw result.error;
});
