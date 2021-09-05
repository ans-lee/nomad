import { Bounds, Coords } from 'google-map-react';
import create from 'zustand';
import { DEFAULT_BOUNDS, DEFAULT_CENTER } from 'src/constants/GoogleMapConstants';
import { EventDetails } from 'src/types/EventTypes';

interface AppState {
  events: EventDetails[];
  mapCenter: Coords;
  mapBounds: Bounds;
  setEvents: (newEvents: EventDetails[]) => void;
  setMapCenter: (newCenter: Coords) => void;
  setMapBounds: (newBounds: Bounds) => void;
}

export const useStore = create<AppState>((set) => ({
  events: [],
  mapCenter: DEFAULT_CENTER,
  mapBounds: DEFAULT_BOUNDS,
  setEvents: (newEvents: EventDetails[]) => set(() => ({ events: newEvents })),
  setMapCenter: (newCenter: Coords) => set(() => ({ mapCenter: newCenter })),
  setMapBounds: (newBounds: Bounds) => set(() => ({ mapBounds: newBounds })),
}));
