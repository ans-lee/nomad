import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Input from 'src/components/Form/Input';
import ToggleSwitch from './ToggleSwitch';

type Inputs = {
  title: string;
  location: string;
  online: boolean;
  description: string;
  category: string;
  start: string;
  end: string;
  reminder: string;
  repeat: string;
  visibility: string;
};

const CreateEventForm: React.FC = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<Inputs>({ defaultValues: { online: true } });
  const isOnline = watch('online');
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

      <Input
        type="text"
        id="location"
        label="Location"
        validation={{ maxLength: 128 }}
        error={'location' in errors}
        register={register}
      />
      {errors.location && <div className="text-sm text-red-500 -mt-2 mb-2">This field is required</div>}
      {errors.location?.type === 'maxLength' && (
        <div className="text-sm text-red-500 -mt-2 mb-2">Location is too long</div>
      )}

      <ToggleSwitch id="online" label="Online" enabled={isOnline} register={register} />

      <Input
        type="text"
        id="description"
        label="Description"
        validation={{ maxLength: 512 }}
        error={'description' in errors}
        register={register}
      />
      {errors.description?.type === 'required' && (
        <div className="text-sm text-red-500 -mt-2 mb-2">This field is required</div>
      )}
      {errors.description?.type === 'maxLength' && (
        <div className="text-sm text-red-500 -mt-2 mb-2">Description is too long</div>
      )}

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
