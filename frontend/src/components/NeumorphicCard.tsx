import React from 'react';

interface NeumorphicCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const NeumorphicCard: React.FC<NeumorphicCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div onClick={onClick} className={`bg-cafe-surface rounded-cafe shadow-neu-flat p-8 ${className}`}>
      {children}
    </div>
  );
};
