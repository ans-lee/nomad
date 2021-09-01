import React from 'react';
import GoogleMapReact from 'google-map-react';

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

const GoogleMap: React.FC = () => {
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
      />
    </div>
  );
};

export default GoogleMap;
