
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { MessageFilters } from "./scheduled/MessageFilters";
import { MessageStats } from "./scheduled/MessageStats";
import { MessageCard } from "./scheduled/MessageCard";
import { useScheduledReminders, useSendReminderNow, useCancelReminder } from "@/hooks/useScheduledReminders";

export const ScheduledMessages = () => {
  const [filter, setFilter] = useState("all");
  
  const { data: reminders = [], isLoading, refetch } = useScheduledReminders(filter);
  const sendNow = useSendReminderNow();
  const cancelReminder = useCancelReminder();

  const handleSendNow = async (reminderId: string) => {
    try {
      await sendNow.mutateAsync(reminderId);
      refetch();
    } catch (error) {
      console.error('Failed to send reminder:', error);
    }
  };

  const handleCancel = async (reminderId: string) => {
    try {
      await cancelReminder.mutateAsync(reminderId);
      refetch();
    } catch (error) {
      console.error('Failed to cancel reminder:', error);
    }
  };

  // Convert database reminders to component format
  const messages = reminders.map(reminder => ({
    id: reminder.id,
    type: reminder.recipient_email ? "email" as const : "sms" as const,
    recipient: reminder.recipient_email || reminder.recipient_phone || 'Unknown',
    subject: reminder.recipient_email ? 'Appointment Reminder' : undefined,
    message: reminder.message_content,
    scheduledFor: reminder.scheduled_for,
    status: reminder.delivery_status as "scheduled" | "sent" | "failed" | "cancelled",
    createdAt: reminder.created_at
  }));

  const upcomingCount = messages.filter(m => m.status === "scheduled").length;
  const sentToday = messages.filter(m => 
    m.status === "sent" && 
    new Date(m.scheduledFor).toDateString() === new Date().toDateString()
  ).length;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading scheduled messages...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <MessageFilters filter={filter} onFilterChange={setFilter} />

      <MessageStats 
        upcomingCount={upcomingCount}
        sentToday={sentToday}
        totalMessages={messages.length}
      />

      <div className="space-y-4">
        {messages.map((message) => (
          <MessageCard
            key={message.id}
            message={message}
            onSendNow={handleSendNow}
            onCancel={handleCancel}
            isLoading={sendNow.isPending || cancelReminder.isPending}
          />
        ))}
      </div>

      {messages.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No messages found for the selected filter.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
