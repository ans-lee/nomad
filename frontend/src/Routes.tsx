import React from 'react';
import { Route, Switch } from 'react-router-dom';
import CreateEventPage from './pages/CreateEvent';
import EventPage from './pages/Event';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import ProfilePage from './pages/Profile';
import SearchEventsPage from './pages/SearchEvents';
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
  {
    route: '/event/create',
    component: CreateEventPage,
  },
  {
    route: '/event/search',
    component: SearchEventsPage,
  },
  {
    route: '/event/:id',
    component: EventPage,
  },
  {
    route: '/profile',
    component: ProfilePage,
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
