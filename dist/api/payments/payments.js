"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _errors = require("../../services/errors");

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _http = _interopRequireDefault(require("../../services/http"));

var _validation = require("../../services/validation");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var pjson = require("../../../package.json");

var Payments =
/*#__PURE__*/
function () {
  function Payments(config) {
    (0, _classCallCheck2["default"])(this, Payments);
    this.config = config;
  }

  (0, _createClass2["default"])(Payments, [{
    key: "request",
    value: function () {
      var _request = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(body, idempotencyKey) {
        var response, json, isCompleted, isFlagged, requiresRedirect, error;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                (0, _validation.setSourceOrDestinationType)(body);
                (0, _validation.validatePayment)(body);
                _context.next = 5;
                return (0, _http["default"])(_nodeFetch["default"], {
                  timeout: this.config.timeout
                }, {
                  method: "post",
                  url: "".concat(this.config.host, "/payments"),
                  headers: idempotencyKey !== undefined ? {
                    Authorization: this.config.sk,
                    "Cko-Idempotency-Key": idempotencyKey
                  } : {
                    Authorization: this.config.sk
                  },
                  // Add metadata, to be able to identify requests from this SDK
                  body: _objectSpread({}, body, {
                    metadata: _objectSpread({}, body.metadata, {
                      sdk: "node",
                      sdk_version: pjson.version
                    })
                  })
                });

              case 5:
                response = _context.sent;
                _context.next = 8;
                return response.json;

              case 8:
                json = _context.sent;
                isCompleted = false;
                isFlagged = false;
                requiresRedirect = false;

                if (json.destination) {
                  if (json.approved && json.status === "Paid") {
                    isCompleted = true;
                  }

                  isFlagged = false;
                  requiresRedirect = false;
                } else {
                  isCompleted = json.status === "Pending" ? false : json.approved && json.risk.flagged !== true && json.status === "Authorized" && json.response_summary === "Approved";
                  isFlagged = json.status === "Pending" ? false : json.risk.flagged;
                  requiresRedirect = json.status === "Pending";
                }

                return _context.abrupt("return", _objectSpread({}, json, {
                  isCompleted: isCompleted,
                  isFlagged: isFlagged,
                  requiresRedirect: requiresRedirect
                }));

              case 16:
                _context.prev = 16;
                _context.t0 = _context["catch"](0);
                _context.next = 20;
                return (0, _errors.determineError)(_context.t0);

              case 20:
                error = _context.sent;
                throw error;

              case 22:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 16]]);
      }));

      function request(_x, _x2) {
        return _request.apply(this, arguments);
      }

      return request;
    }()
  }, {
    key: "get",
    value: function () {
      var _get = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(id) {
        var getPayment;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return this._getHandler("".concat(this.config.host, "/payments/").concat(id));

              case 3:
                getPayment = _context2.sent;
                return _context2.abrupt("return", getPayment.json);

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2["catch"](0);
                _context2.next = 11;
                return (0, _errors.determineError)(_context2.t0);

              case 11:
                throw _context2.sent;

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 7]]);
      }));

      function get(_x3) {
        return _get.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: "getActions",
    value: function () {
      var _getActions = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(id) {
        var getPaymentActions;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return this._getHandler("".concat(this.config.host, "/payments/").concat(id, "/actions"));

              case 3:
                getPaymentActions = _context3.sent;
                return _context3.abrupt("return", getPaymentActions.json);

              case 7:
                _context3.prev = 7;
                _context3.t0 = _context3["catch"](0);
                _context3.next = 11;
                return (0, _errors.determineError)(_context3.t0);

              case 11:
                throw _context3.sent;

              case 12:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 7]]);
      }));

      function getActions(_x4) {
        return _getActions.apply(this, arguments);
      }

      return getActions;
    }()
  }, {
    key: "capture",
    value: function () {
      var _capture = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4(paymentId, body) {
        var response;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this._actionHandler("captures", paymentId, body);

              case 2:
                response = _context4.sent;
                return _context4.abrupt("return", response);

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function capture(_x5, _x6) {
        return _capture.apply(this, arguments);
      }

      return capture;
    }()
  }, {
    key: "refund",
    value: function () {
      var _refund = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee5(paymentId, body) {
        var response;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this._actionHandler("refunds", paymentId, body);

              case 2:
                response = _context5.sent;
                return _context5.abrupt("return", response);

              case 4:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function refund(_x7, _x8) {
        return _refund.apply(this, arguments);
      }

      return refund;
    }()
  }, {
    key: "void",
    value: function () {
      var _void2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee6(paymentId, body) {
        var response;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this._actionHandler("voids", paymentId, body);

              case 2:
                response = _context6.sent;
                return _context6.abrupt("return", response);

              case 4:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function _void(_x9, _x10) {
        return _void2.apply(this, arguments);
      }

      return _void;
    }()
  }, {
    key: "_actionHandler",
    value: function () {
      var _actionHandler2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee7(action, paymentId, body) {
        var response;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                _context7.next = 3;
                return (0, _http["default"])(_nodeFetch["default"], {
                  timeout: this.config.timeout
                }, {
                  method: "post",
                  url: "".concat(this.config.host, "/payments/").concat(paymentId, "/").concat(action),
                  headers: {
                    Authorization: this.config.sk
                  },
                  body: body !== undefined ? body : {}
                });

              case 3:
                response = _context7.sent;
                return _context7.abrupt("return", response.json);

              case 7:
                _context7.prev = 7;
                _context7.t0 = _context7["catch"](0);
                _context7.next = 11;
                return (0, _errors.determineError)(_context7.t0);

              case 11:
                throw _context7.sent;

              case 12:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this, [[0, 7]]);
      }));

      function _actionHandler(_x11, _x12, _x13) {
        return _actionHandler2.apply(this, arguments);
      }

      return _actionHandler;
    }()
  }, {
    key: "_getHandler",
    value: function () {
      var _getHandler2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee8(url) {
        var response;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return (0, _http["default"])(_nodeFetch["default"], {
                  timeout: this.config.timeout
                }, {
                  method: "get",
                  url: url,
                  headers: {
                    Authorization: this.config.sk
                  }
                });

              case 2:
                response = _context8.sent;
                return _context8.abrupt("return", response);

              case 4:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function _getHandler(_x14) {
        return _getHandler2.apply(this, arguments);
      }

      return _getHandler;
    }()
  }]);
  return Payments;
}();

exports["default"] = Payments;
//# sourceMappingURL=payments.js.map