import bcrypt from "bcrypt";
import _ from "lodash";

import { tryLogin } from "../auth";

const formatErrors = (e, models) => {
  // If validation error from sequelize
  if (e instanceof models.sequelize.ValidationError) {
    /**
     * _.pick({a: 1, b: 2}, 'a') returns {a:1}
     */
    return e.errors.map(x => _.pick(x, ["path", "message"]));
  }

  return [{ path: "name", message: "something went wrong" }];
};

export default {
  Query: {
    getUser: (parent, { id }, { models }) =>
      models.User.findOne({ where: { id } }),
    allUsers: (parent, args, { models }) => models.User.findAll()
  },
  Mutation: {
    login: (parent, { email, password }, { models, SECRET, SECRET2 }) =>
      tryLogin(email, password, models, SECRET, SECRET2),
    register: async (parent, args, context) => {
      try {
        const user = await context.models.User.create(args);

        return {
          ok: true,
          user
        };
      } catch (error) {
        return {
          ok: false,
          errors: formatErrors(error, context.models)
        };
      }
    }
  }
};
