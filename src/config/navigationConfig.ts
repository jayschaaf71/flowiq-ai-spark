import { 
  Home, 
  Users, 
  Database, 
  TrendingUp, 
  Stethoscope,
  Calendar,
  ClipboardList,
  Bell,
  GraduationCap,
  Rocket,
  Handshake,
  CheckSquare,
  Receipt,
  CreditCard,
  Package,
  UserPlus,
  Settings,
  HelpCircle,
  Moon,
  Phone,
  Clock,
  LayoutDashboard,
  MessageSquare,
  Shield,
  FileText,
  BarChart3,
  Target,
  User,
  Activity,
  DollarSign,
  Building,
  Server,
  AlertTriangle,
  Database as DatabaseIcon,
  Settings as SettingsIcon,
  Target as TargetIcon,
  TrendingUp as TrendingUpIcon,
  MessageSquare as MessageSquareIcon,
  Stethoscope as StethoscopeIcon,
  Settings as SettingsIcon2
} from "lucide-react";
import { NavItem, NavGroup } from "@/services/sidebarService";

// New workflow-based navigation groups
export const navGroups: NavGroup[] = [
  { id: "main", title: "Main", order: 10 },
  { id: "clinical", title: "Clinical", order: 20 },
  { id: "administrative", title: "Administrative", order: 30 },
  { id: "ai_assistants", title: "AI Assistants", order: 40 },
  { id: "settings", title: "Settings", order: 50 }
];

// Role-based navigation items with workflow organization
const baseNavItems: NavItem[] = [
  // Main Navigation (All Roles)
  { id: "dashboard", label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, group: "main", order: 1 },
  { id: "patients", label: "Patients", path: "/patients", icon: Users, group: "main", order: 2 },
  { id: "schedule", label: "Schedule", path: "/schedule", icon: Calendar, group: "main", order: 3 },
  
  // Clinical Navigation (Clinical Staff Only)
  { id: "clinical", label: "Clinical", path: "/clinical", icon: Stethoscope, group: "clinical", order: 1, requiredRole: "clinical" },
  { id: "soap-notes", label: "SOAP Notes", path: "/clinical/soap-notes", icon: FileText, group: "clinical", order: 2, requiredRole: "clinical" },
  { id: "patient-records", label: "Patient Records", path: "/clinical/records", icon: ClipboardList, group: "clinical", order: 3, requiredRole: "clinical" },
  
  // Administrative Navigation (Admin Staff Only)
  { id: "revenue", label: "Revenue", path: "/revenue", icon: TrendingUp, group: "administrative", order: 1, requiredRole: "admin" },
  { id: "claims", label: "Claims", path: "/revenue/claims", icon: Receipt, group: "administrative", order: 2, requiredRole: "admin" },
  { id: "payments", label: "Payments", path: "/revenue/payments", icon: CreditCard, group: "administrative", order: 3, requiredRole: "admin" },
  { id: "analytics", label: "Analytics", path: "/analytics", icon: BarChart3, group: "administrative", order: 4, requiredRole: "manager" },
  
  // Consolidated AI Assistants (All Roles)
  { id: "clinical-assistant", label: "Clinical Assistant", path: "/assistants/clinical", icon: Stethoscope, badge: "AI", group: "ai_assistants", order: 1 },
  { id: "communication-assistant", label: "Communication Assistant", path: "/assistants/communication", icon: MessageSquare, badge: "AI", group: "ai_assistants", order: 2 },
  { id: "revenue-assistant", label: "Revenue Assistant", path: "/assistants/revenue", icon: TrendingUp, badge: "AI", group: "ai_assistants", order: 3 },
  { id: "operations-assistant", label: "Operations Assistant", path: "/assistants/operations", icon: Settings, badge: "AI", group: "ai_assistants", order: 4 },
  { id: "growth-assistant", label: "Growth Assistant", path: "/assistants/growth", icon: Target, badge: "AI", group: "ai_assistants", order: 5 },
  
  // Settings (All Roles)
  { id: "settings", label: "Settings", path: "/settings", icon: Settings, group: "settings", order: 1 },
  { id: "profile", label: "Profile", path: "/profile", icon: User, group: "settings", order: 2 }
];

// Specialty-specific navigation items
const dentalSleepNavItems: NavItem[] = [
  // Dental Sleep specific items
  { id: "sleep-studies", label: "Sleep Studies", path: "/clinical/sleep-studies", icon: Moon, group: "clinical", order: 4, requiredRole: "clinical" },
  { id: "dme-tracking", label: "DME Tracking", path: "/clinical/dme", icon: Package, group: "clinical", order: 5, requiredRole: "clinical" },
  { id: "compliance", label: "Compliance", path: "/clinical/compliance", icon: Shield, group: "clinical", order: 6, requiredRole: "clinical" }
];

// Function to get filtered navigation items based on specialty and role
export const getNavItems = (specialty: string = 'chiropractic', userRole: string = 'staff'): NavItem[] => {
  const currentSpecialty = specialty || localStorage.getItem('currentSpecialty') || 'chiropractic';
  
  // Get the specialty prefix for routes
  let specialtyPrefix = '';
  if (currentSpecialty === 'dental-sleep-medicine' || currentSpecialty === 'dental-sleep') {
    specialtyPrefix = '/dental-sleep';
  } else if (currentSpecialty === 'dental') {
    specialtyPrefix = '/general-dentistry';
  } else if (currentSpecialty === 'med-spa') {
    specialtyPrefix = '/medspa';
  } else if (currentSpecialty === 'concierge') {
    specialtyPrefix = '/concierge-medicine';
  } else if (currentSpecialty === 'hrt') {
    specialtyPrefix = '/hrt';
  } else {
    specialtyPrefix = '/chiropractic';
  }
  
  // Create specialty-specific base items with proper routes
  let specialtyNavItems = baseNavItems.map(item => {
    // Handle specialty-specific routes
    if (item.id === 'dashboard') {
      return { ...item, path: `${specialtyPrefix}/dashboard` };
    }
    
    // Add specialty prefix to all other routes
    return { ...item, path: `${specialtyPrefix}${item.path}` };
  });
  
  // Add specialty-specific items
  if (currentSpecialty === 'dental-sleep-medicine' || currentSpecialty === 'dental-sleep') {
    specialtyNavItems = [...specialtyNavItems, ...dentalSleepNavItems.map(item => ({
      ...item,
      path: `${specialtyPrefix}${item.path}`
    }))];
  }
  
  // Filter based on user role
  return specialtyNavItems.filter(item => {
    if (item.requiredRole && userRole !== item.requiredRole) {
      return false;
    }
    return true;
  });
};

// Function to get navigation groups filtered by user role
export const getNavGroups = (userRole: string = 'staff'): NavGroup[] => {
  return navGroups.filter(group => {
    // Show all groups for now, but we could filter based on role if needed
    return true;
  });
};