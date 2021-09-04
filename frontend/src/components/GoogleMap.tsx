import React, { useState } from 'react';
import { useQuery } from 'react-query';
import GoogleMapReact, { ChangeEventValue, Coords } from 'google-map-react';
import { getAllEvents } from 'src/api';
import MapMarker from 'src/components/MapMarker';
import { MAP_STLYES, DEFAULT_ZOOM } from 'src/constants/GoogleMapConstants';
import { EventDetails, EventsListProps } from 'src/types/EventTypes';

interface GoogleMapProps extends EventsListProps {
  center: Coords;
}

const getLocations = (events: EventDetails[]) =>
  events.map((item, key) => <MapMarker title={item.title} lat={item.lat} lng={item.lng} key={key} />);

const GoogleMap: React.FC<GoogleMapProps> = ({ loading, events, center }) => {
  const { refetch } = useQuery('allEvents', getAllEvents);
  const apiKey: string = process.env.GOOGLE_API_KEY ? process.env.GOOGLE_API_KEY : '';

  return (
    <div className="h-full w-3/5">
      <GoogleMapReact
        options={{
          styles: MAP_STLYES,
        }}
        bootstrapURLKeys={{ key: apiKey }}
        center={center}
        defaultZoom={DEFAULT_ZOOM}
        onChange={(value: ChangeEventValue) => {
          console.log(value.bounds);
          refetch();
        }}
      >
        {!loading && getLocations(events)}
      </GoogleMapReact>
    </div>
  );
};

export default GoogleMap;
