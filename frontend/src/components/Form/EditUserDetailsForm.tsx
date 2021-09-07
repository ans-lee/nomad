import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Input from 'src/components/Form/Input';
import { useMutation } from 'react-query';
import { FetchError, updateUserDetails } from 'src/api';
import Alert from 'src/components/Alert';
import { UserDetails } from 'src/types/UserTypes';
import { useStore } from 'src/store';

type Inputs = {
  email: string;
  firstName: string;
  lastName: string;
};

const EditUserDetailsForm: React.FC = () => {
  const [errMsg, setErrMsg] = useState('');
  const { email, firstName, lastName } = useStore((state) => state.userDetails);
  const setUserDetails = useStore((state) => state.setUserDetails);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Inputs>({ defaultValues: { email: email, firstName: firstName, lastName: lastName } });
  const mutation = useMutation(
    ({ email, firstName, lastName }: Inputs) => updateUserDetails(email, firstName, lastName),
    {
      onSuccess: (data: UserDetails) => setUserDetails({ ...data }),
      onError: (err: FetchError) => {
        if (err.res.status === 401) {
          setErrMsg('You are not authorized to make an event');
        } else {
          setErrMsg('Something went wrong! Please try again');
        }
      },
    }
  );
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutation.reset();
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {mutation.isError && <Alert text={errMsg} />}

      <Input
        type="text"
        id="email"
        label="Email *"
        validation={{
          required: true,
          validate: (value: string) => value.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/) !== null,
        }}
        error={'email' in errors}
        register={register}
      />
      {errors.email?.type === 'required' && (
        <div className="text-sm text-red-500 -mt-2 mb-2">This field is required</div>
      )}
      {errors.email?.type === 'validate' && <div className="text-sm text-red-500 -mt-2 mb-2">Email is not valid</div>}

      <Input
        type="text"
        id="firstName"
        label="First Name *"
        validation={{ required: true, maxLength: 128 }}
        error={'firstName' in errors}
        register={register}
      />
      {errors.firstName && <div className="text-sm text-red-500 -mt-2 mb-2">This field is required</div>}
      {errors.firstName?.type === 'maxLength' && (
        <div className="text-sm text-red-500 -mt-2 mb-2">First name is too long</div>
      )}

      <Input
        type="text"
        id="lastName"
        label="Last Name *"
        validation={{ required: true, maxLength: 128 }}
        error={'lastName' in errors}
        register={register}
      />
      {errors.lastName && <div className="text-sm text-red-500 -mt-2 mb-2">This field is required</div>}
      {errors.lastName?.type === 'maxLength' && (
        <div className="text-sm text-red-500 -mt-2 mb-2">Last name is too long</div>
      )}

      <button type="submit" className="w-full bg-primary rounded-md text-white px-3.5 py-2 mt-4 disabled:opacity-50">
        Edit Details
      </button>
    </form>
  );
};

export default EditUserDetailsForm;
