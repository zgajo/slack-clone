import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

import "semantic-ui-css/semantic.min.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

import configureStore from "./shared/store/configStore"; //Initialize our store.
const store = configureStore();

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  request: async operation => {
    const token = await localStorage.getItem("token");
    const refreshToken = await localStorage.getItem("refreshToken");
    operation.setContext({
      headers: {
        "x-token": token,
        "x-refresh-token": refreshToken
      }
    });
  }
});

ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
