import React from 'react';

type FormProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  className?: string;
};

export const Form: React.FC<FormProps> = ({
  onSubmit,
  children,
  className = '',
}) => {
  return (
    <form onSubmit={onSubmit} className={`space-y-6 ${className}`}>
      {children}
    </form>
  );
};

type FormGroupProps = {
  children: React.ReactNode;
  className?: string;
};

export const FormGroup: React.FC<FormGroupProps> = ({
  children,
  className = '',
}) => {
  return <div className={`space-y-2 ${className}`}>{children}</div>;
};

type FormLabelProps = {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
};

export const FormLabel: React.FC<FormLabelProps> = ({
  htmlFor,
  children,
  required = false,
  className = '',
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-semibold text-gray-900 ${className}`}
    >
      {children}
      {required && <span className="text-red-600 ml-1">*</span>}
    </label>
  );
};

type FormFieldProps = {
  children: React.ReactNode;
  error?: string;
  helperText?: string;
  className?: string;
};

export const FormField: React.FC<FormFieldProps> = ({
  children,
  error,
  helperText,
  className = '',
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {children}
      {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
      {helperText && <p className="text-gray-600 text-sm">{helperText}</p>}
    </div>
  );
};

type FormRowProps = {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
};

export const FormRow: React.FC<FormRowProps> = ({
  children,
  columns = 2,
  gap = 'md',
  className = '',
}) => {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-6',
    lg: 'gap-8',
  };

  return (
    <div
      className={`grid ${colClasses[columns]} ${gapClasses[gap]} ${className}`}
    >
      {children}
    </div>
  );
};
