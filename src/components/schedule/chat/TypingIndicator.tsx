
import { Brain, Loader2 } from "lucide-react";

interface TypingIndicatorProps {
  userRole: string;
}

export const TypingIndicator = ({ userRole }: TypingIndicatorProps) => {
  return (
    <div className="flex gap-3 justify-start">
      <div className="flex gap-2">
        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
          <Brain className="w-4 h-4" />
        </div>
        <div className="bg-gray-100 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm text-gray-600">
              {userRole === 'patient' ? 'Finding appointment and preparing auto-booking...' : 'Analyzing schedule and preparing appointment creation...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
