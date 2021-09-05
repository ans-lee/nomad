import React, { useState } from 'react';
import ReactSelect from 'react-select';
import { Control, Controller } from 'react-hook-form';
import { useQuery } from 'react-query';
import { getLocationSuggestions } from 'src/api';

interface LocationAutcompleteProps {
  id: string;
  label: string;
  control: Control<any>; // eslint-disable-line
}

const LocationAutocomplete: React.FC<LocationAutcompleteProps> = ({ id, label, control }) => {
  const [locationInput, setLocationInput] = useState('');
  const { isLoading, data } = useQuery(['suggestions', locationInput], ({ queryKey }) => {
    if (queryKey[1]) {
      return getLocationSuggestions(queryKey[1]);
    }
    return { locations: [] };
  });

  return (
    <>
      <label htmlFor={id} className="block">
        {label}
      </label>
      <Controller
        name={id}
        control={control}
        render={({ field: { onChange } }) => (
          <ReactSelect
            className="mt-2 mb-4"
            placeholder="Enter a location..."
            onChange={onChange}
            isLoading={isLoading}
            onInputChange={(value) => {
              setLocationInput(value);
            }}
            options={data?.locations.map((item) => ({ value: item, label: item }))}
          />
        )}
      />
    </>
  );
};

export default LocationAutocomplete;
