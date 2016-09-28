'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create an express handler middleware for not found routes
 * @param {Function} [log] the function to log the occurred error
 * @returns {Function} the express middleware
 */
function notFoundHandler() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var log = _ref.log;

  return function notFoundHandlerMiddleware(req, res) {
    if (log) {
      log({ req: req, res: res });
    }
    res.status(_httpStatus2.default.NOT_FOUND);
    res.json({ error: 'route not found' });
  };
}

exports.default = notFoundHandler;