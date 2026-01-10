import React, { useState } from "react";
import { InputProps } from '@/types/interfaces/ui';
import { Eye, EyeOff } from 'lucide-react';

export default function Input({
  type = "text",
  placeholder = "",
  value,
  onChange,
  fullWidth = true,
  className = "",
  error = "",
  onBlur,
  name = "",
  hidden,
  disabled = false,
  label = "",
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === "password";

  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="label-base">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <input
          type={isPasswordType && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          name={name}
          disabled={disabled}
          hidden={hidden}
          className={`
            input-base
            ${isPasswordType ? "pr-10" : ""}
            ${error ? "border-red-600 focus:ring-red-600" : ""}
            ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
            ${className}
          `}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        )}
      </div>
      {error && (
        <span className="text-red-600 text-sm mt-1.5 font-medium">
          {error}
        </span>
      )}
    </div>
  );
}
