import { supabase } from "@/integrations/supabase/client";

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: any;
  badge?: string;
  group: string;
  order: number;
  requiredRole?: string;
  requiredLicense?: string;
}

export interface NavGroup {
  id: string;
  title: string;
  order: number;
}

export class SidebarService {
  private static instance: SidebarService;
  private openCallbacks: Set<(itemId: string) => void> = new Set();

  static getInstance(): SidebarService {
    if (!SidebarService.instance) {
      SidebarService.instance = new SidebarService();
    }
    return SidebarService.instance;
  }

  // Deep link functionality
  open(itemId: string) {
    this.openCallbacks.forEach(callback => callback(itemId));
  }

  onOpen(callback: (itemId: string) => void) {
    this.openCallbacks.add(callback);
    return () => {
      this.openCallbacks.delete(callback);
    };
  }

  // Navigation analytics
  async logNavClick(itemId: string, sessionStartTime: number) {
    const timeSinceStart = Date.now() - sessionStartTime;
    
    // Log to console for now - can be replaced with actual analytics service
    console.log('Navigation click:', {
      item_id: itemId,
      ms_since_session_start: timeSinceStart,
      timestamp: new Date().toISOString()
    });
  }

  // Role-based default routes
  getDefaultRoute(role: string): string {
    const roleRoutes: Record<string, string> = {
      'provider': '/agents/appointment',
      'marketer': '/agents/marketing', 
      'owner': '/dashboard',
      'admin': '/dashboard',
      'staff': '/agents/schedule'
    };
    
    return roleRoutes[role] || '/dashboard';
  }

  // Check agent licensing (placeholder for future API integration)
  async getAgentStatus(): Promise<Record<string, boolean>> {
    // TODO: Replace with actual API call to /agent-status
    return {
      'scribe-iq': true,
      'appointment-iq': true,
      'intake-iq': true,
      'education-iq': true,
      'marketing-iq': true,
      'referral-iq': true,
      'auth-iq': true,
      'claims-iq': true,
      'payments-iq': true,
      'inventory-iq': true,
      'ops-iq': true
    };
  }
}

export const sidebarService = SidebarService.getInstance();