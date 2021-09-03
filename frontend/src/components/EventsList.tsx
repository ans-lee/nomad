import React, { Fragment } from 'react';
import { useQuery } from 'react-query';
import { getPong } from 'src/api';

const events = [
  {
    title: 'Vivid 2022',
    location: 'Sydney Harbour Bridge',
    start: '5/9/2021',
    end: '6/9/2021',
    description: `Sydney's biggest annual lights show!`,
    category: 'Festival',
    online: false,
  },
  {
    title: 'Vivid 2022',
    location: 'Sydney Harbour Bridge',
    start: '5/9/2021',
    end: '6/9/2021',
    description: `Sydney's biggest annual lights show!`,
    category: 'Festival',
    online: false,
  },
  {
    title: 'Vivid 2022',
    location: 'Sydney Harbour Bridge',
    start: '5/9/2021',
    end: '6/9/2021',
    description: `Sydney's biggest annual lights show!`,
    category: 'Festival',
    online: false,
  },
];

const getEvents = events.map((item, key) => (
  <Fragment key={key}>
    <hr className="my-2" key={`border ${key}`} />
    <div className="flex w-full my-10">
      <div className="rounded-md border border-gray-300 w-72 h-48 mr-4"></div>
      <div className="flex flex-col w-1/2">
        <div className="text-xl mb-2">{item.title}</div>
        <div className="text-sm mb-2">{`${item.start} - ${item.end}`}</div>
        <div className="text-sm mb-4">{item.location}</div>
        <div className="break words">{item.description}</div>
      </div>
    </div>
  </Fragment>
));

const EventsList: React.FC = () => {
  const { isLoading, data } = useQuery('pong', getPong);

  return (
    <div className="flex flex-col">
      {getEvents}
      <div>{!isLoading ? data?.message : ''}</div>
    </div>
  );
};

export default EventsList;
