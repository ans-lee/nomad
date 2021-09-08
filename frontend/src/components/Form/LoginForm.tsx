import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { FetchError, userLogin } from 'src/api';
import { LOGIN_TOKEN_NAME } from 'src/constants/AuthConstants';
import Alert from 'src/components/Alert';
import Input from 'src/components/Form/Input';
import { Redirect } from 'react-router-dom';

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
    onSuccess: (data) => {
      window.localStorage.setItem(LOGIN_TOKEN_NAME, data.token);
    },
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

  if (mutation.isSuccess) {
    return <Redirect to="/" />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {mutation.isError && <Alert text={errMsg} />}

      <Input
        type="text"
        id="email"
        placeholder="Email"
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
        placeholder="Password"
        validation={{ required: true }}
        error={'password' in errors}
        register={register}
      />
      {errors.password?.type === 'required' && (
        <div className="text-sm text-red-500 -mt-2 mb-2">This field is required</div>
      )}

      <button
        type="submit"
        className="w-full bg-primary rounded-md text-white px-3.5 py-2 mt-4 disabled:opacity-50"
        disabled={mutation.isLoading}
      >
        {mutation.isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
