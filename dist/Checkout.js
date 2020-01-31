"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _config = require("./config");

var _index = require("./index");

var Checkout = function Checkout(key, options) {
  (0, _classCallCheck2["default"])(this, Checkout);
  var host = "";
  var pk = "";
  var sk = "";
  sk = !key ? process.env.CKO_SECRET_KEY || "" : key;
  pk = process.env.CKO_PUBLIC_KEY || "";

  if (sk && !_config.LIVE_SECRET_KEY_REGEX.test(sk) && !_config.SANDBOX_SECRET_KEY_REGEX.test(sk)) {
    throw new Error("Invalid Secret Key");
  } // if the host is not specified, determine it based on the key


  if (options && options.host) {
    host = options.host;
  } else {
    host = _config.LIVE_SECRET_KEY_REGEX.test(key) ? _config.LIVE_BASE_URL : _config.SANDBOX_BASE_URL;
  }

  this.config = {
    sk: sk,
    pk: pk,
    host: host,
    timeout: options && options.timeout ? options.timeout : _config.DEFAULT_TIMEOUT
  };
  this.payments = new _index.Payments(this.config);
  this.sources = new _index.Sources(this.config);
  this.tokens = new _index.Tokens(this.config);
};

exports["default"] = Checkout;
//# sourceMappingURL=Checkout.js.map