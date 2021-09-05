import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Bounds, Coords } from 'google-map-react';
import { getAllEvents, EventsListResponse, getLocation } from 'src/api';
import EventsList from 'src/components/EventsList';
import GoogleMap from 'src/components/GoogleMap';
import { DEFAULT_CENTER } from 'src/constants/GoogleMapConstants';
import { EventDetails } from 'src/types/EventTypes';
import { SubmitHandler, useForm } from 'react-hook-form';
import LocationAutocomplete from 'src/components/Form/LocationAutocomplete';

type Inputs = {
  location: { value: string; label: string };
};

const baseCoords = { lat: 0, lng: 0 };

const EventsContainer: React.FC = () => {
  const { handleSubmit, watch, control } = useForm<Inputs>({ defaultValues: { location: { value: '', label: '' } } });
  const watchLocation = watch('location');
  const [events, setEvents] = useState<Array<EventDetails>>([]);
  const [center, setCenter] = useState<Coords>(DEFAULT_CENTER);
  const [bounds, setBounds] = useState<Bounds>({ ne: baseCoords, nw: baseCoords, se: baseCoords, sw: baseCoords });
  const { isLoading } = useQuery('allEvents', () => getAllEvents(bounds.ne, bounds.se), {
    onSuccess: (data: EventsListResponse) => parseEventListData(data),
  });
  const searchQuery = useQuery('location', () => getLocation(watchLocation.value), {
    onSuccess: (data: Coords) => setCenter(data),
    enabled: false,
  });
  const onSubmit: SubmitHandler<Inputs> = () => {
    console.log('hi');
    searchQuery.refetch();
  };

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
        <form onSubmit={handleSubmit(onSubmit)}>
          <LocationAutocomplete id="location" label="Location" control={control} />
        </form>
        <EventsList loading={isLoading} events={events} />
      </div>
      <GoogleMap
        loading={isLoading}
        events={events}
        center={center}
        bounds={bounds}
        setCenter={setCenter}
        setBounds={setBounds}
      />
    </>
  );
};

export default EventsContainer;
