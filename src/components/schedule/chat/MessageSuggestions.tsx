
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface MessageSuggestionsProps {
  suggestions: string[];
  userRole: string;
  isTyping: boolean;
  onSuggestionClick: (suggestion: string) => void;
}

export const MessageSuggestions = ({ 
  suggestions, 
  userRole, 
  isTyping, 
  onSuggestionClick 
}: MessageSuggestionsProps) => {
  return (
    <div className="space-y-2 flex-shrink-0">
      <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
        <Zap className="h-3 w-3" />
        {userRole === 'patient' ? 'Quick auto-booking actions:' : 'Smart booking suggestions:'}
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="text-xs h-7 hover:bg-purple-50 hover:border-purple-200"
            onClick={() => onSuggestionClick(suggestion)}
            disabled={isTyping}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};
