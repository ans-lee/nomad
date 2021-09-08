import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import DatePicker from 'src/components/Form/DatePicker';
import Input from 'src/components/Form/Input';
import { CATEGORY_OPTIONS } from 'src/constants/EventConstants';
import { editEvent, FetchError, getEvent } from 'src/api';
import Alert from 'src/components/Alert';
import LocationAutocomplete from './LocationAutocomplete';
import Select from './Select';
import TextArea from './TextArea';
import ToggleSwitch from './ToggleSwitch';
import { useHistory, useParams } from 'react-router-dom';
import { EventData, EventFormInputs } from 'src/types/EventTypes';
import Label from './Label';

interface PageParams {
  id: string;
}

const EditEventForm: React.FC = () => {
  const [errMsg, setErrMsg] = useState('');
  const [defaultLocation, setDefaultLocation] = useState({ value: '', label: '' });
  const history = useHistory();
  const { id } = useParams<PageParams>();

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    watch,
    setValue,
  } = useForm<EventFormInputs>();
  const isOnline = watch('online');
  const startTime = watch('start');
  const isPrivate = watch('isPrivate');

  const { isLoading } = useQuery(['viewEvent'], () => getEvent(id), {
    onSuccess: (data: EventData) => {
      setValue('title', data.title);
      setValue('location', { value: data.location, label: data.location });
      setDefaultLocation({ value: data.location, label: data.location });
      setValue('online', data.online);
      setValue('description', data.description);
      setValue('category', data.category);
      setValue('start', new Date(data.start));
      setValue('end', new Date(data.end));
      setValue('isPrivate', data.visibility === 'private');
    },
    refetchOnWindowFocus: false,
    retry: false,
  });

  const mutation = useMutation(
    ({ title, location, online, description, category, start, end, isPrivate }: EventFormInputs) =>
      editEvent(id, title, location.value, online, description, category, start, end, isPrivate),
    {
      onSuccess: () => history.push(`/event/${id}`),
      onError: (err: FetchError) => {
        if (err.res.status === 401) {
          setErrMsg('You are not authorized to make an event');
        } else {
          setErrMsg('Something went wrong! Please try again');
        }
      },
    }
  );

  const onSubmit: SubmitHandler<EventFormInputs> = (data) => {
    mutation.reset();
    mutation.mutate(data);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {mutation.isError && <Alert text={errMsg} />}

      <Input
        type="text"
        id="title"
        validation={{ required: true, maxLength: 128 }}
        error={'title' in errors}
        register={register}
      />
      {errors.title && <div className="text-sm text-red-500 -mt-2 mb-2">This field is required</div>}
      {errors.title?.type === 'maxLength' && <div className="text-sm text-red-500 -mt-2 mb-2">Title is too long</div>}

      <Label id="location" text="Location" />
      <LocationAutocomplete id="location" defaultValue={defaultLocation} control={control} />

      <ToggleSwitch id="online" label="Online" enabled={isOnline} register={register} />

      <TextArea
        id="description"
        label="Description"
        validation={{ maxLength: 20000 }}
        error={'description' in errors}
        register={register}
      />
      {errors.description?.type === 'maxLength' && (
        <div className="text-sm text-red-500 -mt-2 mb-2">Description is too long</div>
      )}

      <Label id="category" text="Category" />
      <Select id="category" register={register} options={CATEGORY_OPTIONS} />

      <Label id="start" text="Start Time" required={true} />
      <DatePicker id="start" validation={{ required: true }} error={'start' in errors} control={control} />
      {errors.start && <div className="text-sm text-red-500 -mt-2 mb-2">You must pick a start time</div>}

      <Label id="end" text="End Time" required={true} />
      <DatePicker
        id="end"
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

      <button type="submit" className="w-full bg-primary rounded-md text-white px-3.5 py-2 mt-4 disabled:opacity-50">
        Edit Event
      </button>
    </form>
  );
};

export default EditEventForm;
