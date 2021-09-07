import React from 'react';
import { useQuery } from 'react-query';
import { Redirect } from 'react-router-dom';
import { userLogout } from 'src/api';

const LogoutPage: React.FC = () => {
  const { isSuccess } = useQuery('userLogout', userLogout, {
    refetchOnWindowFocus: false,
    retry: false,
  });

  if (isSuccess) {
    return <Redirect to="/" />;
  }

  return <div>Logging out...</div>;
};

export default LogoutPage;
