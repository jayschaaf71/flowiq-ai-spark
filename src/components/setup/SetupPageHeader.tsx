import { ReactNode } from "react";

interface SetupPageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export const SetupPageHeader = ({ title, subtitle, children }: SetupPageHeaderProps) => {
  return (
    <div className="p-6 border-b border-gray-200 bg-white/50 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        
        {children && (
          <div className="flex items-center gap-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};