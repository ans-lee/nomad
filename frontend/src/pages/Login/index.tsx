import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Field from 'src/components/Form/Field';

type Inputs = {
  email: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => alert(JSON.stringify(data));

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="rounded-md border border-black p-4 bg-gray-100">
        <h1 className="text-5xl text-center">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Field id="email" label="Email" {...register('email')} />
          <Field id="password" label="Password" {...register('password')} />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
