import { DAYS } from 'src/constants/EventConstants';
import { EventData, EventDetails } from 'src/types/EventTypes';

const localeDateStringOptions: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

export const parseEventData = (data: EventData): EventDetails => {
  return {
    id: data.id,
    title: data.title,
    location: data.location,
    lat: data.lat,
    lng: data.lng,
    online: data.online,
    description: data.description,
    category: data.category,
    start: new Date(data.start),
    end: new Date(data.end),
    createdBy: data.createdBy,
  };
};

export const parseEventDataList = (data: { events: EventData[] }): EventDetails[] => {
  const { events } = data;
  const newEvents: EventDetails[] = [];

  events.forEach((item) => newEvents.push(parseEventData(item)));

  return newEvents;
};

export const getDuration = (start: Date, end: Date): string => {
  const timeNow = new Date();
  if (start.getFullYear() === timeNow.getFullYear() && start.getFullYear() === end.getFullYear()) {
    const startStr = start.toLocaleString(undefined, localeDateStringOptions);
    const endStr = end.toLocaleString(undefined, localeDateStringOptions);

    return `${DAYS[start.getDay()]} ${startStr} - ${DAYS[end.getDay()]} ${endStr}`;
  }

  const startStr = start.toLocaleString(undefined, {
    ...localeDateStringOptions,
    year: 'numeric',
  });
  const endStr = end.toLocaleString(undefined, {
    ...localeDateStringOptions,
    year: 'numeric',
  });

  return `${DAYS[start.getDay()]} ${startStr} - ${DAYS[end.getDay()]} ${endStr}`;
};
