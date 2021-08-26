import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { FetchError, userSignUp } from 'src/api';
import Alert from 'src/components/Alert';
import Input from 'src/components/Form/Input';

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUpForm: React.FC = () => {
  const [errMsg, setErrMsg] = useState('');
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<Inputs>();
  const password = watch('password');
  const mutation = useMutation(
    ({ email, password, firstName, lastName }: Inputs) => userSignUp(email, password, firstName, lastName),
    {
      onError: (err: FetchError) => {
        if (err.res.status === 409) {
          setErrMsg('A user with this email already exists');
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
        type="password"
        id="password"
        label="Password *"
        validation={{ required: true, minLength: 8, maxLength: 128 }}
        error={'password' in errors}
        register={register}
      />
      {errors.password?.type === 'required' && (
        <div className="text-sm text-red-500 -mt-2 mb-2">This field is required</div>
      )}
      {errors.password?.type === 'minLength' && (
        <div className="text-sm text-red-500 -mt-2 mb-2">Password must be 8 characters minimum</div>
      )}
      {errors.password?.type === 'maxLength' && (
        <div className="text-sm text-red-500 -mt-2 mb-2">Password is too long</div>
      )}

      <Input
        type="password"
        id="confirmPassword"
        label="Confirm Password *"
        validation={{
          required: true,
          validate: (value: string) => value === password,
        }}
        error={'confirmPassword' in errors}
        register={register}
      />
      {errors.confirmPassword?.type === 'required' && (
        <div className="text-sm text-red-500 -mt-2 mb-2">This field is required</div>
      )}
      {errors.confirmPassword?.type === 'validate' && (
        <div className="text-sm text-red-500 -mt-2 mb-2">Passwords do not match</div>
      )}

      <button
        type="submit"
        className="w-full bg-green-500 rounded-md border border-green-600 text-white px-3.5 py-2 mt-4 disabled:opacity-50"
        disabled={mutation.isLoading}
      >
        {mutation.isLoading ? 'Loading...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default SignUpForm;
