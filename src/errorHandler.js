import HTTPStatus from 'http-status';

/**
 * Create an express handler middleware for error handling
 * @param {Function} [log] the function to log the occurred error
 * @returns {Function} the express error middleware
 */
function errorHandler({ log } = {}) {
  return function errorHandlerMiddleware(err, req, res, next) { // eslint-disable-line no-unused-vars
    let status = err.statusCode || HTTPStatus.INTERNAL_SERVER_ERROR;
    if (err.isJoi) {
      status = HTTPStatus.BAD_REQUEST;
    }
    if (status < HTTPStatus.BAD_REQUEST) {
      status = HTTPStatus.BAD_REQUEST;
    }
    const body = { status };

    if (err.isJoi) {
      body.error = 'Validation failed';
      body.details = err.details;
    } else {
      body.error = err.message;
    }
    if (process.env.NODE_ENV !== 'production') {
      body.stack = err.stack;
    }
    if (log) {
      log({ err, req, res, body });
    }
    res.status(status);
    res.json(body);
  };
}

export default errorHandler;
