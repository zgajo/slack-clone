import { RedisPubSub } from "graphql-redis-subscriptions";

export const pubsub = new RedisPubSub({
  connection: {
    host: process.env.REDIS_DOMAIN_NAME_DEV,
    port: process.env.REDIS_PORT_NUMBER_DEV,
    retry_strategy: options => {
      // reconnect after
      return Math.max(options.attempt * 100, 3000);
    }
  }
});
