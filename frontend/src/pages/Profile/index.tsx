import React from 'react';
import Header from 'src/components/Header';
import ProfileSideBar from 'src/components/ProfileSideBar';
import ProfileContainer from './ProfileContainer';

const ProfilePage: React.FC = () => (
  <>
    <Header />
    <div className="h-screen-nav flex flex-row justify-center">
      <ProfileSideBar />
      <ProfileContainer />
    </div>
  </>
);

export default ProfilePage;
