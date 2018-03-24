import express from "express";
import bodyParser from "body-parser";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import path from "path";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";
import cors from "cors";
import models from "./models";

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./schema")));
const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "./resolvers"))
);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const app = express();

app.use(cors("*"));

// The GraphQL endpoint
app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress({
    schema,
    context: {
      models,
      user: {
        id: 1
      }
    }
  })
);

// GraphiQL, a visual editor for queries
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

models.sequelize.sync().then(() => {
  // Start the server

  console.log("Hello");
  app.listen(4000, () => {
    console.log("Go to http://localhost:4000/graphiql to run queries!");
  });
});
