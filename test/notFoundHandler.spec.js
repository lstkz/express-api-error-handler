import request from 'supertest-as-promised';
import express from 'express';
import sinon from 'sinon';
import HTTPStatus from 'http-status';
import notFoundHandler from '../src/notFoundHandler';


describe('notFoundHandler', () => {
  let _app;

  const _createApp = (opts) => {
    _app = express();
    _app.get('/ok', (req, res) => res.json({ ok: true }));
    _app.use(notFoundHandler(opts));
  };

  describe('without log', () => {
    beforeEach(() => {
      _createApp();
    });

    it('should not return 404', async() => {
      await request(_app)
        .get('/ok')
        .expect(HTTPStatus.OK, { ok: true });
    });

    it('should return 404', async() => {
      await request(_app)
        .get('/404')
        .expect(HTTPStatus.NOT_FOUND, { status: HTTPStatus.NOT_FOUND, error: 'route not found' });
    });

    describe('with log', () => {
      let _log;
      beforeEach(() => {
        _createApp({
          log: _log = sinon.spy(),
        });
      });

      it('should call the log on error', async() => {
        await request(_app)
          .get('/404')
          .expect(HTTPStatus.NOT_FOUND);
        _log.should.have.been.calledWith({
          req: sinon.match.object,
          res: sinon.match.object,
        });
      });
    });
  });
});
