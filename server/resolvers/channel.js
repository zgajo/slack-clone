import formatErrors from "../formatErrors";
import { requiresAuth } from "../permissions";

export default {
  Mutation: {
    createChannel: requiresAuth.createResolver(
      async (parent, args, { models, user }) => {
        try {
          const team = await models.Team.findById(args.teamId);
          if (team.owner !== user.id) {
            return {
              ok: false,
              errors: [
                {
                  path: "name",
                  message: "You have to be owner of the team to create channels"
                }
              ]
            };
          }
          const channel = await models.Channel.create({ ...args });
          return {
            ok: true,
            channel
          };
        } catch (error) {
          return {
            ok: false,
            errors: formatErrors(error, models)
          };
        }
      }
    )
  }
};
