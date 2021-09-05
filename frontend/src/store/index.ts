import { Bounds, Coords } from 'google-map-react';
import create from 'zustand';
import { DEFAULT_BOUNDS, DEFAULT_CENTER } from 'src/constants/GoogleMapConstants';
import { EventDetails, EventFilters } from 'src/types/EventTypes';

interface AppState {
  events: EventDetails[];
  eventFilters: EventFilters;
  mapCenter: Coords;
  mapBounds: Bounds;
  setEvents: (newEvents: EventDetails[]) => void;
  setEventFilters: (newFilters: EventFilters) => void;
  setMapCenter: (newCenter: Coords) => void;
  setMapBounds: (newBounds: Bounds) => void;
}

export const useStore = create<AppState>((set) => ({
  events: [],
  eventFilters: { title: '', category: 'none' },
  mapCenter: DEFAULT_CENTER,
  mapBounds: DEFAULT_BOUNDS,
  setEvents: (newEvents: EventDetails[]) => set(() => ({ events: newEvents })),
  setEventFilters: (newFilters: EventFilters) => set(() => ({ eventFilters: newFilters })),
  setMapCenter: (newCenter: Coords) => set(() => ({ mapCenter: newCenter })),
  setMapBounds: (newBounds: Bounds) => set(() => ({ mapBounds: newBounds })),
}));
