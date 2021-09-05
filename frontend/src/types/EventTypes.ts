export type EventDetails = {
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

export type EventFilters = {
  title: string;
  category: string;
};

export type EventsListProps = {
  loading: boolean;
  events: EventDetails[];
};
