import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Input from 'src/components/Form/Input';

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUpPage: React.FC = () => {
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => alert(JSON.stringify(data));

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="rounded-md border border-gray-300 p-4 bg-gray-100">
        <h1 className="text-4xl text-center mb-4">Sign Up</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input type="text" id="firstName" label="First Name" register={register} />
          <Input type="text" id="lastName" label="Last Name" register={register} />
          <Input type="text" id="email" label="Email" register={register} />
          <Input type="password" id="password" label="Password" register={register} />
          <Input type="password" id="confirmPassword" label="Confirm Password" register={register} />
          <button
            type="submit"
            className="w-full bg-green-500 rounded-md border border-green-600 text-white px-3.5 py-2 mt-4"
          >
            Sign Up
          </button>
        </form>
        <hr className="my-6" />
        <div className="text-center text-sm">
          {`Already have an account? `}
          <Link className="text-blue-600" to="/login">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
