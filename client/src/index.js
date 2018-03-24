import React from "react";
import ReactDOM from "react-dom";
import 'semantic-ui-css/semantic.min.css'
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

import { BrowserRouter } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql"
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById("root")
);
registerServiceWorker();
