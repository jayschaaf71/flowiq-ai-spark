
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children?: ReactNode;
}

export const PageHeader = ({ title, subtitle, badge, children }: PageHeaderProps) => {
  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "You have 3 new notifications to review.",
    });
  };

  return (
    <div className="p-6 border-b border-gray-200 bg-white/50 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {title}
            </h1>
            {badge && (
              <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                {badge}
              </Badge>
            )}
          </div>
          {subtitle && (
            <p className="text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {children}
          <Button
            variant="outline"
            size="icon"
            className="relative hover:bg-blue-50 transition-colors"
            onClick={handleNotificationClick}
          >
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
              3
            </Badge>
          </Button>
          
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              AX
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};
