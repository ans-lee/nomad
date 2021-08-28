import classNames from 'classnames';
import React, { SelectHTMLAttributes } from 'react';
import { UseFormRegister } from 'react-hook-form';

interface SelectOptions {
  value: string;
  text: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  options: SelectOptions[];
  register: UseFormRegister<any>; // eslint-disable-line
}

const Select: React.FC<SelectProps> = ({ id, label, options, register, ...rest }) => {
  const classes: string = classNames(
    'w-full',
    'mt-2',
    'mb-4',
    'px-3.5',
    'py-2',
    'outline-none',
    'rounded-md',
    'border',
    'border-gray-300',
    'border-gray-300',
    'focus:ring-2',
    'focus:ring-blue-600'
  );

  return (
    <>
      <label htmlFor={id} className="block">
        {label}
      </label>
      <select {...register(id)} {...rest} className={classes}>
        {options.map((item, key) => (
          <option value={item.value} key={key}>
            {item.text}
          </option>
        ))}
      </select>
    </>
  );
};

export default Select;
