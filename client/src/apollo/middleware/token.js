import { ApolloLink } from "apollo-link";
import { wsLink } from "../apollo";

export const getTokenMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers }) => ({
    headers: {
      ...headers,
      "x-token": localStorage.getItem("token") || null,
      "x-refresh-token": localStorage.getItem("refreshToken") || null
    }
  }));

  return forward(operation);
});

export const setTokenAfterware = new ApolloLink((operation, forward) => {
  return forward(operation).map(res => {
    const context = operation.getContext();
    const {
      response: { headers }
    } = context;

    const token = headers.get("x-token");
    const refreshToken = headers.get("x-refresh-token");

    if (token) {
      localStorage.setItem("token", token);
      wsLink.subscriptionClient.tryReconnect();
    }
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    return res;
  });
});
