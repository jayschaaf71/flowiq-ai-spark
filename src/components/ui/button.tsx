import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
}

export function Button({ className = '', variant = 'default', children, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded px-3 py-1.5 text-sm font-medium';
  const styles = variant === 'outline' ? 'border' : 'bg-blue-600 text-white';
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
