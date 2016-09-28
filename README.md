# express-api-error-handler
[![Build Status](https://travis-ci.org/lsentkiewicz/express-api-error-handler.svg?branch=master)](https://travis-ci.org/lsentkiewicz/express-api-error-handler)
[![codecov](https://codecov.io/gh/lsentkiewicz/express-api-error-handler/branch/master/graph/badge.svg)](https://codecov.io/gh/lsentkiewicz/express-api-error-handler)

express-api-error-handler is a simple library for error handling in express apps
It's compatible with [joi](https://www.npmjs.com/package/joi) and [http-errors](https://www.npmjs.com/package/http-errors);

## Installation

```
npm i --save express-api-error-handler
```


## Sample usage with [bunyan](https://github.com/trentm/node-bunyan) as a logger

You can test the below example by running `npm run example`

```js
// app.js

import express from 'express';
import Joi from 'joi';
import HTTPError from 'http-errors';
import bunyan from 'bunyan';
import { errorHandler, notFoundHandler } from '../src';

const app = express();
const logger = bunyan.createLogger({ name: 'app' });

app.get('/', (req, res) => {
  res.json({ ok: true });
});

app.get('/error', (req, res, next) => {
  next(new HTTPError.NotFound('Object not found'));
});

app.get('/joi', (req, res, next) => {
  Joi.validate({ foo: 'bar' }, { foo: Joi.number() }, next);
});

app.use(errorHandler({
  log: ({ err, req, res, body }) => {
    logger.error(err, `${body.status} ${req.method} ${req.url}`);
  },
}));

app.use(notFoundHandler({
  log: ({ req, res }) => {
    logger.error(`404 ${req.method} ${req.url}`);
  },
}));

const PORT = 3000;
app.listen(PORT);


```

### Errors from http-errors
`GET http://localhost:3000/error`

Response:
![Alt text](https://monosnap.com/file/49YQ2fEfJ05IBYpSmJ9xyQf39aqDyn.png)

Console log:
![Alt text](https://monosnap.com/file/CtxlOukGp46qmws2CZDi2nweyPTGIP.png)


### Errors from Joi
`GET http://localhost:3000/error`

Response:
![Alt text](https://monosnap.com/file/gfHDcaUAwhmgVUv16K2EeWtntqE5Ku.png)

Console log:
![Alt text](https://monosnap.com/file/DKCwjwksgNlX6W34IY8ArlPdpvQPe5.png)


### Not found routes

`GET http://localhost:3000/foobar`

Response:
![Alt text](https://monosnap.com/file/C4ivCvdCylIEYKktDTd1KWEKZhFISR.png)

Console log:
![Alt text](https://monosnap.com/file/bpLLHHwH9a0n9QVzwg6q9MJwMjhcpq.png)


## API
#### Error handler
```js
errorHandler({
  /**
   * The optional handler for logging
   * @param {Error} err the occured error
   * @param {Object} req the request express object
   * @param {Object} res the response express object
   * @param {Object} body the response body
   * @param {Number} body.status the returned http status
   * @param {String} body.error the error message
   * @param {Array} body.details the Joi validation details
   * @param {Array} body.stack the stack trace (only if NODE_ENV !== 'production')
   */
  log: ({ err, req, res, body }) => {
    ...
  },
})
```
#### Not found handler
```js
notFoundHandler({
  /**
   * The optional handler for logging
   * @param {Object} req the request express object
   * @param {Object} res the response express object
   */
  log: ({ req, res }) => {
    ...
  },
})
```


MIT License

Copyright (c) 2016 Łukasz Sentkiewicz