import React from 'react';

interface NeumorphicCardProps {
  children: React.ReactNode;
  className?: string;
}

export const NeumorphicCard: React.FC<NeumorphicCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-cafe-surface rounded-cafe shadow-neu-flat p-8 ${className}`}>
      {children}
    </div>
  );
};
