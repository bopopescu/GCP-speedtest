"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var CommandLineArgs = require("command-line-args");
var CommandLineUsage = require("command-line-usage");
var cli_1 = require("./cli");
var logger_1 = require("./logger");
var pubsub_1 = require("./pubsub");
var speedtest_logger_1 = require("./speedtest-logger");
var topicRegex = /^projects\/([a-zA-Z0-9-]+)\/topics\/([a-zA-Z0-9-]+)$/;
var logger = new logger_1.default();
function printUsage() {
    logger.log(CommandLineUsage(cli_1.usage));
}
function printErrorMessage(message) {
    logger.error(message);
    logger.log('---------------------------------------------');
    printUsage();
}
function validateArgs(_a) {
    var apiUrl = _a.apiUrl, user = _a.user, device = _a.device;
    var missingOptions = [];
    if (!apiUrl) {
        missingOptions.push('apiUrl');
    }
    if (!user) {
        missingOptions.push('user');
    }
    if (!device) {
        missingOptions.push('device');
    }
    if (missingOptions.length > 0) {
        var allMissing = missingOptions.reduce(function (agg, cur) { return "" + agg + (agg.length > 0 ? ',' : '') + "--" + cur; });
        printErrorMessage("Missing required option(s): " + allMissing);
        return false;
    }
    return true;
}
function speedtestInterval(speedtestLogger, interval) {
    return __awaiter(this, void 0, void 0, function () {
        var intervalMs, start, elapsed, waitMs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    intervalMs = interval * 1000;
                    start = Date.now();
                    return [4 /*yield*/, speedtestLogger.execute()];
                case 1:
                    _a.sent();
                    elapsed = Date.now() - start;
                    waitMs = elapsed < intervalMs ? intervalMs - elapsed : 0;
                    logger.log("Waiting " + waitMs + "ms for next test");
                    setTimeout(function () { return speedtestInterval(speedtestLogger, interval); }, waitMs);
                    return [2 /*return*/];
            }
        });
    });
}
function run() {
    var args = CommandLineArgs(cli_1.options);
    if (args.help) {
        printUsage();
    }
    else if (validateArgs(args)) {
        var speedtestLogger_1 = new speedtest_logger_1.default({
            url: args.apiUrl,
            user: args.user,
            device: args.device,
        }, logger);
        if (args.interval > 0) {
            logger.log("Running speedtest logging with interval: " + args.interval + "s");
            speedtestInterval(speedtestLogger_1, args.interval);
        }
        else if (args.triggerTopic) {
            var topicMatch = args.triggerTopic.match(topicRegex);
            if (topicMatch) {
                var project = topicMatch[1], topic = topicMatch[2];
                var trigger = new pubsub_1.default(project, topic, logger);
                trigger.onMessage(args.user, args.device, function () { return speedtestLogger_1.execute(); });
            }
            else {
                printErrorMessage("--triggerTopic argument did not match " + topicRegex + ": " + args.triggerTopic);
            }
        }
        else {
            speedtestLogger_1.execute();
        }
    }
}
run();
//# sourceMappingURL=index.js.map