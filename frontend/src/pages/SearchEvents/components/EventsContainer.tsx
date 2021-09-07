import classNames from 'classnames';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { getAllEvents } from 'src/api';
import SideEventsList from 'src/components/SideEventsList';
import GoogleMap from 'src/components/GoogleMap';
import { useStore } from 'src/store';
import { parseEventDataList } from 'src/utils/EventUtils';
import FiltersForm from 'src/components/Form/FiltersForm';
import EventsList from 'src/components/EventsList';
import { DEFAULT_BOUNDS } from 'src/constants/GoogleMapConstants';

const EventsContainer: React.FC = () => {
  const [isMapView, setIsMapView] = useState(true);
  const bounds = useStore((state) => state.mapBounds);
  const filters = useStore((state) => state.eventFilters);
  const setBounds = useStore((state) => state.setMapBounds);
  const setEvents = useStore((state) => state.setEvents);

  const eventsQuery = useQuery(
    ['allEvents', bounds, filters],
    () =>
      getAllEvents(bounds.ne, bounds.se, filters.title, filters.category, filters.hideOnline, filters.hideNoLocation),
    {
      onSuccess: (data) => setEvents(parseEventDataList(data)),
      refetchOnWindowFocus: false,
    }
  );

  const handleToggleMapView = () => {
    setBounds(DEFAULT_BOUNDS);
    setIsMapView(!isMapView);
  };

  const hideMapBtnClasses = classNames(
    'absolute',
    'font-medium',
    'shadow-md',
    'cursor-pointer',
    'flex',
    'items-center',
    'justify-center',
    'inset-x-1/2',
    'bottom-24',
    'bg-primary',
    'text-white',
    'rounded-2xl',
    'p-2',
    'w-24'
  );

  const showMapBtnClasses = classNames(
    'font-medium',
    'shadow-md',
    'cursor-pointer',
    'flex',
    'items-center',
    'justify-center',
    'bg-secondary',
    'text-white',
    'rounded-2xl',
    'p-2',
    'mx-auto',
    'my-6',
    'w-28'
  );

  return (
    <>
      {isMapView && (
        <>
          <div className="h-full w-2/5 p-6 overflow-scroll">
            <h1 className="text-4xl mb-4">Find Events</h1>
            <hr className="my-2" />
            <div className="text-xl mb-4">Filters</div>
            <FiltersForm />
            <SideEventsList loading={eventsQuery.isLoading} />
          </div>
          <div className="relative h-full w-3/5">
            <GoogleMap />
            <div className={hideMapBtnClasses} onClick={() => handleToggleMapView()}>
              Hide Map
            </div>
          </div>
        </>
      )}
      {!isMapView && (
        <>
          <div className="sticky top-16 h-24 w-1/5 p-6">
            <div className="text-xl mb-4">Filters</div>
            <FiltersForm hideLocation={true} />
            <div className={showMapBtnClasses} onClick={() => handleToggleMapView()}>
              Show Map
            </div>
          </div>
          <div className="h-full w-2/5 p-6">
            <h1 className="text-4xl mb-4">Find Events</h1>
            <EventsList loading={eventsQuery.isLoading} />
          </div>
        </>
      )}
    </>
  );
};

export default EventsContainer;
