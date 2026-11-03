import React from 'react';

interface AppCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-[#172033] rounded-[22px] border border-[#DCE3EF] dark:border-slate-800 p-5 shadow-sm transition-all duration-200 ${
        hoverable ? 'hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900 cursor-pointer active:scale-[0.99]' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
