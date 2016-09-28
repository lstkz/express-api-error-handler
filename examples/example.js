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
