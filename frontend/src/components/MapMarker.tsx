import React from 'react';

interface MarkerProps {
  title: string;
  lat: number;
  lng: number;
}

const Marker: React.FC<MarkerProps> = ({ title }) => (
  <div className="rounded-full border-2 border-red-600 bg-white text-xs w-7 h-7 flex items-center justify-center">
    {title.charAt(0)}
  </div>
);

export default Marker;
