import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Home";
import Register from "./containers/Register";
import Login from "./containers/Login";
import CreateTeam from "./containers/CreateTeam";

export default () => (
  <Switch>
    <Route path="/create_team" component={CreateTeam} />;
    <Route path="/register" component={Register} />;
    <Route path="/login" component={Login} />;
    <Route path="/" component={Home} />;
  </Switch>
);
