import { supabase } from '@/integrations/supabase/client';

interface NotificationConfig {
  claimStatusChanges: boolean;
  eligibilityUpdates: boolean;
  paymentReceived: boolean;
  denialAlerts: boolean;
  appealUpdates: boolean;
  automationEvents: boolean;
}

interface ClaimStatusNotification {
  id: string;
  claimId: string;
  claimNumber: string;
  patientName: string;
  insuranceProvider: string;
  oldStatus: string;
  newStatus: string;
  timestamp: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionRequired: boolean;
}

interface EligibilityNotification {
  id: string;
  patientId: string;
  patientName: string;
  insuranceProvider: string;
  eligibilityStatus: 'verified' | 'pending' | 'failed';
  coverageDetails: any;
  timestamp: string;
  message: string;
}

interface PaymentNotification {
  id: string;
  claimId: string;
  claimNumber: string;
  patientName: string;
  insuranceProvider: string;
  paymentAmount: number;
  paymentDate: string;
  timestamp: string;
  message: string;
}

interface DenialNotification {
  id: string;
  claimId: string;
  claimNumber: string;
  patientName: string;
  insuranceProvider: string;
  denialReason: string;
  denialCode: string;
  timestamp: string;
  message: string;
  autoCorrectable: boolean;
  appealProbability: number;
}

class RealTimeNotificationService {
  private ws: WebSocket | null = null;
  private notificationConfig: NotificationConfig = {
    claimStatusChanges: true,
    eligibilityUpdates: true,
    paymentReceived: true,
    denialAlerts: true,
    appealUpdates: true,
    automationEvents: true
  };
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    this.initializeWebSocket();
    this.setupSupabaseRealtime();
  }

  private initializeWebSocket(): void {
    // Initialize WebSocket connection for real-time updates
    const wsUrl = process.env.REACT_APP_WEBSOCKET_URL || 'wss://api.flow-iq.ai/ws';
    
    try {
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected for real-time notifications');
        this.subscribeToInsuranceUpdates();
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleRealTimeUpdate(data);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected, attempting to reconnect...');
        setTimeout(() => this.initializeWebSocket(), 5000);
      };
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
    }
  }

  private setupSupabaseRealtime(): void {
    // Subscribe to Supabase real-time changes
    const claimsChannel = supabase
      .channel('claims-status-changes')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'claims' },
        (payload) => {
          this.handleClaimStatusChange(payload.new);
        }
      )
      .subscribe();

    const automationChannel = supabase
      .channel('automation-steps')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'automation_steps' },
        (payload) => {
          this.handleAutomationStep(payload.new);
        }
      )
      .subscribe();
  }

  private subscribeToInsuranceUpdates(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'subscribe',
        channels: [
          'va-optum-claims',
          'medicare-dme-claims',
          'united-healthcare-claims',
          'aetna-claims',
          'bcbs-claims',
          'cigna-claims'
        ]
      }));
    }
  }

  private handleRealTimeUpdate(data: any): void {
    switch (data.type) {
      case 'claim_status_change':
        this.handleClaimStatusChange(data.payload);
        break;
      case 'eligibility_update':
        this.handleEligibilityUpdate(data.payload);
        break;
      case 'payment_received':
        this.handlePaymentReceived(data.payload);
        break;
      case 'denial_received':
        this.handleDenialReceived(data.payload);
        break;
      case 'appeal_update':
        this.handleAppealUpdate(data.payload);
        break;
      case 'automation_event':
        this.handleAutomationEvent(data.payload);
        break;
    }
  }

  private async handleClaimStatusChange(claim: any): Promise<void> {
    const notification: ClaimStatusNotification = {
      id: `claim-${claim.id}-${Date.now()}`,
      claimId: claim.id,
      claimNumber: claim.claim_number,
      patientName: claim.patient_name || 'Unknown Patient',
      insuranceProvider: claim.insurance_provider_name || 'Unknown Provider',
      oldStatus: claim.previous_status || 'unknown',
      newStatus: claim.status,
      timestamp: new Date().toISOString(),
      message: `Claim ${claim.claim_number} status changed from ${claim.previous_status} to ${claim.status}`,
      priority: this.getClaimStatusPriority(claim.status),
      actionRequired: this.isActionRequired(claim.status)
    };

    await this.saveNotification(notification);
    this.notifyListeners('claimStatusChange', notification);
    this.showPushNotification(notification);
  }

  private async handleEligibilityUpdate(eligibility: any): Promise<void> {
    const notification: EligibilityNotification = {
      id: `eligibility-${eligibility.patient_id}-${Date.now()}`,
      patientId: eligibility.patient_id,
      patientName: eligibility.patient_name || 'Unknown Patient',
      insuranceProvider: eligibility.insurance_provider_name || 'Unknown Provider',
      eligibilityStatus: eligibility.status,
      coverageDetails: eligibility.coverage_details,
      timestamp: new Date().toISOString(),
      message: `Eligibility ${eligibility.status} for ${eligibility.patient_name} with ${eligibility.insurance_provider_name}`
    };

    await this.saveNotification(notification);
    this.notifyListeners('eligibilityUpdate', notification);
    this.showPushNotification(notification);
  }

  private async handlePaymentReceived(payment: any): Promise<void> {
    const notification: PaymentNotification = {
      id: `payment-${payment.claim_id}-${Date.now()}`,
      claimId: payment.claim_id,
      claimNumber: payment.claim_number,
      patientName: payment.patient_name || 'Unknown Patient',
      insuranceProvider: payment.insurance_provider_name || 'Unknown Provider',
      paymentAmount: payment.amount,
      paymentDate: payment.payment_date,
      timestamp: new Date().toISOString(),
      message: `Payment received: $${payment.amount.toFixed(2)} for claim ${payment.claim_number}`
    };

    await this.saveNotification(notification);
    this.notifyListeners('paymentReceived', notification);
    this.showPushNotification(notification);
  }

  private async handleDenialReceived(denial: any): Promise<void> {
    const notification: DenialNotification = {
      id: `denial-${denial.claim_id}-${Date.now()}`,
      claimId: denial.claim_id,
      claimNumber: denial.claim_number,
      patientName: denial.patient_name || 'Unknown Patient',
      insuranceProvider: denial.insurance_provider_name || 'Unknown Provider',
      denialReason: denial.denial_reason,
      denialCode: denial.denial_code,
      timestamp: new Date().toISOString(),
      message: `Claim ${denial.claim_number} denied: ${denial.denial_reason}`,
      autoCorrectable: denial.auto_correctable || false,
      appealProbability: denial.appeal_probability || 0
    };

    await this.saveNotification(notification);
    this.notifyListeners('denialReceived', notification);
    this.showPushNotification(notification);
  }

  private async handleAppealUpdate(appeal: any): Promise<void> {
    const notification = {
      id: `appeal-${appeal.claim_id}-${Date.now()}`,
      claimId: appeal.claim_id,
      claimNumber: appeal.claim_number,
      patientName: appeal.patient_name || 'Unknown Patient',
      insuranceProvider: appeal.insurance_provider_name || 'Unknown Provider',
      appealStatus: appeal.status,
      timestamp: new Date().toISOString(),
      message: `Appeal ${appeal.status} for claim ${appeal.claim_number}`
    };

    await this.saveNotification(notification);
    this.notifyListeners('appealUpdate', notification);
    this.showPushNotification(notification);
  }

  private async handleAutomationEvent(event: any): Promise<void> {
    const notification = {
      id: `automation-${event.claim_id}-${Date.now()}`,
      claimId: event.claim_id,
      step: event.step,
      status: event.status,
      timestamp: new Date().toISOString(),
      message: `Automation ${event.step}: ${event.status}`
    };

    await this.saveNotification(notification);
    this.notifyListeners('automationEvent', notification);
    
    if (event.status === 'failed') {
      this.showPushNotification(notification);
    }
  }

  private async handleAutomationStep(step: any): Promise<void> {
    const notification = {
      id: `automation-step-${step.id}`,
      claimId: step.claim_id,
      step: step.step,
      status: step.status,
      timestamp: step.timestamp,
      message: `Automation step ${step.step}: ${step.status}`
    };

    this.notifyListeners('automationStep', notification);
    
    if (step.status === 'failed') {
      this.showPushNotification(notification);
    }
  }

  private getClaimStatusPriority(status: string): 'low' | 'medium' | 'high' | 'critical' {
    switch (status) {
      case 'denied':
        return 'critical';
      case 'paid':
        return 'high';
      case 'submitted':
        return 'medium';
      default:
        return 'low';
    }
  }

  private isActionRequired(status: string): boolean {
    return ['denied', 'pending', 'requires_auth'].includes(status);
  }

  private async saveNotification(notification: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          type: notification.type || 'general',
          title: notification.message,
          details: notification,
          priority: notification.priority || 'medium',
          read: false,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving notification:', error);
    }
  }

  private showPushNotification(notification: any): void {
    // Check if browser supports notifications
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    // Request permission if not granted
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          this.createNotification(notification);
        }
      });
    } else if (Notification.permission === 'granted') {
      this.createNotification(notification);
    }
  }

  private createNotification(notification: any): void {
    const pushNotification = new Notification('FlowIQ Insurance Update', {
      body: notification.message,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: notification.id,
      requireInteraction: notification.priority === 'critical'
    });

    // Handle notification click
    pushNotification.onclick = () => {
      window.focus();
      // Navigate to the relevant page
      if (notification.claimId) {
        window.location.href = `/assistants/revenue?claim=${notification.claimId}`;
      }
    };
  }

  // Event listener management
  public addListener(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  public removeListener(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private notifyListeners(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Configuration management
  public updateNotificationConfig(config: Partial<NotificationConfig>): void {
    this.notificationConfig = { ...this.notificationConfig, ...config };
  }

  public getNotificationConfig(): NotificationConfig {
    return { ...this.notificationConfig };
  }

  // Cleanup
  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
    }
    this.listeners.clear();
  }
}

export const realTimeNotificationService = new RealTimeNotificationService();
