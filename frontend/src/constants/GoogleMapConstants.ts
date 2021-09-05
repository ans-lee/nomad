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
  nw: { lat: -33.741874212942946, lng: 151.01739058629948 },
  se: { lat: -33.99956796634489, lng: 151.39813552038152 },
  sw: { lat: -33.99956796634489, lng: 151.01739058629948 },
  ne: { lat: -33.741874212942946, lng: 151.39813552038152 },
};

export const DEFAULT_ZOOM = 12;
