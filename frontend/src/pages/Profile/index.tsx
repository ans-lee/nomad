import React from 'react';
import Header from 'src/components/Header';
import ProfileContainer from './ProfileContainer';

const ProfilePage: React.FC = () => (
  <>
    <Header />
    <div className="h-screen-nav m-auto flex flex-col justify-center">
      <ProfileContainer />
    </div>
  </>
);

export default ProfilePage;
