import { Bounds, Coords } from 'google-map-react';
import create from 'zustand';
import { DEFAULT_BOUNDS, DEFAULT_CENTER } from 'src/constants/GoogleMapConstants';
import { EventDetails, EventFilters } from 'src/types/EventTypes';
import { UserDetails } from 'src/types/UserTypes';

interface AppState {
  userDetails: UserDetails;
  userAuthenticated: boolean;
  events: EventDetails[];
  eventFilters: EventFilters;
  mapCenter: Coords;
  mapBounds: Bounds;
  setUserDetails: (newDetails: UserDetails) => void;
  setUserAuthenticated: (userAuthenticated: boolean) => void;
  setEvents: (newEvents: EventDetails[]) => void;
  setEventFilters: (newFilters: EventFilters) => void;
  setMapCenter: (newCenter: Coords) => void;
  setMapBounds: (newBounds: Bounds) => void;
}

export const useStore = create<AppState>((set) => ({
  userDetails: { id: '', email: '', firstName: '', lastName: '' },
  userAuthenticated: false,
  events: [],
  eventFilters: { title: '', category: 'none', hideOnline: true, hideNoLocation: true },
  mapCenter: DEFAULT_CENTER,
  mapBounds: DEFAULT_BOUNDS,
  setUserAuthenticated: (userAuthenticated: boolean) => set(() => ({ userAuthenticated: userAuthenticated })),
  setUserDetails: (newDetails: UserDetails) => set(() => ({ userDetails: newDetails })),
  setEvents: (newEvents: EventDetails[]) => set(() => ({ events: newEvents })),
  setEventFilters: (newFilters: EventFilters) => set(() => ({ eventFilters: newFilters })),
  setMapCenter: (newCenter: Coords) => set(() => ({ mapCenter: newCenter })),
  setMapBounds: (newBounds: Bounds) => set(() => ({ mapBounds: newBounds })),
}));
