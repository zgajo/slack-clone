import { requiresAuth } from "../permissions";

export default {
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
          await models.Message.create({ ...args, userId: user.id });
          return true;
        } catch (error) {
          return false;
        }
      } // bcrypt password
    )
  },
  Message: {
    user: ({ userId }, args, { models }) =>
      models.User.findOne({ where: { id: userId } })
  }
};
