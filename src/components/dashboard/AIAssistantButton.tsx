
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { AIAssistant } from "@/components/AIAssistant";

export const AIAssistantButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-200"
        size="icon"
      >
        <MessageSquare className="h-5 w-5" />
      </Button>

      <AIAssistant isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};
