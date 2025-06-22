
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Send, Clock, Info } from 'lucide-react';

interface MessageStats {
  characterCount: number;
  segmentCount: number;
  estimatedCost: number;
}

interface SMSMessagePreviewProps {
  preview: string;
  stats: MessageStats;
  onSendTest: () => void;
  sending: boolean;
  canSend: boolean;
}

export const SMSMessagePreview: React.FC<SMSMessagePreviewProps> = ({
  preview,
  stats,
  onSendTest,
  sending,
  canSend
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <div className="flex gap-4">
          <span className={stats.characterCount > 160 ? "text-orange-600" : "text-gray-600"}>
            {stats.characterCount} characters
          </span>
          <span className="text-gray-600">
            {stats.segmentCount} segments
          </span>
        </div>
        <span className="text-gray-600">
          Est. cost: ${stats.estimatedCost.toFixed(4)}
        </span>
      </div>

      {stats.characterCount > 160 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Message exceeds 160 characters and will be sent as {stats.segmentCount} segments.
          </AlertDescription>
        </Alert>
      )}

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium">Message Preview</h4>
          <Button 
            onClick={onSendTest}
            disabled={sending || !canSend}
            className="flex items-center gap-2"
          >
            {sending ? (
              <Clock className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {sending ? 'Sending...' : 'Send Test'}
          </Button>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border">
          <p className="text-sm whitespace-pre-wrap">
            {preview || 'Enter a message to see preview...'}
          </p>
        </div>
      </div>
    </div>
  );
};
