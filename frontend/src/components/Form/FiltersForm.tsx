import { Coords } from 'google-map-react';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { getLocation } from 'src/api';
import Input from 'src/components/Form/Input';
import Select from 'src/components/Form/Select';
import LocationAutocomplete from 'src/components/Form/LocationAutocomplete';
import { OPTIONS } from 'src/constants/EventConstants';
import { useStore } from 'src/store';

type Inputs = {
  location: { value: string; label: string };
  title: string;
  category: string;
};

const FiltersForm: React.FC = () => {
  const filters = useStore((state) => state.eventFilters);
  const setFilters = useStore((state) => state.setEventFilters);
  const setCenter = useStore((state) => state.setMapCenter);

  const { handleSubmit, watch, register, control } = useForm<Inputs>({
    defaultValues: { location: { value: '', label: '' }, title: filters.title, category: filters.category },
  });
  const watchLocation = watch('location');

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const { location, title, category } = data;
    if (location.value) {
      locationQuery.refetch();
    }

    setFilters({ title: title, category: category });
  };

  const locationQuery = useQuery('location', () => getLocation(watchLocation.value), {
    onSuccess: (data: Coords) => setCenter(data),
    enabled: false,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <LocationAutocomplete id="location" label="Location" control={control} />
      <Input type="text" id="title" label="Title" register={register} />
      <Select id="category" label="Category" register={register} options={OPTIONS} />
      <button
        type="submit"
        className="w-full bg-green-500 rounded-md border border-green-600 text-white px-3.5 py-2 mt-4 disabled:opacity-50"
      >
        Search
      </button>
    </form>
  );
};

export default FiltersForm;
