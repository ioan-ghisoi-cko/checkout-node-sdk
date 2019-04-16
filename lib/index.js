"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var payments_1 = require("./payments");
var checkout = /** @class */ (function () {
    function checkout(key) {
        this.key = '';
        this.key = key;
        this.payments = new payments_1.default(key);
    }
    return checkout;
}());
var api = function (key) {
    return new checkout(key);
};
exports.default = api;
module.exports = api;
//# sourceMappingURL=index.js.map