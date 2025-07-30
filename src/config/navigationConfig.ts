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
  User
} from "lucide-react";
import { NavItem, NavGroup } from "@/services/sidebarService";

export const navGroups: NavGroup[] = [
  { id: "main", title: "Overview", order: 10 },
  { id: "ai_agents", title: "AI Agents", order: 20 },
  { id: "settings", title: "Settings", order: 30 }
];

// Base navigation items - Clean, organized structure
const baseNavItems: NavItem[] = [
  // Overview
  { id: "dashboard", label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, group: "main", order: 1 },
  { id: "calendar", label: "Calendar", path: "/calendar", icon: Calendar, group: "main", order: 2 },
  
  // AI Agents (All 10 consolidated agents)
  { id: "communication-iq", label: "Communication iQ", path: "/agents/communication", icon: MessageSquare, badge: "AI", group: "ai_agents", order: 1 },
  { id: "scribe-iq", label: "Scribe iQ", path: "/agents/scribe", icon: Stethoscope, badge: "AI", group: "ai_agents", order: 2 },
  { id: "ehr-iq", label: "EHR iQ", path: "/agents/ehr", icon: FileText, badge: "AI", group: "ai_agents", order: 3 },
  { id: "revenue-iq", label: "Revenue iQ", path: "/agents/revenue", icon: TrendingUp, badge: "AI", group: "ai_agents", order: 4 },
  { id: "insurance-iq", label: "Insurance iQ", path: "/agents/insurance", icon: Shield, badge: "AI", group: "ai_agents", order: 5 },
  { id: "inventory-iq", label: "Inventory iQ", path: "/agents/inventory", icon: Package, badge: "AI", group: "ai_agents", order: 6 },
  { id: "ops-iq", label: "Ops iQ", path: "/agents/ops", icon: Settings, badge: "AI", group: "ai_agents", order: 7 },
  { id: "insight-iq", label: "Insight iQ", path: "/agents/insight", icon: BarChart3, badge: "AI", group: "ai_agents", order: 8 },
  { id: "education-iq", label: "Education iQ", path: "/agents/education", icon: GraduationCap, badge: "AI", group: "ai_agents", order: 9 },
  { id: "growth-iq", label: "Growth iQ", path: "/agents/growth", icon: Target, badge: "AI", group: "ai_agents", order: 10 },
  
  // Settings
  { id: "settings", label: "Settings", path: "/settings", icon: Settings, group: "settings", order: 1 },
  { id: "profile", label: "Profile", path: "/profile", icon: User, group: "settings", order: 2 }
];

// Remove deprecated items
// { id: "voice-iq", label: "Voice iQ", path: "/agents/voice", icon: Phone, badge: "AI", group: "communication", order: 20 },
// { id: "billing-iq", label: "Billing iQ", path: "/agents/billing", icon: CreditCard, badge: "AI", group: "revenue_cycle", order: 10 },
// { id: "claims-iq", label: "Claims iQ", path: "/agents/claims", icon: Receipt, badge: "AI", group: "revenue_cycle", order: 20 },
// { id: "payments-iq", label: "Payments iQ", path: "/agents/payments", icon: CreditCard, badge: "AI", group: "revenue_cycle", order: 30 },
// { id: "auth-iq", label: "Auth iQ", path: "/agents/auth", icon: CheckSquare, badge: "AI", group: "revenue_cycle", order: 10 },
// { id: "compliance-iq", label: "Compliance iQ", path: "/agents/compliance", icon: Shield, badge: "AI", group: "compliance", order: 10 },

// Dental-specific items (only show in dental contexts)
const dentalNavItems: NavItem[] = [];

// Function to get filtered navigation items based on specialty
export const getNavItems = (specialty: string = 'chiropractic'): NavItem[] => {
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
  const specialtyNavItems = baseNavItems.map(item => {

    // Handle specialty-specific routes
    if (item.id === 'dashboard') {
      return { ...item, path: `${specialtyPrefix}/dashboard` };
    }
    
    if (item.id === 'patients') {
      return { ...item, path: `${specialtyPrefix}/patients` };
    }
    
    if (item.id === 'appointments') {
      return { ...item, path: `${specialtyPrefix}/appointments` };
    }
    
    if (item.id === 'intake') {
      return { ...item, path: `${specialtyPrefix}/intake` };
    }
    
    if (item.id === 'settings') {
      return { ...item, path: `${specialtyPrefix}/settings` };
    }
    
    if (item.id === 'profile') {
      return { ...item, path: `${specialtyPrefix}/profile` };
    }
    
    // Handle agent routes - prefix them with specialty
    if (item.path.startsWith('/agents/')) {
      return { ...item, path: `${specialtyPrefix}${item.path}` };
    }
    
    // Handle other specialty-specific routes
    if (item.id === 'go-to-market-iq') {
      return { ...item, path: `${specialtyPrefix}/go-to-market` };
    }
    
    if (item.id === 'ops-iq') {
      return { ...item, path: `${specialtyPrefix}/ops` };
    }
    
    if (item.id === 'insight-iq') {
      return { ...item, path: `${specialtyPrefix}/agents/insight` };
    }
    
    if (item.id === 'assist-iq') {
      return { ...item, path: `${specialtyPrefix}/agents/assist` };
    }
    
    if (item.id === 'education-iq') {
      return { ...item, path: `${specialtyPrefix}/agents/education` };
    }
    
    if (item.id === 'growth-iq') {
      return { ...item, path: `${specialtyPrefix}/agents/growth` };
    }
    
    if (item.id === 'communication-iq') {
      return { ...item, path: `${specialtyPrefix}/agents/communication` };
    }
    
    return item;
  });

  if (currentSpecialty === 'dental-sleep-medicine' || currentSpecialty === 'dental-sleep' || currentSpecialty === 'dental') {
    // Apply specialty prefix to dental-specific items too
    const specialtyDentalItems = dentalNavItems.map(item => ({
      ...item,
      path: `${specialtyPrefix}${item.path}`
    }));
    return [...specialtyNavItems, ...specialtyDentalItems];
  }
  
  // For chiropractic and all other specialties, return specialty-specific items
  return specialtyNavItems;
};

// Export default for backward compatibility
export const navItems: NavItem[] = baseNavItems;