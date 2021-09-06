import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from 'src/store';
import { EventsListProps } from 'src/types/EventTypes';
import { getDuration } from 'src/utils/EventUtils';

const getLocationComponent = (location: string) =>
  location ? (
    <div className="text-sm mb-4">{location}</div>
  ) : (
    <div className="text-sm italic text-gray-500 mb-4">No location specified</div>
  );

const getDescriptionComponent = (description: string) =>
  description ? (
    <div className="truncate">{description}</div>
  ) : (
    <div className="truncate italic text-gray-500">No description specified</div>
  );

const EventsList: React.FC<EventsListProps> = ({ loading }) => {
  const events = useStore((state) => state.events);

  return (
    <div className="flex flex-col">
      {!loading &&
        events.map((item, key) => (
          <Fragment key={key}>
            <hr className="my-2" />
            <Link to={`/event/${item.id}`}>
              <div className="flex w-full my-10">
                <div className="rounded-md border border-gray-300 w-2/5 h-48 mr-4"></div>
                <div className="flex flex-col w-1/2 h-48">
                  <div className="text-xl mb-2">{item.title}</div>
                  <div className="text-sm mb-2">{getDuration(item.start, item.end)}</div>
                  {getLocationComponent(item.location)}
                  {getDescriptionComponent(item.description)}
                </div>
              </div>
            </Link>
          </Fragment>
        ))}
    </div>
  );
};

export default EventsList;
