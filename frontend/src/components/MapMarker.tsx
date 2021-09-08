import classNames from 'classnames';
import React from 'react';
import { CATEGORY_OPTIONS } from 'src/constants/EventConstants';

interface MapMarkerProps {
  title: string;
  category: string;
  lat: number;
  lng: number;
}

const MapMarker: React.FC<MapMarkerProps> = ({ title, category }) => {
  const markerClasses = classNames(
    'rounded-full',
    category === CATEGORY_OPTIONS[0].value ? 'bg-gray-500' : '',
    category === CATEGORY_OPTIONS[1].value ? 'bg-blue-500' : '',
    category === CATEGORY_OPTIONS[2].value ? 'bg-white' : '',
    category === CATEGORY_OPTIONS[3].value ? 'bg-yellow-500' : '',
    category === CATEGORY_OPTIONS[4].value ? 'bg-green-500' : '',
    category === CATEGORY_OPTIONS[5].value ? 'bg-red-500' : '',
    category === CATEGORY_OPTIONS[6].value ? 'bg-pink-500' : '',
    category === CATEGORY_OPTIONS[7].value ? 'bg-yellow-900' : '',
    'text-sm',
    'font-bold',
    'text-white',
    'w-24',
    'h-7',
    'px-4',
    'flex',
    'items-center',
    'justify-center',
    'truncate',
    'shadow-md'
  );

  return <div className={markerClasses}>{title}</div>;
};

export default MapMarker;
