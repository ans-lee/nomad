import React, { InputHTMLAttributes } from 'react';
import { UseFormRegister } from 'react-hook-form';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  required?: boolean;
  register: UseFormRegister<any>; // eslint-disable-line
}

const Input: React.FC<InputProps> = ({ id, label, required, register, ...rest }) => (
  <>
    <label htmlFor={id} className="block">
      {label}
    </label>
    <input
      {...register(id, { required })}
      {...rest}
      className="w-full mt-2 mb-4 px-3.5 py-1 outline-none rounded-md border border-black"
    />
  </>
);

export default Input;
