import classNames from 'classnames';
import React from 'react';
import Header from 'src/components/Header';

const HomePage: React.FC = () => {
  const gradientClasses = classNames(
    'bg-gradient-to-b',
    'from-pink-500',
    'to-blue-500',
    'flex',
    'h-screen-nav',
    'text-7xl',
    'justify-center',
    'items-center',
    'text-white'
  );

  return (
    <>
      <Header />
      <div className={gradientClasses}>Explore, Experience and Enjoy.</div>
    </>
  );
};

export default HomePage;
