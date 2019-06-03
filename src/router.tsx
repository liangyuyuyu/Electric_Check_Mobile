import React from 'react';
import { Router, Route, Switch, Redirect, match } from 'dva/router';

import { loginRoutes } from "./components/login/login/index";
import { homeRoutes } from "./components/home/home/index";
import { contactRoutes } from "./components/contact/contact/index";
import { taskRoutes } from "./components/task/task/index";
import { myRoutes } from "./components/my/my/index";

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        {loginRoutes()}
        {homeRoutes()}
        {taskRoutes()}
        {contactRoutes()}
        {myRoutes()}
        <Redirect to="/my" />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
