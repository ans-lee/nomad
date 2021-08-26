import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { Link } from 'react-router-dom';
import { userSignUp } from 'src/api';
import Input from 'src/components/Form/Input';

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUpPage: React.FC = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<Inputs>();
  const password = watch('password');
  const mutation = useMutation((data: Inputs) => userSignUp(data.email, data.password, data.firstName, data.lastName));
  const onSubmit: SubmitHandler<Inputs> = (data) => mutation.mutate(data);

  const Form: React.FC = () => (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input type="text" id="firstName" label="First Name *" validation={{ required: true }} register={register} />
      {errors.firstName && <div className="text-sm text-red-500 -mt-2 mb-2">This field is required</div>}

      <Input type="text" id="lastName" label="Last Name *" validation={{ required: true }} register={register} />
      {errors.lastName && <div className="text-sm text-red-500 -mt-2 mb-2">This field is required</div>}

      <Input
        type="text"
        id="email"
        label="Email *"
        validation={{
          required: true,
          validate: (value: string) => value.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/) !== null,
        }}
        register={register}
      />
      {errors.email?.type === 'required' && <div className="text-sm text-red-500 -mt-2 mb-2">This field is required</div>}
      {errors.email?.type === 'validate' && <div className="text-sm text-red-500 -mt-2 mb-2">Email is not valid</div>}

      <Input type="password" id="password" label="Password *" validation={{ required: true }} register={register} />
      {errors.password && <div className="text-sm text-red-500 -mt-2 mb-2">This field is required</div>}

      <Input
        type="password"
        id="confirmPassword"
        label="Confirm Password *"
        validation={{
          required: true,
          validate: (value: string) => value === password,
        }}
        register={register}
      />
      {errors.confirmPassword?.type === 'required' && <div className="text-sm text-red-500 -mt-2 mb-2">This field is required</div>}
      {errors.confirmPassword?.type === 'validate' && <div className="text-sm text-red-500 -mt-2 mb-2">Passwords do not match</div>}

      <button
        type="submit"
        className="w-full bg-green-500 rounded-md border border-green-600 text-white px-3.5 py-2 mt-4 disabled:opacity-50"
        disabled={mutation.isLoading}
      >
        {mutation.isLoading ? 'Loading...' : 'Sign Up'}
      </button>
    </form>
  );

  return (
    <div className="h-screen w-screen m-auto flex flex-col justify-center sm:w-96">
      <div className="h-screen rounded-md border border-gray-300 p-4 bg-gray-100 sm:h-auto">
        <h1 className="text-4xl text-center mb-4">Sign Up</h1>
        <Form />
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
