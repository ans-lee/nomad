import React from 'react';
import { Link } from 'react-router-dom';

const ProfileSideBar: React.FC = () => (
  <div className="flex flex-col w-80 p-8 bg-gray-200">
    <Link className="text-xl py-2" to="/profile">
      User Details
    </Link>
    <Link className="text-xl py-2" to="/profile/created-events">
      Created Events
    </Link>
  </div>
);

export default ProfileSideBar;
