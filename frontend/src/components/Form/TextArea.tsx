import classNames from 'classnames';
import React, { TextareaHTMLAttributes } from 'react';
import { UseFormRegister } from 'react-hook-form';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  validation?: Record<string, unknown>;
  error?: boolean;
  register: UseFormRegister<any>; // eslint-disable-line
}

const TextArea: React.FC<TextAreaProps> = ({ id, validation, error, register, ...rest }) => {
  const classes: string = classNames(
    'w-full',
    'mt-2',
    'mb-4',
    'px-3.5',
    'py-2',
    'outline-none',
    'rounded-md',
    'border',
    error ? 'border-red-600' : 'border-gray-300',
    'focus:ring-2',
    'focus:ring-blue-600'
  );

  return <textarea {...register(id, validation)} {...rest} className={classes} />;
};

export default TextArea;
