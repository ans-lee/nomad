import React from 'react';
import { Box } from '@chakra-ui/react';

const MenuToggle: React.FC<{ isOpen: boolean; toggle: () => void }> = ({ isOpen, toggle }) => (
  <Box display={{ base: 'block', md: 'none' }} onClick={toggle}>
    {isOpen ? 'O' : 'X'}
  </Box>
);

export default MenuToggle;
