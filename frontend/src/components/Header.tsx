import classNames from 'classnames';
import React from 'react';
import { BiMenu, BiX } from 'react-icons/bi';
import { Link } from 'react-router-dom';

const links = [
  {
    name: 'Find Event',
    link: '/',
  },
  {
    name: 'Create Event',
    link: '/',
  },
  {
    name: 'About',
    link: '/',
  },
];

const authLinks = [
  {
    name: 'Login',
    link: '/login',
  },
  {
    name: 'Sign Up',
    link: '/signup',
  },
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const LogoContainer: React.FC = () => (
    <div className="font-bold flex p-0 h-full justify-between lg:px-4 lg:py-2.5">
      <Link className="flex items-center" to="/">
        Nomad
      </Link>
      <MenuToggle />
    </div>
  );

  const MenuToggle: React.FC = () => {
    const iconClasses: string = classNames('w-10', 'h-10');

    return (
      <div className="flex items-center lg:hidden">
        {isOpen ? (
          <BiX className={iconClasses} onClick={toggle} />
        ) : (
          <BiMenu className={iconClasses} onClick={toggle} />
        )}
      </div>
    );
  };

  const Links: React.FC = () => {
    const linkClasses: string = classNames(
      'h-full',
      'items-center',
      'flex',
      'flex-col',
      { hidden: !isOpen },
      'lg:flex',
      'lg:flex-row'
    );

    return (
      <>
        <div className={linkClasses}>
          {links.map((item, key) => (
            <Link className="flex px-4 py-2.5 h-full items-center" to={item.link} key={key}>
              {item.name}
            </Link>
          ))}
        </div>
        <div className={linkClasses}>
          {authLinks.map((item, key) => (
            <Link className="flex px-4 py-2.5 h-full items-center" to={item.link} key={key}>
              {item.name}
            </Link>
          ))}
        </div>
      </>
    );
  };

  return (
    <header>
      <nav className="flex flex-col px-3.5 py-1.5 text-lg justify-between w-full shadow lg:flex-row">
        <LogoContainer />
        <Links />
      </nav>
    </header>
  );
};

export default Header;
