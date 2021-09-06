import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { getEvent } from 'src/api';
import { EventData, EventDetails } from 'src/types/EventTypes';
import { getDuration, parseEventData } from 'src/utils/EventUtils';

interface PageParams {
  id: string;
}

const getLocationComponent = (location: string) =>
  location ? (
    <div className="text-xl mb-4">{location}</div>
  ) : (
    <div className="text-xl italic text-gray-500 mb-4">No location specified</div>
  );

const getDescriptionComponent = (description: string) =>
  description ? (
    <div className="break words">{description}</div>
  ) : (
    <div className="break words italic text-gray-500">No description specified</div>
  );

const EventInfo: React.FC = () => {
  const [details, setDetails] = useState<EventDetails>({
    id: '',
    title: '',
    location: '',
    lat: 0,
    lng: 0,
    online: false,
    description: '',
    category: 'none',
    start: new Date(),
    end: new Date(),
  });
  const { id } = useParams<PageParams>();
  const { isLoading } = useQuery(['event'], () => getEvent(id), {
    onSuccess: (data: EventData) => setDetails(parseEventData(data)),
  });

  return (
    <div className="flex flex-col w-full h-full px-4 py-8">
      <div className="mx-72">
        <div className="rounded-md border border-gray-300 w-full h-96 mb-4"></div>
        <div className="text-3xl mb-2">{details.title}</div>
        <div className="text-xl mb-2">{getDuration(details.start, details.end)}</div>
        {getLocationComponent(details.location)}
        {getDescriptionComponent(details.description)}
      </div>
    </div>
  );
};

export default EventInfo;
