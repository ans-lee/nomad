import { Coords, MapTypeStyle } from 'google-map-react';

export const MAP_STLYES: MapTypeStyle[] = [
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

export const DEFAULT_CENTER: Coords = { lat: -33.8688, lng: 151.2093 };

export const DEFAULT_ZOOM = 12;
