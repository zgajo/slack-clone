"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pubsub = undefined;

var _graphqlRedisSubscriptions = require("graphql-redis-subscriptions");

var pubsub = exports.pubsub = new _graphqlRedisSubscriptions.RedisPubSub({
  connection: {
    host: process.env.REDIS_DOMAIN_NAME_DEV,
    port: process.env.REDIS_PORT_NUMBER_DEV,
    retry_strategy: function retry_strategy(options) {
      // reconnect after
      return Math.max(options.attempt * 100, 3000);
    }
  }
});