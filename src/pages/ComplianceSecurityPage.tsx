
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HIPAAComplianceDashboard } from '@/components/compliance/HIPAAComplianceDashboard';
import { ComplianceAnalytics } from '@/components/analytics/ComplianceAnalytics';
import { SecurityAuditTrail } from '@/components/security/SecurityAuditTrail';
import { DataEncryptionManager } from '@/components/security/DataEncryptionManager';
import { AccessControlManager } from '@/components/security/AccessControlManager';

export const ComplianceSecurityPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="hipaa" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hipaa">HIPAA Compliance</TabsTrigger>
          <TabsTrigger value="analytics">Compliance Analytics</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="encryption">Data Security</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
        </TabsList>
        
        <TabsContent value="hipaa" className="space-y-6">
          <HIPAAComplianceDashboard />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <ComplianceAnalytics />
        </TabsContent>
        
        <TabsContent value="audit" className="space-y-6">
          <SecurityAuditTrail />
        </TabsContent>
        
        <TabsContent value="encryption" className="space-y-6">
          <DataEncryptionManager />
        </TabsContent>
        
        <TabsContent value="access" className="space-y-6">
          <AccessControlManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};
