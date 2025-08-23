'use client';

import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus-ring rounded-lg hover:scale-105 active:scale-95';
  
  const variantClasses = {
    primary: 'bg-accent text-white hover:bg-accent-hover disabled:bg-accent/50',
    secondary: 'bg-surface-elevated text-foreground hover:bg-border border border-border',
    ghost: 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated',
    danger: 'bg-error text-white hover:bg-error/90 disabled:bg-error/50',
  };

  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-6 text-base',
    lg: 'h-13 px-8 text-lg',
  };

  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabled && 'opacity-50 cursor-not-allowed hover:scale-100 active:scale-100',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}