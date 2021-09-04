import React, { useState } from 'react';
import GoogleMapReact, { ChangeEventValue, Coords } from 'google-map-react';
import MapMarker from 'src/components/MapMarker';
import { MAP_STLYES, DEFAULT_CENTER, DEFAULT_ZOOM } from 'src/constants/GoogleMapConstants';
import { EventDetails, EventsListProps } from 'src/types/EventTypes';

const getLocations = (events: EventDetails[]) =>
  events.map((item, key) => <MapMarker title={item.title} lat={item.lat} lng={item.lng} key={key} />);

const GoogleMap: React.FC<EventsListProps> = ({ loading, events }) => {
  const [center, setCenter] = useState<Coords>(DEFAULT_CENTER);
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
        yesIWantToUseGoogleMapApiInternals={true}
        onChange={(value: ChangeEventValue) => console.log(value.center)}
      >
        {!loading && getLocations(events)}
      </GoogleMapReact>
    </div>
  );
};

export default GoogleMap;
