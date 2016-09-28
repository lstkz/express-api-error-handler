import HTTPStatus from 'http-status';

/**
 * Create an express handler middleware for not found routes
 * @param {Function} [log] the function to log the occurred error
 * @returns {Function} the express middleware
 */
function notFoundHandler({ log } = {}) {
  return function notFoundHandlerMiddleware(req, res) {
    if (log) {
      log({ req, res });
    }
    res.status(HTTPStatus.NOT_FOUND);
    res.json({
      status: HTTPStatus.NOT_FOUND,
      error: 'route not found',
    });
  };
}

export default notFoundHandler;
