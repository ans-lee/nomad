import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import CreatedEventsPage from './pages/CreatedEvents';
import CreateEventPage from './pages/CreateEvent';
import EditEventPage from './pages/EditEvent';
import EventPage from './pages/Event';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import LogoutPage from './pages/Logout';
import NotFoundPage from './pages/NotFound';
import ProfilePage from './pages/Profile';
import SearchEventsPage from './pages/SearchEvents';
import SignUpPage from './pages/SignUp';

const routes = [
  {
    route: '/',
    component: HomePage,
    authRequired: false,
  },
  {
    route: '/login',
    component: LoginPage,
    authRequired: false,
  },
  {
    route: '/logout',
    component: LogoutPage,
    authRequired: true,
  },
  {
    route: '/signup',
    component: SignUpPage,
    authRequired: false,
  },
  {
    route: '/event/create',
    component: CreateEventPage,
    authRequired: true,
  },
  {
    route: '/event/search',
    component: SearchEventsPage,
    authRequired: false,
  },
  {
    route: '/event/edit/:id',
    component: EditEventPage,
    authRequired: true,
  },
  {
    route: '/event/:id',
    component: EventPage,
    authRequired: false,
  },
  {
    route: '/profile/created-events',
    component: CreatedEventsPage,
    authRequired: true,
  },
  {
    route: '/profile',
    component: ProfilePage,
    authRequired: true,
  },
  {
    route: '*',
    component: NotFoundPage,
    authRequired: false,
  },
];

const Routes: React.FC = () => (
  <Switch>
    {routes.map((item, key) =>
      item.authRequired ? (
        <ProtectedRoute exact={true} path={item.route} component={item.component} key={key} />
      ) : (
        <Route exact={true} path={item.route} component={item.component} key={key} />
      )
    )}
  </Switch>
);

export default Routes;
