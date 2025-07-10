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
  Moon
} from "lucide-react";
import { NavItem, NavGroup } from "@/services/sidebarService";

export const navGroups: NavGroup[] = [
  { id: "overview", title: "Overview", order: 10 },
  { id: "clinical_care", title: "Clinical Care", order: 20 },
  { id: "patient_journey", title: "Patient Journey", order: 30 },
  { id: "revenue_cycle", title: "Revenue Cycle", order: 40 },
  { id: "operations", title: "Operations", order: 50 },
  { id: "settings", title: "Settings", order: 60 }
];

// Base navigation items
const baseNavItems: NavItem[] = [
  // Overview
  { id: "dashboard", label: "Dashboard", path: "/dashboard", icon: Home, group: "overview", order: 10 },
  { id: "patients", label: "Patients", path: "/patient-management", icon: Users, group: "overview", order: 20 },
  { id: "ehr", label: "EHR", path: "/ehr", icon: Database, group: "overview", order: 30 },
  { id: "insights", label: "Insights", path: "/insights", icon: TrendingUp, group: "overview", order: 40 },

  // Clinical Care
  { id: "scribe-iq", label: "Scribe iQ", path: "/agents/scribe", icon: Stethoscope, badge: "AI", group: "clinical_care", order: 10 },
  { id: "appointment-iq", label: "Appointment iQ", path: "/agents/appointment", icon: Calendar, badge: "AI", group: "clinical_care", order: 20 },

  // Patient Journey
  { id: "intake-iq", label: "Intake iQ", path: "/agents/intake", icon: ClipboardList, badge: "AI", group: "patient_journey", order: 10 },
  { id: "education-iq", label: "Education iQ", path: "/agents/education", icon: GraduationCap, badge: "AI", group: "patient_journey", order: 20 },
  { id: "marketing-iq", label: "Marketing iQ", path: "/agents/marketing", icon: Rocket, badge: "AI", group: "patient_journey", order: 30 },
  { id: "referral-iq", label: "Referral iQ", path: "/agents/referral", icon: Handshake, badge: "AI", group: "patient_journey", order: 50 },

  // Revenue Cycle
  { id: "auth-iq", label: "Auth iQ", path: "/agents/auth", icon: CheckSquare, badge: "AI", group: "revenue_cycle", order: 10 },
  { id: "claims-iq", label: "Claims iQ", path: "/agents/claims", icon: Receipt, badge: "AI", group: "revenue_cycle", order: 20 },
  { id: "payments-iq", label: "Payments iQ", path: "/agents/payments", icon: CreditCard, badge: "AI", group: "revenue_cycle", order: 30 },

  // Operations
  { id: "inventory-iq", label: "Inventory iQ", path: "/agents/inventory", icon: Package, badge: "AI", group: "operations", order: 10 },
  { id: "ops-iq", label: "Ops iQ", path: "/ops", icon: UserPlus, badge: "AI", group: "operations", order: 20 },

  // Settings
  { id: "settings", label: "Settings", path: "/settings", icon: Settings, group: "settings", order: 10 },
  { id: "help", label: "AssistIQ", path: "/help", icon: HelpCircle, group: "settings", order: 20 }
];

// Dental-specific items (only show in dental contexts)
const dentalNavItems: NavItem[] = [
  { id: "dental-sleep-iq", label: "Dental Sleep iQ", path: "/agents/dental-sleep", icon: Moon, badge: "AI", group: "clinical_care", order: 25 },
];

// Function to get filtered navigation items based on specialty
export const getNavItems = (specialty: string = 'chiropractic'): NavItem[] => {
  const currentSpecialty = specialty || localStorage.getItem('currentSpecialty') || 'chiropractic';
  
  if (currentSpecialty === 'dental-sleep' || currentSpecialty === 'dental') {
    return [...baseNavItems, ...dentalNavItems];
  }
  
  // For chiropractic and all other specialties, return base items only
  return baseNavItems;
};

// Export default for backward compatibility
export const navItems: NavItem[] = baseNavItems;