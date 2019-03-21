# phaxio-official
It is suggested that you ONLY use this library with Node.js 8 or higher.

## Installation

```bash
# Stable Version:
npm install --save phaxio-official

# Development Version:
npm install --save https://github.com/phaxio/phaxio-node
```

## Example Usage
Every method in `phaxio` returns a
[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
You should also be able to use
[async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
syntax with these methods.

See the [test](https://github.com/phaxio/phaxio-node/blob/master/test/faxes/index.test.js)
directory for more examples.

```javascript
// Assuming you have a .env file in your project that contains your
// API credentials and you have installed the `dotenv` package from
// NPM so that you can attach those variables to the Node environment.

const { config } = require('dotenv');
config();
if (process.env.PHAXIOKEY === undefined || process.env.PHAXIOSECRET === undefined) {
  console.log('No `PHAXIOKEY` or `PHAXIOSECRET` found in file `.env`. Exiting.');
  process.exit();
}

const Phaxio = require('phaxio-official');
const phaxio = new Phaxio(process.env.PHAXIOKEY, process.env.PHAXIOSECRET);

// Send a single fax containing two documents: one a URL, one from the filesystem.
phaxio.faxes.create({
  to: '+1234567890', // Replace this with a number that can receive faxes.
  content_url: 'https://google.com',
  file: `${__dirname}/sample1.pdf`,
})
  .then((fax) => {
    // The `create` method returns a fax object with methods attached to it for doing things
    // like cancelling, resending, getting info, etc.

    // Wait 5 seconds to let the fax send, then get the status of the fax by getting its info from the API.
    return setTimeout(() => {
      fax.getInfo()
    }, 5000)
  })
  .then(status => console.log('Fax status response:\n', JSON.stringify(status, null, 2)))
  .catch((err) => { throw err; });

// Get a list of all the faxes you have sent in the past and re-send the most recent one.
phaxio.faxes.listFaxes({ direction: 'sent' })
  .then((faxes) => {
    const mostRecent = faxes.data.reduce((acc, cv) => {
      const accCreated = new Date(acc.created_at);
      const cvCreated = new Date(cv.created_at);
      const output = accCreated > cvCreated ? acc : cv;
      return output;
    }, { created_at: '1970-01-01T00:00:00.000Z' });

    return phaxio.faxes.resend({ id: mostRecent.id });
  })
  .then(response => console.log('Response from resending most recent fax:\n', JSON.stringify(response, null, 2));
  .catch((err) => { throw err; });
```

## Documentation
Phaxio methods are categorized according to the Phaxio API route that they target.
See the [Phaxio Docs]('https://www.phaxio.com/docs/api/v2.1/') for more information about the raw API.

### Initialization
Initializing the `Phaxio` class takes two required arguments, the Key and Secret you retreived from Phaxio, and
allows for one optional argument, the minimum TLS version to use. By default, the minimum TLS version is set to
`TLSv1.2`. See the [TLS documentation](https://nodejs.org/api/tls.html#tls_tls_createsecurecontext_options)  for
other possible options to `minVersion` if you require something other than `TLSv1.2`. **Modifying the minimum TLS
version is not recommended.**

Arguments:

| Key | Value Type | Required? | Description |
| --- | ---------- | --------- | ----------- |
| `phaxio api key` | String | True | Your Phaxio API Key |
| `phaxio api secret` | String | True | Your Phaxio API Secret |
| `minimum TLS Version` | String | False | Default: `TLSv1.2`, other possible options are the same as `minVersion` in the [TLS documentation](https://nodejs.org/api/tls.html#tls_tls_createsecurecontext_options). |

```javascript
const Phaxio = require('phaxio-official');

const phaxio = new Phaxio(<phaxio api key>, <phaxio api secret>, [optional: <minimum TLS version>]);
```

**All Phaxio methods take one argument:** either a single argument such as an ID, or an Object containing
`key: value` parameters.
See the documentation below for specifics.

### Public

#### `phaxio.public.getAreaCodes()`
Displays a list of area codes available for purchasing Phaxio numbers.
This operation requires no authentication and can be used without passing an API key.

See [docs](https://www.phaxio.com/docs/api/v2.1/public/list_area_codes) for more information.

Arguments (Object):

| Key | Value Type | Required? | Description |
| --- | ---------- | --------- | ----------- |
| `toll_free` | Boolean | False | If set to `true`, only toll free area codes will be returned. If specified and set to `false`, only non-toll free area codes will be returned. |
| `country_code` | Integer | False | A country code (E.164) you'd like to filter by. |
| `country` | String | False | A two character country abbreviation (ISO 3166; e.g. `US` or `CA`) you'd like to filter by. |
| `state` | String | False | A two character state or province abbreviation (ISO 3166; e.g. `IL` or `YT`) you'd like to filter by. When using this parameter, `country_code` or `country` must also be provided. |
| `per_page` | Integer | False | Maximum number of results returned per call or "page". |
| `page` | Integer | False | The current page number. 1-based. |

```javascript
phaxio.public.getAreaCodes()
  .then(response => console.log(JSON.stringify(response, null, 2)))
  .catch((err) => { throw err; });
```

### `phaxio.public.getCountries()`
Returns a list of supported countries for sending and receiving faxes on Phaxio.
This operation requires no authentication and can be used without passing an API key.

See [docs](https://www.phaxio.com/docs/api/v2.1/public/list_countries) for more information.

Arguments (Object):

| Key | Value Type | Required? | Description |
| --- | ---------- | --------- | ----------- |
| `per_page` | Integer | False | Maximum number of results returned per call or "page". |
| `page` | Integer | False | The current page number. 1-based. |

```javascript
phaxio.public.getCountries()
  .then(response => console.log(JSON.stringify(response, null, 2)))
  .catch((err) => { throw err; });
```

### Faxes

#### `phaxio.faxes.create()`
Create and send a fax.

Returns a Fax Object with methods attached. More detail on Fax Objects after the example.

See [docs](https://www.phaxio.com/docs/api/v2.1/faxes/create_and_send_fax) for more information.

Arguments (Object):

| Key | Value Type | Required? | Description |
| --- | ---------- | --------- | ----------- |
| `to` | String or Array | True | A phone number in E.164 format (+[country code][number]). Pass an `Array` to send to multiple numbers. |
| `file` | String or Array | Only when sending files from filesystem | The file you wish to fax. A least one file or content_url parameter is required. Pass an `Array` to send to multiple files. |
| `content_url` | String or Array | Only when sending public URL's |  URL to be rendered and sent as the fax content. At least one file or content_url parameter is required. Pass an `Array` to send to multiple URL's. |
| `header_text` | String | False | Text that will be displayed at the top of each page of the fax. 50 characters maximum. Default header text is "-". Note that the header is not applied until the fax is transmitted, so it will not appear on fax PDFs or thumbnails. |
| `batch_delay` | Integer | False | Specifies the amount of time **in seconds** before the batch is fired. Maximum is 3600 (1 hour). |
| `batch_collision_avoidance` | Boolean | False |  When batch_delay is set to 'true', fax will be blocked until the receiving machine is no longer busy. See [docs](https://www.phaxio.com/docs/api/v2.1/faxes/batching) for more info. Default is 'false'. |
| `callback_url` | String | False | You can specify a callback url that will override the one you have defined globally for your account. |
| `cancel_timeout` | Integer | False | A number of minutes after which the fax will be canceled if it hasn't yet completed. **Must be between 3 and 60.** Additionally, for faxes with a `batch_delay`, the `cancel_timeout` must be at least 3 minutes after the `batch_delay`. If it is not, it will automatically be extended when batching. |
| `tags` | Object | False | An object containing `key: value` metadata tags relevant to your application. You may specify up to 10 tags. `{ my_tag1: tag_val1, my_tag2: tag_val2, ..., my_tag10: tag_val10 }` |
| `caller_id` | String | False | A Phaxio phone number you would like to use for the caller id. |
| `test_fail` | String | False | When using a test API key, this will simulate a sending failure at Phaxio. The contents of this parameter should be one of the Phaxio error types which will dictate how the fax will "fail". |

```javascript
phaxio.faxes.create({ to: '+1234567890', content_url: 'https://google.com', file: 'sample.pdf' })
  .then(faxObject => console.log(JSON.stringify(faxObject, null, 2)))
  .catch((err) => { throw err; });
```

##### Fax Objects
Fax Objects are returned by `phaxio.faxes.create()`.
They contain some metadata attributes as well as methods for doing extra things with a particular fax.
The methods attached to a Fax Object take one or no arguments as they already have the required metadata to fire off against the raw API.

| Method | Arguments | Description |
| ------ | --------- | ----------- |
| `faxObject.cancel()` | None | Cancels the fax. |
| `faxObject.resend()` | `callback_url` (optional) | Resends the fax. Default `callback_url` uses the fax's original `callback_url`. Passing a URL string will set the `callback_url` to the new value. |
| `faxObject.getInfo()` | None | Gets the fax's metadata information. |
| `faxObject.getFile()` | `thumbnail` (optional) | Gets the fax's document. The default `thumbnail` is `null`, which gets the full PDF file. Specify a string, `'s'` or `'l'`, to get a small or large JPG thumbnail (respectively) of the first page of the document. |
| `faxObject.deleteFile()` | None | Deletes a document associated with a fax. |
| `faxObject.testDelete()` | None | Deletes a fax created using Test API Credentials. |

```javascript
// Cancelling a fax you just sent.
phaxio.faxes.create({ to: '+1234567890', content_url: 'https://google.com' })
  .then((faxObject) => {
    return faxObject.cancel();
  })
  .then(response => console.log('Fax cancelled:\n', JSON.stringify(response, null, 2)))
  .catch((err) => { throw err; });

// Suppose that earlier you created a `FaxDB` sequelize model you want to store Fax data into.
phaxio.faxes.create({ to: '+1234567890', content_url: 'https://google.com' })
  .then((faxObject) => {
    return faxObject.getInfo();
  })
  .then((faxInfo) => {
    const fi = FaxDB.build(faxInfo);
    return fi.save();
  })
  .then(() => console.log('Insert successful.'))
  .catch((err) => { throw err; });

// Write out the thumbnail of a created fax to a file.
phaxio.faxes.create({ to: '+1234567890', content_url: 'https://google.com' })
  .then((faxObject) => {
    return faxObject.getFile('s')
  })
  .then(fileString => fs.writeFileSync(`${__dirname}/thumbnail.jpg`, fileString))
  .catch((err) => { throw err; });
```

#### `phaxio.faxes.cancel()`
Cancel a fax.

See [docs](https://www.phaxio.com/docs/api/v2.1/faxes/cancel) for more information.

Argument (Value):

| Key | Value Type | Required? | Description |
| --- | ---------- | --------- | ----------- |
| `id` | Integer | True | A Fax Identifier |

```javascript
phaxio.faxes.cancel(987)
  .then(response => console.log(JSON.stringify(response, null, 2)))
  .catch((err) => { throw err; });
```

#### `phaxio.faxes.resend()`
Resend a fax.

See [docs](https://www.phaxio.com/docs/api/v2.1/faxes/resend) for more information.

Argument (Value):

| Key | Value Type | Required? | Description |
| --- | ---------- | --------- | ----------- |
| `id` | Integer | True | A Fax Identifier |

```javascript
phaxio.faxes.resend(987)
  .then(response => console.log(JSON.stringify(response, null, 2)))
  .catch((err) => { throw err; });
```

#### `phaxio.faxes.getInfo()`
Get fax info.

See [docs](https://www.phaxio.com/docs/api/v2.1/faxes/get_fax) for more information.

Argument (Value):

| Key | Value Type | Required? | Description |
| --- | ---------- | --------- | ----------- |
| `id` | Integer | True | A Fax Identifier |

```javascript
phaxio.faxes.getInfo(987)
  .then(response => console.log(JSON.stringify(response, null, 2)))
  .catch((err) => { throw err; });
```

#### `phaxio.faxes.getFile()`
Get fax content file or thumbnail.

See [docs](https://www.phaxio.com/docs/api/v2.1/faxes/get_fax_file) for more information.

Arguments (Object):

| Key | Value Type | Required? | Description |
| --- | ---------- | --------- | ----------- |
| `id` | Integer | True | A Fax Identifier |
| `thumbnail` | String | False | The default `thumbnail` is `null`, which gets the full file. Specify a string, `'s'` or `'l'`, to get a small or large thumbnail (respectively) of the first page of the document. |

```javascript
phaxio.faxes.getFile({ id: 987 })
  .then(fileString => fs.writeFileSync(`${__dirname}/full_file.pdf`, fileString))
  .catch((err) => { throw err; });
```

#### `phaxio.faxes.listFaxes()`
List sent faxes.

See [docs](https://www.phaxio.com/docs/api/v2.1/faxes/list_faxes) for more information.

Arguments (Object):

| Key | Value Type | Required? | Description |
| --- | ---------- | --------- | ----------- |
| `created_before` | String | False | The end of the range. Must be in RFC 3339 format, except that the timezone may be omitted (e.g. `'2016-05-31T23:59:59'`). Defaults to now. |
| `created_after` | String | False | The beginning of the range. Must be in RFC 3339 format, except that the timezone may be omitted (e.g. `'2016-05-01T00:00:00'`). Defaults to one week ago. |
| `direction` | String | False | Either `'sent'` or `'received'`. Limits results to faxes with the specified direction. |
| `status` | String | False | Limits results to faxes with the specified status. |
| `phone_number` | String | False | A phone number in E.164 format that you want to use to filter results. The phone number must be an exact match, not a number fragment. |
| `tags` | Object | False | An object containing `key: value` metadata tags relevant to your application. You may specify up to 10 tags. `{ my_tag1: tag_val1, my_tag2: tag_val2, ..., my_tag10: tag_val10 }` |
| `per_page` | Integer | False | Maximum number of results returned per call or "page". |
| `page` | Integer | False | The current page number. 1-based. |

```javascript
phaxio.faxes.listFaxes()
  .then(response => console.log(JSON.stringify(response, null, 2)))
  .catch((err) => { throw err; });
```

#### `phaxio.faxes.deleteFile()`
Delete fax document files.

See [docs](https://www.phaxio.com/docs/api/v2.1/faxes/delete_fax_file) for more information.

Argument (Value):

| Key | Value Type | Required? | Description |
| --- | ---------- | --------- | ----------- |
| `id` | Integer | True | A Fax Identifier |

```javascript
phaxio.faxes.deleteFile(987)
  .then(response => console.log(JSON.stringify(response, null, 2)))
  .catch((err) => { throw err; });
```

#### `phaxio.faxes.testDelete()`
Delete a sent fax. **May only be used with test credentials.**

See [docs](https://www.phaxio.com/docs/api/v2.1/faxes/delete_fax) for more information.

Argument (Value):

| Key | Value Type | Required? | Description |
| --- | ---------- | --------- | ----------- |
| `id` | Integer | True | A Fax Identifier |

```javascript
phaxio.faxes.testDelete(987)
  .then(response => console.log(JSON.stringify(response, null, 2)))
  .catch((err) => { throw err; });
```

#### `phaxio.faxes.testReceive()`
Test receiving a fax.

See [docs](https://www.phaxio.com/docs/api/v2.1/faxes/test_receive) for more information.

Arguments (Object):

| Key | Value Type | Required? | Description |
| --- | ---------- | --------- | ----------- |
| `file` | String | True | A PDF file to simulate receiving. |
| `from_number` | String | False | The phone number of the simulated sender in E.164 format. Default is the public Phaxio fax number. |
| `to_number` | String | False | The phone number, in E.164 format, that is receiving the fax. Specifically, a Phaxio phone number you have purchased in your account that is "receiving" the fax, or the public Phaxio fax number. Default is the public Phaxio fax number. |

```javascript
phaxio.faxes.testReceive({ file: 'sample.pdf' })
  .then(response => console.log(JSON.stringify(response, null, 2)))
  .catch((err) => { throw err; });
```

### Account

#### `phaxio.account.status()`
Information about the Phaxio account for the configured API key and secret.

See [docs](https://www.phaxio.com/docs/api/v2.1/account/status) for more information.

Does not take arguments.

```javascript
phaxio.account.status()
  .then(response => console.log(JSON.stringify(response, null, 2)))
  .catch((err) => { throw err; });
```

### PhaxCode

#### `phaxio.phaxCode.create()`
Create a custom PhaxCode.

See [docs](https://www.phaxio.com/docs/api/v2.1/barcodes/create_phax_code) for more information.

Arguments (Object):

| Key | Value Type | Required? | Description |
| --- | ---------- | --------- | ----------- |
| `metadata` | String | True | Custom metadata to be associated with this barcode. |
| `type` | String | False | Defaults to `.json`. Other option is `.png` |

```javascript
phaxio.phaxCode.create({ metadata: 'This is my metadata.' })
  .then(response => console.log(JSON.stringify(response, null, 2)))
  .catch((err) => { throw err; });
```

#### `phaxio.phaxCode.get()`
Retreive a PhaxCode.

See [docs](https://www.phaxio.com/docs/api/v2.1/barcodes/retrieve_phax_code) for more information.

Arguments (Object):

| Key | Value Type | Required? | Description |
| --- | ---------- | --------- | ----------- |
| `id` | String | False | PhaxCode Identifier to retrieve. If not specified, provides default PhaxCode for your account. |
| `type` | String | False | Defaults to `.json`. Other option is `.png` |

```javascript
phaxio.phaxCode.get()
  .then(response => console.log(JSON.stringify(response, null, 2)))
  .catch((err) => { throw err; });
```

### Phone Number

#### `phaxio.phoneNumber.provisionNumber()`
Provision a phone number that you can use to receive faxes in your Phaxio account.

See [docs](https://www.phaxio.com/docs/api/v2.1/phone_numbers/provision) for more information.

Arguments (Object):

| Key | Value Type | Required? | Description |
| --- | ---------- | --------- | ----------- |
| `country_code` | Integer | True | The country code (E.164) of the number you'd like to provision. |
| `area_code` | Integer | True | The area code of the number you'd like to provision. |
| `callback_url` | String | False | A callback URL that we'll post to when a fax is received by this number. This will override the global receive callback URL, if you have one specified. |

```javascript
phaxio.phoneNumbers.provisionNumber({
  country_code: 1,
  area_code: 847,
})
  .then(response => console.log(JSON.stringify(response, null, 2)))
  .catch((err) => { throw err; });
```

#### `phaxio.phoneNumber.releaseNumber()`
Release a phone number that you no longer need.
Once a phone number is released you will no longer be charged for it.

See [docs](https://www.phaxio.com/docs/api/v2.1/phone_numbers/release) for more information.

Arguments (Value):

| Key | Value Type | Required? | Description |
| --- | ---------- | --------- | ----------- |
| `number` | String | True | The phone number to be released in E.164 format. |

```javascript
phaxio.phoneNumbers.releaseNumber('+1234567890')
  .then(response => console.log(JSON.stringify(response, null, 2)))
  .catch((err) => { throw err; });
```

#### `phaxio.phoneNumber.getNumberInfo()`
Get information about a phone number you own.

See [docs](https://www.phaxio.com/docs/api/v2.1/phone_numbers/get_number) for more information.

Arguments (Value):

| Key | Value Type | Required? | Description |
| --- | ---------- | --------- | ----------- |
| `number` | String | True | The phone number to be released in E.164 format. |

```javascript
phaxio.phoneNumber.getNumberInfo()
  .then(response => console.log(JSON.stringify(response, null, 2)))
  .catch((err) => { throw err; });
```

#### `phaxio.phoneNumber.listNumbers()`
Get a detailed list of the phone numbers that you currently own on Phaxio.

See [docs](https://www.phaxio.com/docs/api/v2.1/phone_numbers/list) for more information.

Arguments (Object):

| Key | Value Type | Required? | Description |
| --- | ---------- | --------- | ----------- |
| `country_code` | Integer | False | The country code (E.164) of the numbers you'd like to list. |
| `area_code` | Integer | False | The area code of the numbers you'd like to list. |

```javascript
phaxio.phoneNumber.listNumbers()
  .then(response => console.log(JSON.stringify(response, null, 2)))
  .catch((err) => { throw err; });
```

## Testing This Package
This package tests against the Phaxio API.

**YOU ARE RESPONSIBLE FOR ANY CHARGES ACCRUED WHEN RUNNING THE TEST SUITE.**

**WARNING** Running many of these tests will cause your Phaxio account to be billed, unless you use Test API credentials.

**DOUBLE WARNING** Running tests for provisioning Phone Numbers **WILL ALWAYS** bill your account, even if you use Test API credentials.
These tests are not run by default. See `test/phonenumber/index.test.js` for comments on how to enable these tests.

You should create a `.env` file in the root of this directory containing three pieces of information:

```bash
TEST_APIKEY # Your Phaxio Test API Key.
TEST_APISECRET # Your Phaxio Test API Secret.
PHONE_NUMBER # Your Phone Number purchased from Phaxio.
```

To run the test suite:

```bash
npm run test
```

Note: this test suite uses `setTimeout()` to reduce the likelihood of receiving rate limiting errors.

# LICENSE
MIT Copyright 2018 Phaxio

See `LICENSE` file for full detail.
