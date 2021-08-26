import classNames from 'classnames';
import React, { InputHTMLAttributes } from 'react';
import { UseFormRegister } from 'react-hook-form';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  validation?: Record<string, unknown>;
  error?: boolean;
  register: UseFormRegister<any>; // eslint-disable-line
}

const Input: React.FC<InputProps> = ({ id, label, validation, error, register, ...rest }) => {
  const classes: string = classNames(
    'w-full',
    'mt-2',
    'mb-4',
    'px-3.5',
    'py-1',
    'outline-none',
    'rounded-md',
    'border',
    'border-gray-300',
    error ? 'border-red-600' : 'border-gray-300',
    'focus:ring-2',
    'focus:ring-blue-600'
  );

  return (
    <>
      <label htmlFor={id} className="block">
        {label}
      </label>
      <input
        {...register(id, validation)}
        {...rest}
        className={classes}
      />
    </>
  );
};

export default Input;
