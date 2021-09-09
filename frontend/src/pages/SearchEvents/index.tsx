import React from 'react';
import Header from 'src/components/Header';
import EventsContainer from './EventsContainer';

const SearchEventsPage: React.FC = () => (
  <>
    <Header />
    <div className="h-screen-nav m-auto flex justify-center">
      <EventsContainer />
    </div>
  </>
);

export default SearchEventsPage;
