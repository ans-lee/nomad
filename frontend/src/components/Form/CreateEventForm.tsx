import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import LocationAutocomplete from 'src/components/Form/LocationAutocomplete';
import DatePicker from 'src/components/Form/DatePicker';
import Input from 'src/components/Form/Input';
import { OPTIONS } from 'src/constants/EventConstants';
import Select from './Select';
import TextArea from './TextArea';
import ToggleSwitch from './ToggleSwitch';

type Inputs = {
  title: string;
  location: string;
  online: boolean;
  description: string;
  category: string;
  start: Date;
  end: Date;
  isPrivate: boolean;
};

// TODO validate that start date is today onwards and that
// end date is not before start
// TODO google places autocomplete for location
// TODO remove repeat
const CreateEventForm: React.FC = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    watch,
    setValue,
  } = useForm<Inputs>({ defaultValues: { online: true } });
  const isOnline = watch('online');
  const startTime = watch('start');
  const isPrivate = watch('isPrivate');
  const onSubmit: SubmitHandler<Inputs> = (data) => alert(JSON.stringify(data));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        type="text"
        id="title"
        label="Title *"
        validation={{ required: true, maxLength: 128 }}
        error={'title' in errors}
        register={register}
      />
      {errors.title && <div className="text-sm text-red-500 -mt-2 mb-2">This field is required</div>}
      {errors.title?.type === 'maxLength' && <div className="text-sm text-red-500 -mt-2 mb-2">Title is too long</div>}

      <LocationAutocomplete id="location" label="Location" control={control} setValue={setValue} />

      <ToggleSwitch id="online" label="Online" enabled={isOnline} register={register} />

      <TextArea
        id="description"
        label="Description"
        validation={{ maxLength: 512 }}
        error={'description' in errors}
        register={register}
      />
      {errors.description?.type === 'maxLength' && (
        <div className="text-sm text-red-500 -mt-2 mb-2">Description is too long</div>
      )}

      <Select id="category" label="Category" register={register} options={OPTIONS} />

      <DatePicker
        id="start"
        label="Start Time *"
        validation={{ required: true }}
        error={'start' in errors}
        control={control}
      />
      {errors.start && <div className="text-sm text-red-500 -mt-2 mb-2">You must pick a start time</div>}

      <DatePicker
        id="end"
        label="End Time *"
        validation={{
          required: true,
          validate: (value: Date) => value.getTime() >= startTime.getTime(),
        }}
        error={'end' in errors}
        control={control}
      />
      {errors.end?.type === 'required' && (
        <div className="text-sm text-red-500 -mt-2 mb-2">You must pick an end time</div>
      )}
      {errors.end?.type === 'validate' && (
        <div className="text-sm text-red-500 -mt-2 mb-2">End time must be the same or after the start time</div>
      )}

      <ToggleSwitch id="isPrivate" label="Private" enabled={isPrivate} register={register} />

      <button
        type="submit"
        className="w-full bg-green-500 rounded-md border border-green-600 text-white px-3.5 py-2 mt-4 disabled:opacity-50"
      >
        Create Event
      </button>
    </form>
  );
};

export default CreateEventForm;
