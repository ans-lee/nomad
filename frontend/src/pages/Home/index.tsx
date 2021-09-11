import classNames from 'classnames';
import React from 'react';
import Header from 'src/components/Header';
import vividImg from 'src/assets/images/vivid.jpg';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const gradientClasses = classNames(
    'banner',
    'flex',
    'flex-col',
    'h-screen-nav',
    'justify-center',
    'items-center',
    'text-white'
  );

  const sectionClasses = classNames('h-screen-nav', 'flex', 'items-center', 'justify-center', 'p-16');

  return (
    <>
      <Header />
      <div className={gradientClasses}>
        <div className="text-7xl mb-4">Explore, Experience and Enjoy.</div>
        <Link className="bg-primary rounded-md text-white px-3.5 py-2 mt-4" to="/event/search">
          Find Events
        </Link>
      </div>
      <div className={sectionClasses}>
        <div>
          <h2 className="text-4xl pb-4">{`What is Nomad?`}</h2>
          <div>
            Nomad is a website where you can find events created by others. You can also create events for others to
            join, whether it be for your friends, societies, workmates or even for a concert!
          </div>
        </div>
        <div className="ml-20">
          <img src={vividImg} />
        </div>
      </div>
    </>
  );
};

export default HomePage;
