import React from 'react';

const Alert: React.FC<{ text: string }> = ({ text }) => (
  <div className="w-full text-sm mt-2 mb-4 px-3.5 py-1 bg-red-200 rounded-md border border-red-300">{text}</div>
);

export default Alert;
