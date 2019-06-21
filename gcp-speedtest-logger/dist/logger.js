"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.prototype.log = function (message) {
        /* tslint:disable:no-console */
        console.log(message);
        /* tslint:enable:no-console */
    };
    Logger.prototype.error = function (message) {
        /* tslint:disable:no-console */
        console.error(message);
        /* tslint:enable:no-console */
    };
    return Logger;
}());
exports.default = Logger;
//# sourceMappingURL=logger.js.map