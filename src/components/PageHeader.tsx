
import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell, FileText, Calendar, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children?: ReactNode;
}

export const PageHeader = ({ title, subtitle, badge, children }: PageHeaderProps) => {
  const [notificationOpen, setNotificationOpen] = useState(false);

  const notifications = [
    { id: 1, title: "New SOAP Note Generated", message: "AI-generated SOAP note ready for review", icon: FileText, time: "2 min ago" },
    { id: 2, title: "Appointment Reminder", message: "Sarah Johnson appointment in 30 minutes", icon: Calendar, time: "5 min ago" },
    { id: 3, title: "System Alert", message: "Database backup completed successfully", icon: AlertTriangle, time: "1 hour ago" }
  ];

  const handleNotificationClick = () => {
    setNotificationOpen(!notificationOpen);
  };

  return (
    <div className="p-6 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">
              {title}
            </h1>
            {badge && (
              <Badge variant="outline">
                {badge}
              </Badge>
            )}
          </div>
          {subtitle && (
            <p className="text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {children}
          <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative hover:bg-accent transition-colors"
                onClick={handleNotificationClick}
              >
                <Bell className="h-4 w-4" />
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                  {notifications.length}
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="bg-card rounded-lg shadow-lg border border-border">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => {
                    const IconComponent = notification.icon;
                    return (
                      <div key={notification.id} className="p-4 border-b border-border last:border-0 hover:bg-accent cursor-pointer">
                        <div className="flex items-start gap-3">
                          <IconComponent className="w-5 h-5 text-primary mt-0.5" />
                          <div className="flex-1">
                            <p className="font-medium text-foreground text-sm">{notification.title}</p>
                            <p className="text-muted-foreground text-sm">{notification.message}</p>
                            <p className="text-muted-foreground text-xs mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-3 border-t border-border">
                  <Button variant="ghost" className="w-full text-sm">
                    View All Notifications
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              AX
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};
