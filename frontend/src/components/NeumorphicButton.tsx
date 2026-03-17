import React from 'react';

interface NeumorphicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'flat' | 'pressed';
}

export const NeumorphicButton: React.FC<NeumorphicButtonProps> = ({ 
  children, 
  variant = 'flat', 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'px-6 py-2 rounded-cafe transition-all duration-300 font-semibold text-deep-green bg-cafe-surface';
  const shadowStyles = variant === 'flat' 
    ? 'shadow-neu-flat active:shadow-neu-pressed hover:brightness-105 active:scale-95' 
    : 'shadow-neu-pressed';

  return (
    <button 
      className={`${baseStyles} ${shadowStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
