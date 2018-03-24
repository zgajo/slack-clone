import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Home";
import Register from "./containers/Register";


export default () => (
  <Switch>
    <Route path="/register" component={Register} />;
    <Route path="/" component={Home} />;
</Switch>
);
