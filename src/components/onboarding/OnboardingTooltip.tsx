
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, Info, Lightbulb } from 'lucide-react';

interface OnboardingTooltipProps {
  content: string;
  type?: 'info' | 'help' | 'tip';
  children?: React.ReactNode;
}

export const OnboardingTooltip: React.FC<OnboardingTooltipProps> = ({
  content,
  type = 'info',
  children
}) => {
  const getIcon = () => {
    switch (type) {
      case 'help':
        return <HelpCircle className="w-4 h-4 text-blue-500 hover:text-blue-600 transition-colors" />;
      case 'tip':
        return <Lightbulb className="w-4 h-4 text-yellow-500 hover:text-yellow-600 transition-colors" />;
      default:
        return <Info className="w-4 h-4 text-gray-500 hover:text-gray-600 transition-colors" />;
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children || (
            <button type="button" className="inline-flex items-center">
              {getIcon()}
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-3 text-sm">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
