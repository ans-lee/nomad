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
  createdBy: string;
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
  createdBy: string;
};

export interface EventFilters {
  title: string;
  category: string;
  hideOnline: boolean;
  hideNoLocation: boolean;
};

export interface EventFormInputs {
  title: string;
  location: { value: string; label: string };
  online: boolean;
  description: string;
  category: string;
  start: Date;
  end: Date;
  isPrivate: boolean;
};
