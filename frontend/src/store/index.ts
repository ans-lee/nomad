import { Bounds, Coords } from 'google-map-react';
import create from 'zustand';
import { DEFAULT_BOUNDS, DEFAULT_CENTER } from 'src/constants/GoogleMapConstants';

interface AppState {
  mapCenter: Coords;
  mapBounds: Bounds;
  setMapCenter: (newCenter: Coords) => void;
  setMapBounds: (newBounds: Bounds) => void;
}

export const useStore = create<AppState>((set) => ({
  mapCenter: DEFAULT_CENTER,
  mapBounds: DEFAULT_BOUNDS,
  setMapCenter: (newCenter: Coords) => set(() => ({ mapCenter: newCenter })),
  setMapBounds: (newBounds: Bounds) => set(() => ({ mapBounds: newBounds })),
}));
