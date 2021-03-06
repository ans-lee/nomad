import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from 'src/forms/LoginForm';
import logoImg from 'src/assets/logo/logo.png';

const LoginPage: React.FC = () => (
  <div className="h-screen w-screen m-auto flex flex-col items-center justify-center sm:w-96">
    <img className="w-40 h-auto mb-2" src={logoImg} />
    <div className="h-screen rounded-md border border-gray-300 p-4 bg-white sm:h-auto">
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
