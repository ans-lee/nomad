import React from 'react';
import { Link } from 'react-router-dom';
import SignUpForm from 'src/forms/SignUpForm';
import logoImg from 'src/assets/logo/logo.png';

const SignUpPage: React.FC = () => (
  <div className="h-screen w-screen m-auto flex flex-col items-center justify-center sm:w-96">
    <img className="w-40 h-auto mb-2" src={logoImg} />
    <div className="h-screen rounded-md border border-gray-300 p-4 bg-white sm:h-auto">
      <h1 className="text-4xl text-center mb-4">Sign Up</h1>
      <SignUpForm />
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

export default SignUpPage;
