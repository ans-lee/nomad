import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from 'src/components/Form/LoginForm';

const LoginPage: React.FC = () => (
  <div className="h-screen w-screen m-auto flex flex-col justify-center sm:w-96">
    <div className="h-screen rounded-md border border-gray-300 p-4 bg-gray-100 sm:h-auto">
      <h1 className="text-4xl text-center mb-4">Login</h1>
      <LoginForm />
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

export default LoginPage;
