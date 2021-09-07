import React from 'react';
import { useQuery } from 'react-query';
import { Redirect, Route } from 'react-router';
import { getUserMyself } from 'src/api';
import { useStore } from 'src/store';
import { UserDetails } from 'src/types/UserTypes';

interface ProtectedRouteProps {
  component: React.ElementType;
  exact: boolean;
  path: string;
}

const ProtectedRoute = ({ exact, path, component: Component }: ProtectedRouteProps): JSX.Element => {
  const setUserDetails = useStore((state) => state.setUserDetails);
  const setUserAuthenticated = useStore((state) => state.setUserAuthenticated);
  const userAuthenticated = useStore((state) => state.userAuthenticated);

  const { isLoading } = useQuery('userMyself', getUserMyself, {
    onSuccess: (data: UserDetails) => {
      setUserDetails({ ...data });
      setUserAuthenticated(true);
    },
    onError: () => {
      setUserDetails({ email: '', firstName: '', lastName: '' });
      setUserAuthenticated(false);
    },
    refetchOnWindowFocus: false,
    retry: false,
  });

  return (
    <Route
      exact={exact}
      path={path}
      render={(props) => (isLoading || userAuthenticated ? <Component {...props} /> : <Redirect to="/login" />)}
    />
  );
};

export default ProtectedRoute;
