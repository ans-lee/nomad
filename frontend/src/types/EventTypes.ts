export interface EventData {
  id: string;
  title: string;
  location: string;
  lat: number;
  lng: number;
  online: boolean;
  description: string;
  category: string;
  start: string;
  end: string;
  visibility: string;
  groupID: string;
}

export interface EventDetails {
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

export interface EventFilters {
  title: string;
  category: string;
};

export interface EventsListProps {
  loading: boolean;
};
