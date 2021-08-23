import React, { InputHTMLAttributes } from 'react';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

const Field: React.FC<FieldProps> = ({ id, label, ...rest }) => (
  <>
    <label htmlFor={id}>{label}</label>
    <input
      name={id}
      type="text"
      {...rest}
      className="w-full mt-2 mb-4 px-3.5 py-1 outline-none rounded-md border border-black"
    />
  </>
);

export default Field;
