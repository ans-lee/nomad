import classNames from 'classnames';
import React from 'react';
import ReactDatePicker from 'react-datepicker';
import { Control, Controller } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps {
  id: string;
  validation?: Record<string, unknown>;
  error?: boolean;
  control: Control<any>; // eslint-disable-line
}

const DatePicker: React.FC<DatePickerProps> = ({ id, validation, error, control }) => {
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
    <Controller
      name={id}
      control={control}
      rules={validation}
      render={({ field: { onChange, value } }) => (
        <ReactDatePicker
          selected={value}
          onChange={onChange}
          showTimeSelect={true}
          dateFormat="Pp"
          timeIntervals={5}
          showTimeInput={true}
          minDate={new Date()}
          placeholderText="Pick a time..."
          showPopperArrow={false}
          isClearable={true}
          className={classes}
        />
      )}
    />
  );
};

export default DatePicker;
