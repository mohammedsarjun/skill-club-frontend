import React from "react";
import { CheckboxProps } from '@/types/interfaces/ui';

export default function Checkbox({
  label = "",
  onChange,
  id,
  className = "",
  error,
  name,
  checked=false,
  sizeClass=""
}: CheckboxProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={id}
          onChange={(e) => onChange && onChange(e.target.checked)}
          name={name}
          className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-400 ${sizeClass}`}
          checked={checked}
        />
        {label && (
          <label htmlFor={id} className="ml-2 text-gray-700 select-none">
            {label}
          </label>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
