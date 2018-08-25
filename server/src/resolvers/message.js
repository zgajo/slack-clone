import { requiresAuth, requiresTeamAccess } from "../permissions";
import { withFilter } from "graphql-subscriptions";

import { pubsub } from "../pubsub";

const NEW_CHANNEL_MESSAGE = "NEW_CHANNEL_MESSAGE";

export default {
  Subscription: {
    newChannelMessage: {
      subscribe: requiresTeamAccess.createResolver(
        withFilter(
          () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
          (payload, args) => payload.channelId === args.channelId
        )
      )
    }
  },
  Query: {
    messages: requiresAuth.createResolver(
      async (parent, { cursor, channelId }, { models, user }) => {
        const channel = await models.Channel.findOne({
          raw: true,
          where: { id: channelId }
        });

        if (!channel.public) {
          const member = await models.PCMember.findOne({
            raw: true,
            where: { channelId, userId: user.id }
          });
          if (!member) {
            throw new Error("Not Authorized");
          }
        }

        const options = {
          order: [["created_at", "DESC"]],
          where: { channelId },
          limit: 25
        };

        if (cursor) {
          // sequelize model messages has to have indexed creted_at field,
          // so it could work faster
          options.where.created_at = {
            [models.sequelize.Op.lt]: cursor
          };
        }

        return models.Message.findAll(options, { raw: true });
      }
    )
  },
  Mutation: {
    createMessage: requiresAuth.createResolver(
      async (parent, { file, ...args }, { models, user }) => {
        try {
          const messageData = args;
          if (file) {
            messageData.filetype = file.type;
            messageData.url = file.path;
          }
          const message = await models.Message.create({
            ...messageData,
            userId: user.id
          });

          const asyncFunc = async () => {
            const currentUser = await models.User.findOne({
              where: {
                id: user.id
              }
            });

            console.log({
              ...message.dataValues,
              user: currentUser.dataValues
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
        } catch (err) {
          console.log(err);
          return false;
        }
      }
    )
  },
  Message: {
    url: (parent, args, { server_url }) =>
      parent.url
        ? `${process.env.SERVER_URL || "http://localhost:8081"}/${parent.url}`
        : parent.url,
    user: ({ user, userId }, args, { userLoader }) => {
      if (user) {
        return user;
      }
      return userLoader.load(userId);
    }
  }
};
