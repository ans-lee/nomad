import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Coords } from 'google-map-react';
import { getAllEvents, EventsListResponse, getLocation } from 'src/api';
import EventsList from 'src/components/EventsList';
import GoogleMap from 'src/components/GoogleMap';
import { EventFilters } from 'src/types/EventTypes';
import { SubmitHandler, useForm } from 'react-hook-form';
import LocationAutocomplete from 'src/components/Form/LocationAutocomplete';
import Input from 'src/components/Form/Input';
import Select from 'src/components/Form/Select';
import { OPTIONS } from 'src/constants/EventConstants';
import { useStore } from 'src/store';
import { parseEventListResponse } from 'src/utils/EventUtils';

type Inputs = {
  location: { value: string; label: string };
  title: string;
  category: string;
};

const EventsContainer: React.FC = () => {
  const { handleSubmit, watch, register, control } = useForm<Inputs>({
    defaultValues: { location: { value: '', label: '' } },
  });
  const watchLocation = watch('location');

  const bounds = useStore((state) => state.mapBounds);
  const setEvents = useStore((state) => state.setEvents);
  const setCenter = useStore((state) => state.setMapCenter);
  const [filters, setFilters] = useState<EventFilters>({ title: '', category: 'none' });

  const eventsQuery = useQuery(
    ['allEvents', bounds, filters],
    () => getAllEvents(bounds.ne, bounds.se, filters.title, filters.category),
    {
      onSuccess: (data: EventsListResponse) => setEvents(parseEventListResponse(data)),
    }
  );
  const searchQuery = useQuery('location', () => getLocation(watchLocation.value), {
    onSuccess: (data: Coords) => setCenter(data),
    enabled: false,
  });

  const locationSubmit: SubmitHandler<Inputs> = (data) => {
    if (data.location.value) {
      searchQuery.refetch();
    }
    setFilters({
      title: data.title,
      category: data.category,
    });
  };

  return (
    <>
      <div className="h-full w-2/5 p-6 overflow-scroll">
        <h1 className="text-4xl mb-4">Events</h1>
        <hr className="my-2" />
        <div className="text-xl mb-4">Filters</div>
        <form onSubmit={handleSubmit(locationSubmit)}>
          <LocationAutocomplete id="location" label="Location" control={control} />
          <Input type="text" id="title" label="Title" register={register} />
          <Select id="category" label="Category" register={register} options={OPTIONS} />
          <button
            type="submit"
            className="w-full bg-green-500 rounded-md border border-green-600 text-white px-3.5 py-2 mt-4 disabled:opacity-50"
          >
            Search
          </button>
        </form>
        <EventsList loading={eventsQuery.isLoading} />
      </div>
      <GoogleMap filters={filters} />
    </>
  );
};

export default EventsContainer;
