import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import { deleteEvent, FetchError, getEvent } from 'src/api';
import Alert from 'src/components/Alert';
import { useStore } from 'src/store';
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
    createdBy: '',
  });
  const [errMsg, setErrMsg] = useState('');

  const { id: userID } = useStore((state) => state.userDetails);
  const { id } = useParams<PageParams>();
  const history = useHistory();

  const { isLoading } = useQuery(['event'], () => getEvent(id), {
    onSuccess: (data: EventData) => setDetails(parseEventData(data)),
    refetchOnWindowFocus: false,
    retry: false,
  });

  const mutation = useMutation(() => deleteEvent(id), {
    onError: (err: FetchError) => {
      if (err.res.status === 400) {
        setErrMsg('This event does not exist');
      } else {
        setErrMsg('Something went wrong! Please try again');
      }
    },
  });

  const handleDelete = () => {
    mutation.reset();
    mutation.mutate();
  };

  if (mutation.isSuccess) {
    history.goBack();
  }

  return (
    <div className="flex flex-col w-full h-full px-4 py-8">
      <div className="mx-72">
        {isLoading && <div>Loading</div>}
        {mutation.isError && <Alert text={errMsg} />}
        {!isLoading && (
          <>
            <div className="flex rounded-md border border-gray-300 w-full h-96 mb-4 items-center justify-center">
              No Image
            </div>
            <div className="text-3xl mb-2">{details.title}</div>
            {details.category !== 'none' && <span className="rounded-full bg-blue-200 px-2">{details.category}</span>}
            <div className="text-xl my-2">{getDuration(details.start, details.end)}</div>
            {getLocationComponent(details.location)}
            {getDescriptionComponent(details.description)}
            {details.createdBy === userID && (
              <div className="flex">
                <button
                  className="w-full bg-secondary rounded-md text-white px-3.5 py-2 mt-4 mr-24"
                  onClick={() => (window.location.href = `/event/edit/${id}`)}
                >
                  Edit
                </button>
                <button
                  className="w-full bg-danger rounded-md text-white px-3.5 py-2 mt-4"
                  onClick={() => handleDelete()}
                >
                  Delete
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EventInfo;
