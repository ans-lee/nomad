import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Input from 'src/components/Form/Input';

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
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input type="text" id="email" label="Email" register={register} />
          <Input type="password" id="password" label="Password" register={register} />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
