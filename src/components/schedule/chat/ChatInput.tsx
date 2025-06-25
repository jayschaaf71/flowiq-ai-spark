
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  userRole: string;
  isTyping: boolean;
  onSendMessage: (message: string) => Promise<void>;
}

export const ChatInput = ({ userRole, isTyping, onSendMessage }: ChatInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async () => {
    if (!inputValue.trim() || isTyping) return;
    await onSendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isTyping) {
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2 flex-shrink-0">
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={userRole === 'patient' ? "Ask to book appointments automatically..." : "Request automatic appointment creation..."}
        onKeyPress={handleKeyPress}
        disabled={isTyping}
        className="flex-1"
      />
      <Button 
        onClick={handleSubmit} 
        disabled={isTyping || !inputValue.trim()}
        className="bg-purple-600 hover:bg-purple-700"
      >
        {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
      </Button>
    </div>
  );
};
