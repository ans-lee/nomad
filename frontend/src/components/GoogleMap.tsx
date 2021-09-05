import React, { Dispatch, SetStateAction } from 'react';
import { useQuery } from 'react-query';
import GoogleMapReact, { Bounds, ChangeEventValue, Coords } from 'google-map-react';
import { getAllEvents } from 'src/api';
import MapMarker from 'src/components/MapMarker';
import { MAP_STLYES, DEFAULT_ZOOM } from 'src/constants/GoogleMapConstants';
import { EventDetails, EventFilters, EventsListProps } from 'src/types/EventTypes';

interface GoogleMapProps extends EventsListProps {
  filters: EventFilters;
  center: Coords;
  bounds: Bounds;
  setBounds: Dispatch<SetStateAction<Bounds>>;
  setCenter: Dispatch<SetStateAction<Coords>>;
}

const getLocations = (events: EventDetails[]) =>
  events.map((item, key) => <MapMarker title={item.title} lat={item.lat} lng={item.lng} key={key} />);

const GoogleMap: React.FC<GoogleMapProps> = ({ loading, events, filters, center, bounds, setCenter, setBounds }) => {
  const { refetch } = useQuery('allEvents', () => getAllEvents(bounds.ne, bounds.sw, filters.title, filters.category));

  return (
    <div className="h-full w-3/5">
      <GoogleMapReact
        options={{
          styles: MAP_STLYES,
        }}
        bootstrapURLKeys={{ key: `${process.env.GOOGLE_API_KEY}` }}
        center={center}
        defaultZoom={DEFAULT_ZOOM}
        onChange={(value: ChangeEventValue) => {
          setBounds(value.bounds);
          setCenter(value.center);
          refetch();
        }}
      >
        {!loading && getLocations(events)}
      </GoogleMapReact>
    </div>
  );
};

export default GoogleMap;
