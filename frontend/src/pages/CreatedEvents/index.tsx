import React from 'react';
import Header from 'src/components/Header';
import ProfileSideBar from 'src/components/ProfileSideBar';
import CreatedEvents from 'src/components/CreatedEvents';

const CreatedEventsPage: React.FC = () => (
  <>
    <Header />
    <div className="h-screen-nav flex flex-row justify-center">
      <ProfileSideBar />
      <CreatedEvents />
    </div>
  </>
);

export default CreatedEventsPage;
