"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var PubSub = require("@google-cloud/pubsub");
var RandomString = require("randomstring");
var PubSubTrigger = /** @class */ (function () {
    function PubSubTrigger(projectId, topic, logger) {
        var _this = this;
        this.topic = topic;
        this.logger = logger;
        this.messageCallbacks = {};
        this.pubSubClient = new PubSub({ projectId: projectId });
        this.subscriptionName = "gcp-speedtest-logger-" + RandomString.generate(7);
        this.createSubscription()
            .then(function () { return _this.listenToSubscription(); });
        this.registerProcessCleanUp();
    }
    PubSubTrigger.prototype.onMessage = function (user, device, callback) {
        var _a, _b;
        var userCallbacks = this.messageCallbacks[user] || {};
        this.messageCallbacks = __assign({}, this.messageCallbacks, (_a = {}, _a[user] = __assign({}, userCallbacks, (_b = {}, _b[device] = callback, _b)), _a));
        this.logger.log("Registered pubsub trigger for user '" + user + "' and device '" + device + "'");
    };
    PubSubTrigger.prototype.listenToSubscription = function () {
        var _this = this;
        this.pubSubClient.subscription(this.subscriptionName)
            .on('message', function (message) {
            var triggerMsg = JSON.parse(message.data);
            var callback = (_this.messageCallbacks[triggerMsg.user] || {})[triggerMsg.device];
            if (callback) {
                _this.logger
                    .log("Triggering callback for user '" + triggerMsg.user + "' and device '" + triggerMsg.device + "'");
                callback()
                    .then(function () { return message.ack(); });
            }
            else {
                _this.logger
                    .log("No callback registered for '" + triggerMsg.user + "' and device '" + triggerMsg.device + "'");
                message.ack();
            }
        });
    };
    PubSubTrigger.prototype.createSubscription = function () {
        var _this = this;
        return this.pubSubClient.topic(this.topic)
            .createSubscription(this.subscriptionName)
            .then(function (results) {
            return _this.logger.log("Subscription " + _this.subscriptionName + " for topic " + _this.topic + " created.");
        })
            .catch(function (err) {
            _this.logger.error("Error creating subscription " + _this.subscriptionName + ": " + err);
            throw err;
        });
    };
    PubSubTrigger.prototype.removeSubscription = function () {
        var _this = this;
        return this.pubSubClient.subscription(this.subscriptionName)
            .delete()
            .then(function () { return _this.logger.log("Subscription " + _this.subscriptionName + " deleted."); })
            .catch(function (err) { return _this.logger.error("Failed to delete subscription " + _this.subscriptionName + ": " + err); });
    };
    PubSubTrigger.prototype.registerProcessCleanUp = function () {
        var _this = this;
        var subscriptionCleanUp = function () {
            _this.removeSubscription()
                .then(function () {
                process.exit(0);
            });
        };
        process.on('SIGTERM', subscriptionCleanUp);
        process.on('SIGINT', subscriptionCleanUp);
    };
    return PubSubTrigger;
}());
exports.default = PubSubTrigger;
//# sourceMappingURL=pubsub.js.map