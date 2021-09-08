import classNames from 'classnames';
import React, { InputHTMLAttributes } from 'react';
import { UseFormRegister } from 'react-hook-form';

interface ToggleSwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  enabled: boolean;
  register: UseFormRegister<any>; // eslint-disable-line
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, enabled, register, ...rest }) => {
  const backgroundClasses = classNames(
    'h-8',
    'w-14',
    'mt-2',
    'mb-4',
    'rounded-2xl',
    'relative',
    enabled ? 'bg-primary' : 'bg-gray-600',
    'transition-colors',
    'duration-200'
  );
  const handleClasses = classNames(
    'h-7',
    'w-7',
    'm-0.5',
    'bg-white',
    'rounded-2xl',
    'absolute',
    'inline-block',
    'transform',
    enabled ? 'translate-x-6' : '',
    'transition-transform',
    'duration-200'
  );

  return (
    <div className={backgroundClasses}>
      <div className={handleClasses} />
      <input type="checkbox" {...register(id)} {...rest} className="opacity-0 h-full w-full" />
    </div>
  );
};

export default ToggleSwitch;
