import React from 'react';
import GoogleMapReact from 'google-map-react';

type EventDetails = {
  id: string;
  title: string;
  location: string;
  lat: number;
  lng: number;
  online: boolean;
  description: string;
  category: string;
  start: Date;
  end: Date;
};

type EventsListProps = {
  loading: boolean;
  events: EventDetails[];
};

const mapStyles = [
  {
    featureType: 'transit',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
];
const defaultCenter = { lat: -33.8688, lng: 151.2093 };
const defaultZoom = 12;

const Marker = ({ title }: { title: string; lat: number; lng: number }) => (
  <div className="rounded-full border-2 border-red-600 bg-white text-xs w-7 h-7 flex items-center justify-center">
    {title.charAt(0)}
  </div>
);

const getLocations = (events: EventDetails[]) =>
  events.map((item, key) => <Marker title={item.title} lat={item.lat} lng={item.lng} key={key} />);

const GoogleMap: React.FC<EventsListProps> = ({ loading, events }) => {
  const apiKey: string = process.env.GOOGLE_API_KEY ? process.env.GOOGLE_API_KEY : '';

  return (
    <div className="h-full w-3/5">
      <GoogleMapReact
        options={{
          styles: mapStyles,
        }}
        bootstrapURLKeys={{ key: apiKey }}
        defaultCenter={defaultCenter}
        defaultZoom={defaultZoom}
      >
        {!loading && getLocations(events)}
      </GoogleMapReact>
    </div>
  );
};

export default GoogleMap;
