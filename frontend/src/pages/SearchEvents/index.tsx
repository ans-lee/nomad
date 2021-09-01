import React from 'react';
import EventsList from 'src/components/EventsList';
import Header from 'src/components/Header';
import GoogleMap from 'src/components/GoogleMap';

const SearchEventsPage: React.FC = () => (
  <>
    <Header />
    <div className="h-screen-nav m-auto flex justify-center">
      <div className="h-full w-2/5 p-6 overflow-scroll">
        <h1 className="text-4xl mb-4">Events</h1>
        <EventsList />
      </div>
      <GoogleMap />
    </div>
  </>
);

export default SearchEventsPage;
