import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { from, split } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import { withClientState } from "apollo-link-state";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import gql from "graphql-tag";

import { getTokenMiddleware, setTokenAfterware } from "./middleware/token";

// Create a WebSocket link:
export const wsLink = new WebSocketLink({
  uri: `ws://localhost:4001/subscriptions`,
  options: {
    reconnect: true,
    lazy: true,
    connectionParams: () => ({
      token:
        console.log("ws connect", localStorage.getItem("token")) ||
        localStorage.getItem("token"),
      refreshToken: localStorage.getItem("refreshToken")
    })
  }
});

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

const httpLinkWithMiddleware = from([
  stateLink,
  getTokenMiddleware,
  setTokenAfterware.concat(httpLink)
]);

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLinkWithMiddleware
);

const client = new ApolloClient({
  link,
  cache
});

export default client;
