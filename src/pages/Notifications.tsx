import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertCircle } from "lucide-react";

const Notifications = () => {
  return (
    <>
      <PageHeader 
        title="Notifications"
        subtitle="Manage alerts, reminders, and system notifications"
      />
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Center
            </CardTitle>
            <CardDescription>
              Real-time alerts and notifications for your practice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Notification System Coming Soon</p>
              <p className="text-sm">Comprehensive notification management will be available here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Notifications;