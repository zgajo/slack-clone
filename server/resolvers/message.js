import { requiresAuth } from "../permissions";
import { PubSub, withFilter } from "graphql-subscriptions";

const pubsub = new PubSub();

const NEW_CHANNEL_MESSAGE = "NEW_CHANNEL_MESSAGE";

export default {
  Subscription: {
    newChannelMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
        (payload, args) => payload.channelId === args.channelId
      )
    }
  },
  Query: {
    messages: requiresAuth.createResolver(
      async (parent, { channelId }, { models, user }) =>
        models.Message.findAll(
          { order: [["created_at", "asc"]], where: { channelId } },
          { raw: true }
        )
    )
  },
  Mutation: {
    createMessage: requiresAuth.createResolver(
      async (parent, args, { models, user }) => {
        console.log("here");
        try {
          const message = await models.Message.create({
            ...args,
            userId: user.id
          });

          const asyncFunc = async () => {
            const currentUser = await models.User.findOne({
              where: {
                id: user.id
              }
            });

            pubsub.publish(NEW_CHANNEL_MESSAGE, {
              channelId: args.channelId,
              newChannelMessage: {
                ...message.dataValues,
                user: currentUser.dataValues
              }
            });
          };

          asyncFunc();

          return true;
        } catch (error) {
          return false;
        }
      } // bcrypt password
    )
  },
  Message: {
    user: ({ user, userId }, args, { models }) => {
      if (user) {
        return user;
      }
      return models.User.findOne({ where: { id: userId } });
    }
  }
};
