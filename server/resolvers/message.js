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
      async (parent, { offset, channelId }, { models, user }) => {
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

        return models.Message.findAll(
          {
            order: [["created_at", "ASC"]],
            where: { channelId },
            limit: 5,
            offset
          },
          { raw: true }
        );
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
    url: parent =>
      parent.url ? `http://localhost:4001/${parent.url}` : parent.url,
    user: ({ user, userId }, args, { models }) => {
      if (user) {
        return user;
      }
      return models.User.findOne({ where: { id: userId } });
    }
  }
};
