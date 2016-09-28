'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create an express handler middleware for error handling
 * @param {Function} [log] the function to log the occurred error
 * @returns {Function} the express error middleware
 */
function errorHandler() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var log = _ref.log;

  return function errorHandlerMiddleware(err, req, res, next) {
    // eslint-disable-line no-unused-vars
    var status = err.httpStatus || _httpStatus2.default.INTERNAL_SERVER_ERROR;
    if (err.isJoi) {
      status = _httpStatus2.default.BAD_REQUEST;
    }
    if (status < _httpStatus2.default.BAD_REQUEST) {
      status = _httpStatus2.default.BAD_REQUEST;
    }
    var body = { status: status };

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
      log({ err: err, req: req, res: res, body: body });
    }
    res.status(status);
    res.json(body);
  };
}

exports.default = errorHandler;