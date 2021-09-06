import React from 'react';
import { useQuery } from 'react-query';
import { getAllEvents } from 'src/api';
import EventsList from 'src/components/EventsList';
import GoogleMap from 'src/components/GoogleMap';
import { useStore } from 'src/store';
import { parseEventDataList } from 'src/utils/EventUtils';
import FiltersForm from 'src/components/Form/FiltersForm';

const EventsContainer: React.FC = () => {
  const bounds = useStore((state) => state.mapBounds);
  const filters = useStore((state) => state.eventFilters);
  const setEvents = useStore((state) => state.setEvents);

  const eventsQuery = useQuery(
    ['allEvents', bounds, filters],
    () => getAllEvents(bounds.ne, bounds.se, filters.title, filters.category),
    {
      onSuccess: (data) => setEvents(parseEventDataList(data)),
    }
  );

  return (
    <>
      <div className="h-full w-2/5 p-6 overflow-scroll">
        <h1 className="text-4xl mb-4">Events</h1>
        <hr className="my-2" />
        <div className="text-xl mb-4">Filters</div>
        <FiltersForm />
        <EventsList loading={eventsQuery.isLoading} />
      </div>
      <GoogleMap />
    </>
  );
};

export default EventsContainer;
