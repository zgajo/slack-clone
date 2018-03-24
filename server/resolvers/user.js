import bcrypt from 'bcrypt'

export default {
  Query: {
    getUser: (parent, args, { models }) =>
      models.User.findOne({ where: { id } }),
    allUsers: (parent, args, { models }) => models.User.findAll()
  },
  Mutation: {
    register: async (parent, { password, ...otherArgs }, context) => {

      try {
        const hashedPassword = await bcrypt.hash(password, 12);
        context.models.User.create({ ...otherArgs, password: hashedPassword }) // bcrypt password
        return true;
      } catch (error) {
        return false;
      }

    }
  }
};
