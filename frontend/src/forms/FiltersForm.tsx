import { Coords } from 'google-map-react';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { getLocation } from 'src/api';
import { CATEGORY_OPTIONS } from 'src/constants/EventConstants';
import { useStore } from 'src/store';
import LocationAutocomplete from 'src/components/Form/LocationAutocomplete';
import Input from 'src/components/Form/Input';
import Select from 'src/components/Form/Select';
import ToggleSwitch from 'src/components/Form/ToggleSwitch';
import Label from 'src/components/Form/Label';

type Inputs = {
  location: { value: string; label: string };
  title: string;
  category: string;
  hideOnline: boolean;
  hideNoLocation: boolean;
};

const FiltersForm: React.FC<{ hideLocation?: boolean }> = ({ hideLocation }) => {
  const filters = useStore((state) => state.eventFilters);
  const setFilters = useStore((state) => state.setEventFilters);
  const setCenter = useStore((state) => state.setMapCenter);

  const { handleSubmit, watch, register, control } = useForm<Inputs>({
    defaultValues: {
      location: { value: '', label: '' },
      title: filters.title,
      category: filters.category,
      hideOnline: filters.hideOnline,
      hideNoLocation: filters.hideNoLocation,
    },
  });
  const watchLocation = watch('location');
  const watchHideOnline = watch('hideOnline');
  const watchHideNoLocation = watch('hideNoLocation');

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const { location, title, category, hideOnline, hideNoLocation } = data;
    if (location.value) {
      locationQuery.refetch();
    }

    setFilters({
      title: title,
      category: category,
      hideOnline: hideOnline,
      hideNoLocation: hideNoLocation,
    });
  };

  const locationQuery = useQuery('location', () => getLocation(watchLocation.value), {
    onSuccess: (data: Coords) => setCenter(data),
    enabled: false,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {!hideLocation && (
        <>
          <Label id="location" text="Location" />
          <LocationAutocomplete id="location" control={control} />
        </>
      )}

      <Label id="title" text="Title" />
      <Input type="text" id="title" register={register} />

      <Label id="category" text="Category" />
      <Select id="category" register={register} options={CATEGORY_OPTIONS} />

      <Label id="hideOnline" text="Hide online events" />
      <ToggleSwitch id="hideOnline" enabled={watchHideOnline} register={register} />

      <Label id="hideNoLocation" text="Hide events with no location" />
      <ToggleSwitch id="hideNoLocation" enabled={watchHideNoLocation} register={register} />

      <button type="submit" className="w-full bg-primary rounded-md text-white px-3.5 py-2 my-4 disabled:opacity-50">
        Search
      </button>
    </form>
  );
};

export default FiltersForm;
