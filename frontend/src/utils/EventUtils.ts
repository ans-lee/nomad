import { EventsListResponse } from 'src/api';
import { DAYS } from 'src/constants/EventConstants';
import { EventDetails } from 'src/types/EventTypes';

const localeDateStringOptions: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

export const parseEventListResponse = (data: EventsListResponse): EventDetails[] => {
  const { events } = data;
  const newEvents: EventDetails[] = [];

  events.forEach((item) => {
    const newEvent = {
      id: item.id,
      title: item.title,
      location: item.location,
      lat: item.lat,
      lng: item.lng,
      online: item.online,
      description: item.description,
      category: item.category,
      start: new Date(item.start),
      end: new Date(item.end),
    };
    newEvents.push(newEvent);
  });

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
