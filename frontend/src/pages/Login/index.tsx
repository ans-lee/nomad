import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Input from 'src/components/Form/Input';

type Inputs = {
  email: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => alert(JSON.stringify(data));

  return (
    <div className="h-screen w-80 m-auto flex flex-col justify-center">
      <div className="rounded-md border border-gray-300 p-4 bg-gray-100">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input type="text" id="email" label="Email" register={register} />
          <Input type="password" id="password" label="Password" register={register} />
          <button
            type="submit"
            className="w-full bg-green-500 rounded-md border border-green-600 text-white px-3.5 py-2 mt-4"
          >
            Login
          </button>
        </form>
        <hr className="my-6" />
        <div className="text-center text-sm">
          {`Don't have an account? `}
          <Link className="text-blue-600" to="/signup">
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
