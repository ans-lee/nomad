import React from 'react';
import { useQuery } from 'react-query';
import { getPong } from 'src/api';
import Header from 'src/components/Header';

const HomePage: React.FC = () => {
  const { isLoading, data } = useQuery('pong', getPong);

  return (
    <>
      <Header />
      <div className="flex h-screen-nav text-7xl justify-center items-center">Explore, Experience and Enjoy.</div>
      <div>{!isLoading ? data?.message : ''}</div>
    </>
  );
};

export default HomePage;
