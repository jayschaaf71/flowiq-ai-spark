
import * as React from "react"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/useAuth"
import { useTenantConfig } from "@/utils/tenantConfig"
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  Activity, 
  Settings, 
  Power,
  Brain,
  Zap,
  MessageSquare,
  ShieldCheck,
  CreditCard,
  Play,
  Mic
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "Overview of all AI agents"
  },
  {
    title: "Schedule iQ",
    href: "/schedule-iq",
    icon: Calendar,
    description: "AI-powered appointment scheduling"
  },
  {
    title: "Intake iQ",
    href: "/intake-iq",
    icon: FileText,
    description: "AI-driven patient intake and forms"
  },
  {
    title: "Scribe iQ",
    href: "/scribe-iq",
    icon: Mic,
    description: "AI medical scribe and documentation"
  },
  {
    title: "Claims iQ",
    href: "/claims-iq",
    icon: CreditCard,
    description: "AI claims processing and revenue cycle"
  },
  {
    title: "EHR iQ",
    href: "/ehr-iq",
    icon: Activity,
    description: "AI-enhanced electronic health records"
  },
  {
    title: "Compliance iQ",
    href: "/compliance-iq",
    icon: ShieldCheck,
    description: "HIPAA compliance and security"
  },
  {
    title: "Patient Management",
    href: "/patient-management",
    icon: Users,
    description: "Manage patient records and communications"
  },
  {
    title: "Workflow Orchestration",
    href: "/workflow-orchestration",
    icon: Zap,
    description: "Automate patient care workflows"
  },
  {
    title: "Pilot Demo",
    href: "/pilot-demo",
    icon: Play,
    description: "Full patient lifecycle demonstration"
  },
];

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(({ className, ...props }, ref) => {
  const { user, profile, signOut } = useAuth();
  const tenantConfig = useTenantConfig();
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  return (
    <div
      className={cn(
        "flex flex-col space-y-4 border-r border-border bg-card backdrop-blur-sm shadow-sm w-64",
        className
      )}
      ref={ref}
      {...props}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg text-foreground">{tenantConfig.brandName}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
          <LayoutDashboard className="h-4 w-4" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
      <Separator />
      <ScrollArea className="flex-1 space-y-2 p-4">
        <div className="pb-3">
          <h4 className="mb-1 rounded-md px-2 text-sm font-semibold tracking-tight">
            {tenantConfig.specialty} iQ Agents
          </h4>
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "justify-start px-2",
                    location.pathname === item.href
                      ? "bg-accent text-primary font-semibold"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                  onClick={() => navigate(item.href)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </ScrollArea>
      <Separator />
      <div className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex h-8 w-full items-center justify-between px-2">
              <Avatar className="mr-2 h-8 w-8">
                <AvatarImage src="" alt={profile?.first_name || ""} />
                <AvatarFallback>
                  {profile?.first_name?.slice(0, 1)}{profile?.last_name?.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate text-left">{profile?.first_name} {profile?.last_name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" forceMount className="w-48">
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <Power className="mr-2 h-4 w-4" />
              <span>Log out</span>
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
})
Sidebar.displayName = "Sidebar"

export { Sidebar }
