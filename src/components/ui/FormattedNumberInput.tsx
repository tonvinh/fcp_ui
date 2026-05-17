import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface FormattedNumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value: number | string;
  onChange: (value: number) => void;
  min?: number;
}

export const FormattedNumberInput: React.FC<FormattedNumberInputProps> = ({ 
  value, 
  onChange, 
  className,
  min = 0,
  ...props 
}) => {
  const [displayValue, setDisplayValue] = useState<string>('');

  const formatNumber = (num: number | string) => {
    if (num === '' || num === undefined || num === null) return '';
    const numericValue = typeof num === 'string' ? num.replace(/[^0-9]/g, '') : num.toString();
    if (!numericValue) return '';
    return Number(numericValue).toLocaleString('en-US');
  };

  useEffect(() => {
    if (value === 0 && displayValue === '') {
       // Allow empty state if it's 0 to let user easily clear and type anew, unless explicitly formatted.
       // But to ensure consistency, we just format whatever value we receive.
       setDisplayValue(value === 0 ? '0' : formatNumber(value));
    } else {
       setDisplayValue(formatNumber(value));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericString = rawValue.replace(/[^0-9]/g, '');
    
    if (numericString === '') {
      setDisplayValue('');
      onChange(0); // Assuming 0 is the fallback for empty
      return;
    }

    let num = Number(numericString);
    if (min !== undefined && num < min) {
      num = min;
    }

    setDisplayValue(formatNumber(num));
    onChange(num);
  };

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      className={cn("text-right focus:outline-none", className)}
      {...props}
    />
  );
};
