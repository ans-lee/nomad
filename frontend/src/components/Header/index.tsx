import React from 'react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      Hi
    </div>
  );
};

export default Header;
