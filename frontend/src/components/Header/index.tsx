import { Flex } from '@chakra-ui/react';
import React from 'react';
import Logo from './Logo';
import MenuToggle from './MenuToggle';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <Flex bg="red" color="black">
      <Logo />
      <MenuToggle isOpen={isOpen} toggle={toggle} />
    </Flex>
  );
};

export default Header;
