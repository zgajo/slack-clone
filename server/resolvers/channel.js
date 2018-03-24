export default {
  Mutation: {
    createChannel: async (parent, args, { models, user }) => {
      try {
        await models.Channel.create({ ...args });
        return true;
      } catch (error) {
        return false;
      }
    }
  }
};
