/* eslint no-console: "off" */
const { config } = require('dotenv');

const result = config();

if (result.error) throw result.error;

console.log('Parsed ENV Config:', result.parsed);
