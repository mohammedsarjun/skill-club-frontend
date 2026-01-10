import * as React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export type InputProps = {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
  rounded?: boolean;
  className?: string;
  error?: string | number;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
  hidden?: boolean;
  disabled?: boolean;
  label?: string;
};

export type CheckboxProps = {
  label?: React.ReactNode;
  checked?: boolean | any;
  onChange?: (checked: any) => void;
  id?: string;
  className?: string;
  error?: string | boolean;
  name: string;
  sizeClass?: string;
};

export type CardProps = {
  title: string;
  content?: string;
  imageSrc?: string;
  footer?: React.ReactNode;
  className?: string;
};
