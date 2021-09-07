import classNames from 'classnames';
import React from 'react';
import { BiMenu, BiX } from 'react-icons/bi';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { getUserMyself } from 'src/api';
import { useStore } from 'src/store';
import { UserDetails } from 'src/types/UserTypes';

const links = [
  {
    name: 'Find Event',
    link: '/event/search',
  },
  {
    name: 'Create Event',
    link: '/event/create',
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

  const { firstName } = useStore((state) => state.userDetails);
  const setUserDetails = useStore((state) => state.setUserDetails);
  const setUserAuthenticated = useStore((state) => state.setUserAuthenticated);

  useQuery('userMyself', getUserMyself, {
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
    const linkClasses: string = classNames('h-full', 'flex', 'flex-col', { hidden: !isOpen }, 'lg:flex', 'lg:flex-row');
    const hrClasses: string = classNames('mt-2', 'mb-4', { hidden: !isOpen });

    return (
      <>
        <hr className={hrClasses} />
        <div className={linkClasses}>
          {links.map((item, key) => (
            <Link className="flex py-2.5 h-full lg:px-4" to={item.link} key={key}>
              {item.name}
            </Link>
          ))}
        </div>
        <hr className={hrClasses} />
        <div className={linkClasses}>
          {!firstName &&
            authLinks.map((item, key) => (
              <Link className="flex py-2.5 h-full lg:px-4" to={item.link} key={key}>
                {item.name}
              </Link>
            ))}
          {firstName && (
            <Link className="flex py-2.5 h-full lg:px-4" to="/profile">
              Profile
            </Link>
          )}
        </div>
      </>
    );
  };

  return (
    <header className="sticky top-0 z-50 min-h-14 bg-white shadow">
      <nav className="flex flex-col px-3.5 py-1.5 text-lg justify-center min-h-14 w-full lg:flex-row lg:justify-between">
        <LogoContainer />
        <Links />
      </nav>
    </header>
  );
};

export default Header;
