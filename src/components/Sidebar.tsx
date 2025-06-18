
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Workflow, 
  BarChart3, 
  Settings, 
  Users, 
  Zap, 
  FileText,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Brain,
  Calendar,
  ClipboardList,
  Bell,
  CreditCard,
  Receipt,
  MessageSquare,
  Stethoscope,
  UserPlus,
  Building2,
  Activity
} from "lucide-react";

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const mainNavigationItems = [
    { icon: Home, label: "Dashboard", path: "/", badge: null },
    { icon: Brain, label: "Manager Agent", path: "/manager", badge: "AI" },
    { icon: Workflow, label: "Workflows", path: "/workflows", badge: "12" },
    { icon: BarChart3, label: "Analytics", path: "/analytics", badge: null },
    { icon: Zap, label: "AI Insights", path: "/insights", badge: "3" },
  ];

  const practiceManagement = [
    { icon: UserPlus, label: "Patients", path: "/patients", badge: null },
    { icon: Users, label: "Team", path: "/team", badge: null },
    { icon: Building2, label: "Practice Setup", path: "/setup", badge: null },
  ];

  const aiAgents = [
    { icon: Calendar, label: "Schedule iQ", path: "/agents/schedule", badge: "AI" },
    { icon: ClipboardList, label: "Intake iQ", path: "/agents/intake", badge: "AI" },
    { icon: Bell, label: "Remind iQ", path: "/agents/remind", badge: "AI" },
    { icon: CreditCard, label: "Billing iQ", path: "/agents/billing", badge: "AI" },
    { icon: Receipt, label: "Claims iQ", path: "/agents/claims", badge: "AI" },
    { icon: MessageSquare, label: "Assist iQ", path: "/agents/assist", badge: "AI" },
    { icon: Stethoscope, label: "Scribe iQ", path: "/agents/scribe", badge: "AI" },
  ];

  const bottomItems = [
    { icon: FileText, label: "Templates", path: "/templates" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: HelpCircle, label: "Help", path: "/help" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const renderNavSection = (title: string, items: any[]) => (
    <div className="space-y-2">
      {!isCollapsed && (
        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </h3>
      )}
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            isActive(item.path)
              ? "bg-green-50 text-green-700 border border-green-200"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <item.icon className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && (
            <>
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <Badge 
                  variant={item.badge === "AI" ? "default" : "secondary"} 
                  className={`ml-auto text-xs ${
                    item.badge === "AI" ? "bg-green-100 text-green-700" : ""
                  }`}
                >
                  {item.badge}
                </Badge>
              )}
            </>
          )}
        </NavLink>
      ))}
    </div>
  );

  return (
    <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-10 ${
      isCollapsed ? "w-16" : "w-64"
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="h-8 w-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Stethoscope className="h-4 w-4 text-white" />
                  </div>
                  <Activity className="h-3 w-3 text-green-600 absolute -top-1 -right-1" />
                </div>
                <div>
                  <span className="font-bold text-sm">
                    <span className="text-green-600">West County</span>
                  </span>
                  <p className="text-xs text-gray-600">Spine & Joint</p>
                </div>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hover:bg-gray-100"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {renderNavSection("Main", mainNavigationItems)}
          {renderNavSection("Practice", practiceManagement)}
          {renderNavSection("AI Agents", aiAgents)}
        </nav>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-2">
            {bottomItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-green-50 text-green-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
