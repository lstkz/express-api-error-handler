'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notFoundHandler = exports.errorHandler = undefined;

var _errorHandler = require('./errorHandler');

var _errorHandler2 = _interopRequireDefault(_errorHandler);

var _notFoundHandler = require('./notFoundHandler');

var _notFoundHandler2 = _interopRequireDefault(_notFoundHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.errorHandler = _errorHandler2.default;
exports.notFoundHandler = _notFoundHandler2.default;