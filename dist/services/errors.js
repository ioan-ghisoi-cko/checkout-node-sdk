"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValueError = exports.ApiError = exports.BadGateway = exports.TooManyRequestsError = exports.ValidationError = exports.ErrorWithBody = exports.UnprocessableError = exports.NotFoundError = exports.UrlAlreadyRegistered = exports.ActionNotAllowed = exports.AuthenticationError = exports.ApiTimeout = exports.determineError = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var determineError =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(err) {
    var errorJSON;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(err.type === "request-timeout")) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return", new ApiTimeout());

          case 2:
            if (!(err instanceof ValueError)) {
              _context.next = 4;
              break;
            }

            throw err;

          case 4:
            if (!(err.json !== undefined)) {
              _context.next = 10;
              break;
            }

            _context.next = 7;
            return err.json.then(function (data) {
              return data;
            })["catch"](function (err) {});

          case 7:
            _context.t0 = _context.sent;
            _context.next = 11;
            break;

          case 10:
            _context.t0 = {};

          case 11:
            errorJSON = _context.t0;
            _context.t1 = err.status;
            _context.next = _context.t1 === 401 ? 15 : _context.t1 === 204 ? 16 : _context.t1 === 404 ? 17 : _context.t1 === 400 ? 18 : _context.t1 === 403 ? 19 : _context.t1 === 409 ? 20 : _context.t1 === 422 ? 21 : _context.t1 === 429 ? 26 : _context.t1 === 502 ? 31 : 32;
            break;

          case 15:
            return _context.abrupt("return", new AuthenticationError());

          case 16:
            return _context.abrupt("return", new NoWebhooksConfigured(204));

          case 17:
            return _context.abrupt("return", new NotFoundError());

          case 18:
            return _context.abrupt("return", new UnprocessableError());

          case 19:
            return _context.abrupt("return", new ActionNotAllowed());

          case 20:
            return _context.abrupt("return", new UrlAlreadyRegistered());

          case 21:
            _context.t2 = ValidationError;
            _context.next = 24;
            return errorJSON;

          case 24:
            _context.t3 = _context.sent;
            return _context.abrupt("return", new _context.t2(_context.t3));

          case 26:
            _context.t4 = TooManyRequestsError;
            _context.next = 29;
            return errorJSON;

          case 29:
            _context.t5 = _context.sent;
            return _context.abrupt("return", new _context.t4(_context.t5));

          case 31:
            return _context.abrupt("return", new BadGateway());

          case 32:
            _context.t6 = ApiError;
            _context.next = 35;
            return errorJSON;

          case 35:
            _context.t7 = _context.sent;
            return _context.abrupt("return", new _context.t6(_context.t7));

          case 37:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function determineError(_x) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Error raised for pre-api value validation
 *
 * @export
 * @class ApiTimeout
 * @extends {Error}
 */


exports.determineError = determineError;

var ApiTimeout =
/*#__PURE__*/
function (_Error) {
  (0, _inherits2["default"])(ApiTimeout, _Error);

  function ApiTimeout() {
    var _this;

    (0, _classCallCheck2["default"])(this, ApiTimeout);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ApiTimeout).call(this, "ApiTimeout"));
    Object.setPrototypeOf((0, _assertThisInitialized2["default"])(_this), (this instanceof ApiTimeout ? this.constructor : void 0).prototype);
    _this.name = ApiTimeout.name;
    return _this;
  }

  return ApiTimeout;
}((0, _wrapNativeSuper2["default"])(Error));
/**
 * AuthenticationError
 *
 * @export
 * @class AuthenticationError
 * @extends {Error}
 */


exports.ApiTimeout = ApiTimeout;

var AuthenticationError =
/*#__PURE__*/
function (_Error2) {
  (0, _inherits2["default"])(AuthenticationError, _Error2);

  function AuthenticationError(message) {
    var _this2;

    (0, _classCallCheck2["default"])(this, AuthenticationError);
    AuthenticationError.http_code = 401;
    _this2 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(AuthenticationError).call(this, message));
    Object.setPrototypeOf((0, _assertThisInitialized2["default"])(_this2), (this instanceof AuthenticationError ? this.constructor : void 0).prototype);
    _this2.name = AuthenticationError.name;
    return _this2;
  }

  return AuthenticationError;
}((0, _wrapNativeSuper2["default"])(Error));
/**
 * ActionNotAllowed
 *
 * @export
 * @class AuthenticationError
 * @extends {Error}
 */


exports.AuthenticationError = AuthenticationError;

var ActionNotAllowed =
/*#__PURE__*/
function (_Error3) {
  (0, _inherits2["default"])(ActionNotAllowed, _Error3);

  function ActionNotAllowed() {
    var _this3;

    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "ActionNotAllowed";
    (0, _classCallCheck2["default"])(this, ActionNotAllowed);
    ActionNotAllowed.http_code = 403;
    _this3 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ActionNotAllowed).call(this, message));
    Object.setPrototypeOf((0, _assertThisInitialized2["default"])(_this3), (this instanceof ActionNotAllowed ? this.constructor : void 0).prototype);
    _this3.name = ActionNotAllowed.name;
    return _this3;
  }

  return ActionNotAllowed;
}((0, _wrapNativeSuper2["default"])(Error));
/**
 * UrlAlreadyRegistered
 *
 * @export
 * @class UrlAlreadyRegistered
 * @extends {Error}
 */


exports.ActionNotAllowed = ActionNotAllowed;

var UrlAlreadyRegistered =
/*#__PURE__*/
function (_Error4) {
  (0, _inherits2["default"])(UrlAlreadyRegistered, _Error4);

  function UrlAlreadyRegistered() {
    var _this4;

    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "UrlAlreadyRegistered";
    (0, _classCallCheck2["default"])(this, UrlAlreadyRegistered);
    UrlAlreadyRegistered.http_code = 409;
    _this4 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(UrlAlreadyRegistered).call(this, message));
    Object.setPrototypeOf((0, _assertThisInitialized2["default"])(_this4), (this instanceof UrlAlreadyRegistered ? this.constructor : void 0).prototype);
    _this4.name = UrlAlreadyRegistered.name;
    return _this4;
  }

  return UrlAlreadyRegistered;
}((0, _wrapNativeSuper2["default"])(Error));
/**
 * NotFoundError
 *
 * @export
 * @class AuthenticationError
 * @extends {Error}
 */


exports.UrlAlreadyRegistered = UrlAlreadyRegistered;

var NotFoundError =
/*#__PURE__*/
function (_Error5) {
  (0, _inherits2["default"])(NotFoundError, _Error5);

  function NotFoundError() {
    var _this5;

    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "NotFoundError";
    (0, _classCallCheck2["default"])(this, NotFoundError);
    NotFoundError.http_code = 404;
    _this5 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(NotFoundError).call(this, message));
    Object.setPrototypeOf((0, _assertThisInitialized2["default"])(_this5), (this instanceof NotFoundError ? this.constructor : void 0).prototype);
    _this5.name = NotFoundError.name;
    return _this5;
  }

  return NotFoundError;
}((0, _wrapNativeSuper2["default"])(Error));
/**
 * UnprocessableError
 *
 * @export
 * @class UnprocessableError
 * @extends {Error}
 */


exports.NotFoundError = NotFoundError;

var UnprocessableError =
/*#__PURE__*/
function (_Error6) {
  (0, _inherits2["default"])(UnprocessableError, _Error6);

  function UnprocessableError() {
    var _this6;

    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "UnprocessableError";
    (0, _classCallCheck2["default"])(this, UnprocessableError);
    UnprocessableError.http_code = 400;
    _this6 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(UnprocessableError).call(this, message));
    Object.setPrototypeOf((0, _assertThisInitialized2["default"])(_this6), (this instanceof UnprocessableError ? this.constructor : void 0).prototype);
    _this6.name = UnprocessableError.name;
    return _this6;
  }

  return UnprocessableError;
}((0, _wrapNativeSuper2["default"])(Error));
/**
 * ValidationError
 *
 * @export
 * @class ValidationError
 * @extends {Error}
 */


exports.UnprocessableError = UnprocessableError;

var ErrorWithBody =
/*#__PURE__*/
function (_Error7) {
  (0, _inherits2["default"])(ErrorWithBody, _Error7);

  function ErrorWithBody(http_code, error, message) {
    var _this7;

    (0, _classCallCheck2["default"])(this, ErrorWithBody);
    _this7 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ErrorWithBody).call(this, message));
    Object.setPrototypeOf((0, _assertThisInitialized2["default"])(_this7), (this instanceof ErrorWithBody ? this.constructor : void 0).prototype);
    ErrorWithBody.http_code = http_code;
    _this7.body = error;
    return _this7;
  }

  return ErrorWithBody;
}((0, _wrapNativeSuper2["default"])(Error));
/**
 * ValidationError
 *
 * @export
 * @class ValidationError
 * @extends {Error}
 */


exports.ErrorWithBody = ErrorWithBody;

var ValidationError =
/*#__PURE__*/
function (_ErrorWithBody) {
  (0, _inherits2["default"])(ValidationError, _ErrorWithBody);

  function ValidationError(error) {
    var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "ValidationError";
    (0, _classCallCheck2["default"])(this, ValidationError);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ValidationError).call(this, 422, error, message));
  }

  return ValidationError;
}(ErrorWithBody);
/**
 * TooManyRequestsError
 *
 * @export
 * @class TooManyRequestsError
 * @extends {Error}
 */


exports.ValidationError = ValidationError;

var TooManyRequestsError =
/*#__PURE__*/
function (_ErrorWithBody2) {
  (0, _inherits2["default"])(TooManyRequestsError, _ErrorWithBody2);

  function TooManyRequestsError(error) {
    var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "TooManyRequestsError";
    (0, _classCallCheck2["default"])(this, TooManyRequestsError);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(TooManyRequestsError).call(this, 429, error, message));
  }

  return TooManyRequestsError;
}(ErrorWithBody);
/**
 * BadGateway
 *
 * @export
 * @class BadGateway
 * @extends {Error}
 */


exports.TooManyRequestsError = TooManyRequestsError;

var BadGateway =
/*#__PURE__*/
function (_Error8) {
  (0, _inherits2["default"])(BadGateway, _Error8);

  function BadGateway() {
    var _this8;

    (0, _classCallCheck2["default"])(this, BadGateway);
    _this8 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(BadGateway).call(this, "Bad gateway"));
    BadGateway.http_code = 502;
    Object.setPrototypeOf((0, _assertThisInitialized2["default"])(_this8), (this instanceof BadGateway ? this.constructor : void 0).prototype);
    return _this8;
  }

  return BadGateway;
}((0, _wrapNativeSuper2["default"])(Error));
/**
 * ApiError
 *
 * @export
 * @class HttpError
 * @extends {Error}
 */


exports.BadGateway = BadGateway;

var ApiError =
/*#__PURE__*/
function (_Error9) {
  (0, _inherits2["default"])(ApiError, _Error9);

  function ApiError(error) {
    var _this9;

    (0, _classCallCheck2["default"])(this, ApiError);
    _this9 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ApiError).call(this, "API Error"));
    Object.setPrototypeOf((0, _assertThisInitialized2["default"])(_this9), (this instanceof ApiError ? this.constructor : void 0).prototype);
    _this9.name = "API Error";
    return _this9;
  }

  return ApiError;
}((0, _wrapNativeSuper2["default"])(Error));
/**
 * AuthenticationError
 *
 * @export
 * @class ValueError
 * @extends {Error}
 */


exports.ApiError = ApiError;

var ValueError =
/*#__PURE__*/
function (_Error10) {
  (0, _inherits2["default"])(ValueError, _Error10);

  function ValueError(message) {
    var _this10;

    (0, _classCallCheck2["default"])(this, ValueError);
    _this10 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ValueError).call(this, message));
    Object.setPrototypeOf((0, _assertThisInitialized2["default"])(_this10), (this instanceof ValueError ? this.constructor : void 0).prototype);
    _this10.name = ValueError.name;
    _this10.body = message;
    return _this10;
  }

  return ValueError;
}((0, _wrapNativeSuper2["default"])(Error));

exports.ValueError = ValueError;
//# sourceMappingURL=errors.js.map