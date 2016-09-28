import request from 'supertest-as-promised';
import express from 'express';
import Joi from 'joi';
import sinon from 'sinon';
import HTTPStatus from 'http-status';
import HTTPError from 'http-errors';
import errorHandler from '../src/errorHandler';


describe('errorHandler', () => {
  let _app;

  const _createApp = (opts) => {
    _app = express();
    _app.get('/ok', (req, res) => res.json({ ok: true }));
    _app.get('/internal', (req, res, next) => next(new Error('custom error')));
    _app.get('/http-error', (req, res, next) => next(new HTTPError.NotFound('Object not found')));
    _app.get('/invalid-code', (req, res, next) => {
      const err = new Error('invalid-code');
      err.statusCode = 300;
      next(err);
    });
    _app.get('/joi', (req, res, next) => Joi.validate({ foo: 'bar' }, { foo: Joi.number() }, next));
    _app.use(errorHandler(opts));
  };

  describe('without log', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
      _createApp();
    });

    it('should not return an error', async() => {
      await request(_app)
        .get('/ok')
        .expect(HTTPStatus.OK, { ok: true });
    });

    it('should return an internal error', async() => {
      const { body } = await request(_app)
        .get('/internal')
        .expect(HTTPStatus.INTERNAL_SERVER_ERROR);
      expect(body).to.have.property('error').and.equal('custom error');
      expect(body).to.have.property('status').and.equal(HTTPStatus.INTERNAL_SERVER_ERROR);
      expect(body).to.have.property('stack').and.match(/Error: custom error/);
    });

    it('should fix an http code if < 400', async() => {
      const { body } = await request(_app)
        .get('/invalid-code')
        .expect(HTTPStatus.BAD_REQUEST);
      expect(body).to.have.property('error').and.equal('invalid-code');
      expect(body).to.have.property('status').and.equal(HTTPStatus.BAD_REQUEST);
    });

    it('should return a joi error', async() => {
      const { body } = await request(_app)
        .get('/joi')
        .expect(HTTPStatus.BAD_REQUEST);
      expect(body).to.have.property('error').and.equal('Validation failed');
      expect(body).to.have.property('details').and.have.lengthOf(1);
      expect(body.details[0]).to.have.property('message').and.equal('"foo" must be a number');
      expect(body).to.have.property('status').and.equal(HTTPStatus.BAD_REQUEST);
    });
    it('should return an error from http-errors', async() => {
      const { body } = await request(_app)
        .get('/http-error')
        .expect(HTTPStatus.NOT_FOUND);
      expect(body).to.have.property('error').and.equal('Object not found');
      expect(body).to.have.property('status').and.equal(HTTPStatus.NOT_FOUND);
    });
  });

  describe('with log', () => {
    let _log;
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
      _createApp({
        log: _log = sinon.spy(),
      });
    });

    it('should call the log on error', async() => {
      await request(_app)
        .get('/internal')
        .expect(HTTPStatus.INTERNAL_SERVER_ERROR);
      _log.should.have.been.calledWith({
        err: sinon.match((err) => /Error: custom error/.test(err)),
        req: sinon.match.object,
        res: sinon.match.object,
        body: {
          status: 500,
          error: 'custom error',
          stack: sinon.match.string,
        },
      });
    });

    it('should not call the log on success', async() => {
      await request(_app)
        .get('/ok')
        .expect(HTTPStatus.OK);
      _log.should.not.have.been.called;
    });
  });

  describe('prod mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
      _createApp();
    });

    it('should not return a call stack in prod mode', async() => {
      const { body } = await request(_app)
        .get('/internal')
        .expect(HTTPStatus.INTERNAL_SERVER_ERROR);
      expect(body).to.not.have.property('stack');
    });
  });
});
