import classNames from 'classnames';
import React from 'react';
import ReactGoogleAutocomplete from 'react-google-autocomplete';
import { Control, Controller, UseFormSetValue } from 'react-hook-form';

interface LocationAutcompleteProps {
  id: string;
  label: string;
  control: Control<any>; // eslint-disable-line
  setValue: UseFormSetValue<any>; // eslint-disable-line
}

const LocationAutocomplete: React.FC<LocationAutcompleteProps> = ({ id, label, control, setValue }) => {
  const classes: string = classNames(
    'w-full',
    'mt-2',
    'mb-4',
    'px-3.5',
    'py-1',
    'outline-none',
    'rounded-md',
    'border',
    'border-gray-300',
    'border-gray-300',
    'focus:ring-2',
    'focus:ring-blue-600'
  );

  return (
    <>
      <label htmlFor={id} className="block">
        {label}
      </label>
      <Controller
        name={id}
        control={control}
        render={({ field: { onChange, value } }) => (
          <ReactGoogleAutocomplete
            apiKey={process.env.GOOGLE_API_KEY}
            className={classes}
            onChange={onChange}
            options={{ types: ['geocode', 'establishment'] }}
            onPlaceSelected={(place) => setValue(id, place.formatted_address)}
            inputAutocompleteValue={value}
          />
        )}
      />
    </>
  );
};

export default LocationAutocomplete;
