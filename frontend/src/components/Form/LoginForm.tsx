import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { FetchError, userLogin } from 'src/api';
import Alert from 'src/components/Alert';
import Input from 'src/components/Form/Input';

type Inputs = {
  email: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const [errMsg, setErrMsg] = useState('');
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Inputs>();
  const mutation = useMutation(({ email, password }: Inputs) => userLogin(email, password), {
    // Need to add the token to the cookies or session
    onError: (err: FetchError) => {
      if (err.res.status === 400) {
        setErrMsg('Incorrect password or email');
      } else {
        setErrMsg('Something went wrong! Please try again');
      }
    },
  });
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
        label="Email"
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
        label="Password"
        validation={{ required: true }}
        error={'password' in errors}
        register={register}
      />
      {errors.password?.type === 'required' && (
        <div className="text-sm text-red-500 -mt-2 mb-2">This field is required</div>
      )}

      <button
        type="submit"
        className="w-full bg-green-500 rounded-md border border-green-600 text-white px-3.5 py-2 mt-4 disabled:opacity-50"
        disabled={mutation.isLoading}
      >
        {mutation.isLoading ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
