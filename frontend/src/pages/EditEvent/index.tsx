import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { getEvent } from 'src/api';
import EditEventForm from 'src/components/Form/EditEventForm';
import Header from 'src/components/Header';
import { EventData } from 'src/types/EventTypes';

interface PageParams {
  id: string;
}

type Inputs = {
  title: string;
  location: { value: string; label: string };
  online: boolean;
  description: string;
  category: string;
  start: Date;
  end: Date;
  isPrivate: boolean;
};

const EditEventPage: React.FC = () => {
  const [defaultValues, setDefaultValues] = useState<Inputs>({
    title: '',
    location: { value: '', label: '' },
    online: true,
    description: '',
    category: '',
    start: new Date(),
    end: new Date(),
    isPrivate: false,
  });
  const { id } = useParams<PageParams>();

  const { isLoading } = useQuery(['event'], () => getEvent(id), {
    onSuccess: (data: EventData) => {
      setDefaultValues({
        title: data.title,
        location: { value: data.location, label: data.location },
        online: data.online,
        description: data.description,
        category: data.category,
        start: new Date(data.start),
        end: new Date(data.end),
        isPrivate: data.visibility === 'private',
      });
    },
    refetchOnWindowFocus: false,
    retry: false,
  });

  return (
    <>
      <Header />
      <div className="h-screen-nav m-auto flex flex-col justify-center">
        <div className="h-full rounded-md border border-gray-300 p-4 bg-gray-100 sm:h-auto">
          {!isLoading && <EditEventForm defaultValues={defaultValues} />}
        </div>
      </div>
    </>
  );
};

export default EditEventPage;
