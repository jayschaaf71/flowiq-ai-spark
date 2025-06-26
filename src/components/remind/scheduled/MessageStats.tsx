
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Send, MessageSquare } from "lucide-react";

interface MessageStatsProps {
  upcomingCount: number;
  sentToday: number;
  totalMessages: number;
}

export const MessageStats: React.FC<MessageStatsProps> = ({
  upcomingCount,
  sentToday,
  totalMessages
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Upcoming</p>
              <p className="text-2xl font-bold text-blue-600">{upcomingCount}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Sent Today</p>
              <p className="text-2xl font-bold text-green-600">{sentToday}</p>
            </div>
            <Send className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Messages</p>
              <p className="text-2xl font-bold text-purple-600">{totalMessages}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
