import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Home";
import Register from "./containers/Register";
import Login from "./containers/Login";

export default () => (
  <Switch>
    <Route path="/register" component={Register} />;
    <Route path="/login" component={Login} />;
    <Route path="/" component={Home} />;
  </Switch>
);
