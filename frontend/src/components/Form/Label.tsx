import React, { LabelHTMLAttributes } from 'react';

interface InputProps extends LabelHTMLAttributes<HTMLLabelElement> {
  id: string;
  text: string;
  required?: boolean;
}

const Label: React.FC<InputProps> = ({ id, text, required, ...rest }) => (
  <label htmlFor={id} {...rest} className="block">
    {text}
    {required && <span className="text-red-600"> *</span>}
  </label>
);

export default Label;
