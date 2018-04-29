import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { createServer } from "http";
import jwt from "jsonwebtoken";

import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";
import { execute, subscribe } from "graphql";
import { PubSub } from "graphql-subscriptions";
import { SubscriptionServer } from "subscriptions-transport-ws";

import models from "./models";

import { refreshTokens } from "./auth";

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./schema")));
const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "./resolvers"))
);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const app = express();

const readToken = async (req, res, next) => {
  const token = await req.headers["x-token"];
  if (token) {
    try {
      const { user } = await jwt.verify(token, SECRET);
      req.user = user;
    } catch (error) {
      const refreshToken = await req.headers["x-refresh-token"];
      const newTokens = await refreshTokens(
        token,
        refreshToken,
        models,
        SECRET,
        SECRET2
      );
      if (newTokens.token && newTokens.refreshToken) {
        res.set("Access-Control-Expose-Headers", "x-token, x-refresh-token");
        res.set("x-token", newTokens.token);
        res.set("x-refresh-token", newTokens.refreshToken);
      }
      req.user = newTokens.user;
    }
  }
  next();
};

// parse application/json
app.use(bodyParser.json());
app.use(readToken);
app.use(cors("*"));

const SECRET = "sdfAsds:_:As!";
const SECRET2 = "23213$%&$#$LKJdsš";

// The GraphQL endpoint
app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress(req => ({
    schema,
    context: {
      models,
      user: req.user,
      SECRET,
      SECRET2
    }
  }))
);

// GraphiQL, a visual editor for queries
app.use(
  "/graphiql",
  graphiqlExpress({
    endpointURL: "/graphql",
    subscriptionsEndpoint: "ws://localhost:4001/subscriptions"
  })
);

const server = createServer(app);

models.sequelize.sync({ force: false }).then(() => {
  // Start the server

  server.listen(4001, () => {
    new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
        onConnect: async ({ token, refreshToken }, webSocket) => {
          if (token && refreshToken) {
            let user = null;
            try {
              const { user } = jwt.verify(token, SECRET);
              return { models, user };
            } catch (err) {
              const newTokens = await refreshTokens(
                token,
                refreshToken,
                models,
                SECRET,
                SECRET2
              );
              return { models, user: newTokens.user };
            }

            // const member = await models.Member.findOne({
            //   where: { teamId: 1, userId: user.id }
            // });

            // if (!member) {
            //   throw new Error("Missing auth tokens!");
            // }
          }

          return { models };
        }
      },
      {
        server,
        path: "/subscriptions"
      }
    );
    console.log("Go to http://localhost:4001/graphiql to run queries!");
  });
});
