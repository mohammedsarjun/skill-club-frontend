import React from 'react';

type PageLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
};

type PageHeaderProps = {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
};

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  children,
  className = '',
  action,
}) => {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {title && (
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-gray-600 text-lg">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  );
};

type PageContentProps = {
  children: React.ReactNode;
  className?: string;
};

export const PageContent: React.FC<PageContentProps> = ({
  children,
  className = '',
}) => {
  return <div className={`space-y-6 ${className}`}>{children}</div>;
};
