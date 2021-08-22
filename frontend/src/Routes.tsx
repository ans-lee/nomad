import React from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePage from 'src/pages/Home';

const routes = [
  {
    route: '/',
    component: HomePage,
  },
];

const Routes: React.FC = () => (
  <Switch>
    {routes.map((item, key) => (
      <Route path={item.route} component={item.component} key={key} />
    ))}
  </Switch>
);

export default Routes;
