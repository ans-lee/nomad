import classNames from 'classnames';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { getAllEvents } from 'src/api';
import SideEventsList from 'src/components/SideEventsList';
import GoogleMap from 'src/components/GoogleMap';
import { useStore } from 'src/store';
import { parseEventDataList } from 'src/utils/EventUtils';
import FiltersForm from 'src/components/Form/FiltersForm';

const EventsContainer: React.FC = () => {
  const [isMapView, setIsMapView] = useState(true);
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

  const swapBtnClasses = classNames(
    'absolute',
    'font-medium',
    'shadow-md',
    'cursor-pointer',
    'flex',
    'items-center',
    'justify-center',
    'inset-x-1/2',
    'bottom-24',
    'bg-white',
    'rounded-2xl',
    'p-2',
    'w-24'
  );

  return (
    <>
      {isMapView && (
        <>
          <div className="h-full w-2/5 p-6 overflow-scroll">
            <h1 className="text-4xl mb-4">Events</h1>
            <hr className="my-2" />
            <div className="text-xl mb-4">Filters</div>
            <FiltersForm />
            <SideEventsList loading={eventsQuery.isLoading} />
          </div>
          <div className="relative h-full w-3/5">
            <GoogleMap />
            <div className={swapBtnClasses} onClick={() => setIsMapView(false)}>
              Hide Map
            </div>
          </div>
        </>
      )}
      {!isMapView && (
        <div className="h-full w-2/5 p-6">
          <h1 className="text-4xl mb-4">Events</h1>
          <hr className="my-2" />
          <div className="text-xl mb-4">Filters</div>
          <FiltersForm />
          <SideEventsList loading={eventsQuery.isLoading} />
        </div>
      )}
    </>
  );
};

export default EventsContainer;
