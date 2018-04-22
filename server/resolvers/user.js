import bcrypt from "bcrypt";
import _ from "lodash";
import { requiresAuth } from "../permissions";

import formatErrors from "../formatErrors";

import { tryLogin } from "../auth";

export default {
  User: {
    teams: (parent, args, { models, user }) =>
      models.sequelize.query(
        "SELECT * FROM teams as team JOIN members as member ON team.id = member.team_id WHERE member.user_id = ?",
        {
          replacements: [user.id],
          model: models.Team
        }
      )
  },
  Query: {
    me: requiresAuth.createResolver((parent, args, { models, user }) =>
      models.User.findOne({ where: { id: user.id } })
    ),
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
