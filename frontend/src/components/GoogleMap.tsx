import React from 'react';
import { useQuery } from 'react-query';
import GoogleMapReact from 'google-map-react';
import { getAllEvents } from 'src/api';
import MapMarker from 'src/components/MapMarker';
import { MAP_STLYES, DEFAULT_ZOOM } from 'src/constants/GoogleMapConstants';
import { EventDetails } from 'src/types/EventTypes';
import { useStore } from 'src/store';

const getLocations = (events: EventDetails[]) =>
  events.map((item, key) => <MapMarker title={item.title} lat={item.lat} lng={item.lng} key={key} />);

const GoogleMap: React.FC = () => {
  const events = useStore((state) => state.events);
  const filters = useStore((state) => state.eventFilters);
  const bounds = useStore((state) => state.mapBounds);
  const center = useStore((state) => state.mapCenter);
  const setBounds = useStore((state) => state.setMapBounds);
  const setCenter = useStore((state) => state.setMapCenter);

  const { isLoading, refetch } = useQuery(['allEvents', bounds, filters], () =>
    getAllEvents(bounds.ne, bounds.sw, filters.title, filters.category)
  );

  return (
    <div className="h-full w-3/5">
      <GoogleMapReact
        options={{
          styles: MAP_STLYES,
        }}
        bootstrapURLKeys={{ key: `${process.env.GOOGLE_API_KEY}` }}
        center={center}
        defaultZoom={DEFAULT_ZOOM}
        onChange={({ bounds, center }) => {
          setBounds(bounds);
          setCenter(center);
          refetch();
        }}
        onGoogleApiLoaded={() => setCenter(center)}
      >
        {!isLoading && getLocations(events)}
      </GoogleMapReact>
    </div>
  );
};

export default GoogleMap;
