"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _config = require("../config");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var http =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(fetch, config, request) {
    var response, bodyParser, json;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return fetch(request.url, {
              method: request.method,
              timeout: config.timeout,
              body: JSON.stringify(request.body),
              headers: _objectSpread({}, request.headers, {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
                pragma: "no-cache"
              })
            });

          case 3:
            response = _context.sent;

            // For 'no body' response, replace with empty object
            bodyParser = function bodyParser(response) {
              return response.text().then(function (text) {
                return text ? JSON.parse(text) : {};
              });
            };

            if (response.ok) {
              _context.next = 8;
              break;
            }

            json = bodyParser(response);
            throw {
              status: response.status,
              json: json
            };

          case 8:
            return _context.abrupt("return", response.json().then(function (data) {
              // Return CKO response headers when available
              if (_config.REQUEST_ID_HEADER in response.headers.raw()) {
                if (request.method === "get") {
                  return {
                    status: response.status,
                    json: data
                  };
                }

                return {
                  status: response.status,
                  json: data,
                  headers: {
                    "cko-request-id": response.headers.raw()[_config.REQUEST_ID_HEADER][0],
                    "cko-version": response.headers.raw()[_config.API_VERSION_HEADER][0]
                  }
                };
              } else {
                return {
                  status: response.status,
                  json: data
                };
              }
            })["catch"](function (err) {
              return {
                status: response.status,
                json: {}
              };
            }));

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](0);
            throw _context.t0;

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 11]]);
  }));

  return function http(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var _default = http;
exports["default"] = _default;
//# sourceMappingURL=http.js.map