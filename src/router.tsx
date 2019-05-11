import React from 'react';
import { Router, Route, Switch, Redirect, match } from 'dva/router';

import { loginRoutes } from "./components/login/login/index";
import { homeRoutes } from "./components/home/home/index";

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        {loginRoutes()}
        {homeRoutes()}
        <Redirect to="/home" />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
