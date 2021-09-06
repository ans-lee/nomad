import React from 'react';
import Header from 'src/components/Header';
import EventInfo from './EventInfo';

const CreateEventPage: React.FC = () => (
  <>
    <Header />
    <div className="h-screen-nav m-auto flex flex-col justify-center">
      <EventInfo />
    </div>
  </>
);

export default CreateEventPage;
