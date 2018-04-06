import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { from } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import { withClientState } from "apollo-link-state";
import gql from "graphql-tag";

import { getTokenMiddleware, setTokenAfterware } from "./middleware/token";

const httpLink = new HttpLink({ uri: "http://localhost:4001/graphql" });

const cache = new InMemoryCache();

const defaultState = {
  User: {
    __typename: "User",
    email: "",
    password: ""
  }
};

const stateLink = withClientState({
  cache,
  defaults: defaultState,
  resolvers: {
    Mutation: {
      updateEmail: (_, { email }, { cache }) => {
        const query = gql`
          query GetCurrentUser {
            User @client {
              email
              password
            }
          }
        `;
        const previous = cache.readQuery({ query });
        const data = {
          User: {
            ...previous.User,
            email
          }
        };

        cache.writeQuery({ query, data });
      },
      updatePassword: (_, { password }, { cache }) => {
        const query = gql`
          query GetCurrentUser {
            User @client {
              email
              password
            }
          }
        `;
        const previous = cache.readQuery({ query });
        const data = {
          User: {
            ...previous.User,
            password
          }
        };

        cache.writeQuery({ query, data });
      }
    }
  }
});

const client = new ApolloClient({
  link: from([
    stateLink,
    getTokenMiddleware,
    setTokenAfterware.concat(httpLink)
  ]),
  cache
});

export default client;
