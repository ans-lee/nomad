import { Bounds, Coords, MapTypeStyle } from 'google-map-react';

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

export const DEFAULT_CENTER: Coords = { lat: -33.87081833482233, lng: 151.2077630533405 };
export const DEFAULT_BOUNDS: Bounds = {
  nw: { lat: 0, lng: 0 },
  se: { lat: 0, lng: 0 },
  sw: { lat: 0, lng: 0 },
  ne: { lat: 0, lng: 0 },
};

export const DEFAULT_ZOOM = 12;
