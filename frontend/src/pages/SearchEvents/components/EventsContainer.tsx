import React, { Fragment, useState } from 'react';
import { useQuery } from 'react-query';
import { Coords } from 'google-map-react';
import { getAllEvents, EventsListResponse } from 'src/api';
import EventsList from 'src/components/EventsList';
import GoogleMap from 'src/components/GoogleMap';
import { DEFAULT_CENTER } from 'src/constants/GoogleMapConstants';
import { EventDetails } from 'src/types/EventTypes';

const EventsContainer: React.FC = () => {
  const [events, setEvents] = useState<Array<EventDetails>>([]);
  const [center, setCenter] = useState<Coords>(DEFAULT_CENTER);
  const { isLoading } = useQuery('allEvents', getAllEvents, {
    onSuccess: (data: EventsListResponse) => parseEventListData(data),
  });

  const parseEventListData = (data: EventsListResponse) => {
    const newEvents: EventDetails[] = [];

    data.events.forEach((item) => {
      const newEvent = {
        id: item.id,
        title: item.title,
        location: item.location,
        lat: item.lat,
        lng: item.lng,
        online: item.online,
        description: item.description,
        category: item.category,
        start: new Date(item.start),
        end: new Date(item.end),
      };
      newEvents.push(newEvent);
    });

    setEvents(newEvents);
  };

  return (
    <>
      <div className="h-full w-2/5 p-6 overflow-scroll">
        <h1 className="text-4xl mb-4">Events</h1>
        <EventsList loading={isLoading} events={events} />
      </div>
      <GoogleMap loading={isLoading} events={events} center={center} />
    </>
  );
};

export default EventsContainer;
