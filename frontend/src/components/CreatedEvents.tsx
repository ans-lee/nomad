import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { getUserCreatedEvents } from 'src/api';
import { useStore } from 'src/store';
import { parseEventDataList } from 'src/utils/EventUtils';

const CreatedEvents: React.FC = () => {
  const events = useStore((state) => state.events);
  const setEvents = useStore((state) => state.setEvents);

  const { isLoading } = useQuery('userEvents', getUserCreatedEvents, {
    onSuccess: (data) => setEvents(parseEventDataList(data)),
    refetchOnWindowFocus: false,
    retry: false,
  });

  return (
    <div className="flex flex-col w-full h-full p-8">
      <div className="text-4xl mb-8">Created Events</div>
      {isLoading && <div>Loading...</div>}
      {!isLoading &&
        events.map((item, key) => (
          <Link className="text-xl mb-4 shadow-md rounded-md bg-gray-100 p-4" to={`/event/${item.id}`} key={key}>
            {item.title}
          </Link>
        ))}
    </div>
  );
};

export default CreatedEvents;
