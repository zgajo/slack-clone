"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bcrypt = require("bcrypt");

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _permissions = require("../permissions");

var _formatErrors = require("../formatErrors");

var _formatErrors2 = _interopRequireDefault(_formatErrors);

var _auth = require("../auth");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  User: {
    teams: (parent, args, { models, user }) => models.sequelize.query("SELECT * FROM teams as team JOIN members as member ON team.id = member.team_id WHERE member.user_id = ?", {
      replacements: [user.id],
      model: models.Team,
      raw: true
    })
  },
  Query: {
    me: _permissions.requiresAuth.createResolver((parent, args, { models, user }) => models.User.findOne({ where: { id: user.id } })),
    allUsers: (parent, args, { models }) => models.User.findAll(),
    getUser: (parent, { userId }, { models }) => models.User.findOne({ where: { id: userId } })
  },
  Mutation: {
    login: (parent, { email, password }, { models, SECRET, SECRET2 }) => (0, _auth.tryLogin)(email, password, models, SECRET, SECRET2),
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
          errors: (0, _formatErrors2.default)(error, context.models)
        };
      }
    }
  }
};