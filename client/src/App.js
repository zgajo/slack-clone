import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import decode from 'jwt-decode';

import Home from "./Home";
import Register from "./containers/Register";
import Login from "./containers/Login";
import CreateTeam from "./containers/CreateTeam";

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  try {
    decode(token);
    decode(refreshToken);
  } catch (err) {
    return false;
  }

  return true;
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      (isAuthenticated() ? (
        <Component {...props} />
      ) : (
          <Redirect
            to={{
              pathname: '/login',
            }}
          />
        ))}
  />
);

export default () => (
  <Switch>
    <PrivateRoute path="/create_team" component={CreateTeam} />;
    <Route path="/register" component={Register} />;
    <Route path="/login" component={Login} />;
    <Route path="/" component={Home} />;
  </Switch>
);
