
import { User, Brain, TrendingUp } from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  contextUsed?: any;
}

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  return (
    <div className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          message.type === 'user' 
            ? 'bg-blue-600 text-white' 
            : 'bg-purple-100 text-purple-600'
        }`}>
          {message.type === 'user' ? <User className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
        </div>
        
        <div className={`p-3 rounded-lg ${
          message.type === 'user' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          
          {message.type === 'ai' && message.contextUsed && (
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
              <TrendingUp className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-500">
                Auto-booking enabled: {message.contextUsed.todaysAppointments} appointments, {message.contextUsed.availableSlots} slots available
                {message.contextUsed.nextAvailableSlots && message.contextUsed.nextAvailableSlots.length > 0 && (
                  `, ${message.contextUsed.nextAvailableSlots.length} providers ready for instant booking`
                )}
              </span>
            </div>
          )}
          
          <p className={`text-xs mt-1 ${
            message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  );
};
