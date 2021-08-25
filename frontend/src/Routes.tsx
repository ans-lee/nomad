import React from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import SignUpPage from './pages/SignUp';

const routes = [
  {
    route: '/',
    component: HomePage,
  },
  {
    route: '/login',
    component: LoginPage,
  },
  {
    route: '/signup',
    component: SignUpPage,
  },
];

const Routes: React.FC = () => (
  <Switch>
    {routes.map((item, key) => (
      <Route exact path={item.route} component={item.component} key={key} />
    ))}
  </Switch>
);

export default Routes;
