import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORY_OPTIONS } from 'src/constants/EventConstants';

interface MapMarkerProps {
  id: string;
  title: string;
  category: string;
  lat: number;
  lng: number;
}

const MapMarker: React.FC<MapMarkerProps> = ({ id, title, category }) => {
  const markerClasses = classNames(
    'rounded-full',
    category === CATEGORY_OPTIONS[0].value ? 'bg-gray-500' : '',
    category === CATEGORY_OPTIONS[1].value ? 'bg-blue-500' : '',
    category === CATEGORY_OPTIONS[2].value ? 'bg-white' : '',
    category === CATEGORY_OPTIONS[3].value ? 'bg-yellow-500' : '',
    category === CATEGORY_OPTIONS[4].value ? 'bg-green-500' : '',
    category === CATEGORY_OPTIONS[5].value ? 'bg-red-500' : '',
    category === CATEGORY_OPTIONS[6].value ? 'bg-pink-300' : '',
    category === CATEGORY_OPTIONS[7].value ? 'bg-yellow-900' : '',
    category === CATEGORY_OPTIONS[8].value ? 'bg-black' : '',
    'text-sm',
    'font-bold',
    category === CATEGORY_OPTIONS[2].value ? 'text-black' : 'text-white',
    'w-24',
    'h-7',
    'px-2',
    'flex',
    'items-center',
    'cursor-pointer',
    'truncate',
    'shadow-md'
  );

  return (
    <Link to={`/event/${id}`} className={markerClasses}>
      {title}
    </Link>
  );
};

export default MapMarker;
