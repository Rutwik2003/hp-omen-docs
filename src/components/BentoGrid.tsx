import React from 'react';
import { Link } from 'react-router-dom';

interface BentoGridProps {
  className?: string;
  children?: React.ReactNode;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ className = "", children }) => {
  return (
    <div
      className={`grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ${className}`}
    >
      {children}
    </div>
  );
};

interface BentoGridItemProps {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  href?: string;
}

export const BentoGridItem: React.FC<BentoGridItemProps> = ({
  className = "",
  title,
  description,
  header,
  icon,
  href,
}) => {
  const Content = () => (
    <>
      {header}
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        {icon}
        <div className="font-sans font-bold text-neutral-200 mb-2 mt-2">
          {title}
        </div>
        <div className="font-sans font-normal text-neutral-400 text-xs">
          {description}
        </div>
      </div>
    </>
  );

  // Fixed container classes:
  // - Removed `bg-white` and `bg-black/50` conflict.
  // - Added `bg-neutral-900/50` for dark glass effect.
  // - Kept border.
  const containerClasses = `row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 bg-neutral-900/50 border border-white/10 justify-between flex flex-col space-y-4 ${className}`;

  if (href) {
    return (
      <Link to={href} className={containerClasses}>
        <Content />
      </Link>
    );
  }

  return (
    <div className={containerClasses}>
      <Content />
    </div>
  );
};
