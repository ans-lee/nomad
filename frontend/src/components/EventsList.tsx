import React, { Fragment } from 'react';
import { DAYS } from 'src/constants/EventConstants';
import { EventDetails, EventsListProps } from 'src/types/EventTypes';

const getDuration = (start: Date, end: Date): string => {
  const timeNow = new Date();
  if (start.getFullYear() === timeNow.getFullYear() && start.getFullYear() === end.getFullYear()) {
    const startStr = start.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
    const endStr = end.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });

    return `${DAYS[start.getDay()]} ${startStr} - ${DAYS[end.getDay()]} ${endStr}`;
  }

  const startStr = start.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
  const endStr = end.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  return `${DAYS[start.getDay()]} ${startStr} - ${DAYS[end.getDay()]} ${endStr}`;
};

const getLocationComponent = (location: string) =>
  location ? (
    <div className="text-sm mb-4">{location}</div>
  ) : (
    <div className="text-sm italic text-gray-500 mb-4">No location specified</div>
  );

const getDescriptionComponent = (description: string) =>
  description ? (
    <div className="break words">{description}</div>
  ) : (
    <div className="break words italic text-gray-500">No description specified</div>
  );

const getEvents = (events: EventDetails[]) =>
  events.map((item, key) => (
    <Fragment key={key}>
      <hr className="my-2" key={`border ${key}`} />
      <div className="flex w-full my-10">
        <div className="rounded-md border border-gray-300 w-72 h-48 mr-4"></div>
        <div className="flex flex-col w-3/5">
          <div className="text-xl mb-2">{item.title}</div>
          <div className="text-sm mb-2">{getDuration(item.start, item.end)}</div>
          {getLocationComponent(item.location)}
          {getDescriptionComponent(item.description)}
        </div>
      </div>
    </Fragment>
  ));

const EventsList: React.FC<EventsListProps> = ({ loading, events }) => {
  return <div className="flex flex-col">{!loading && getEvents(events)}</div>;
};

export default EventsList;
