import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Enhanced2FA } from '@/components/security/Enhanced2FA';
import { SessionManager } from '@/components/security/SessionManager';
import { ComplianceMonitor } from '@/components/security/ComplianceMonitor';
import { PageHeader } from '@/components/PageHeader';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Key, 
  Monitor, 
  FileCheck,
  Lock,
  Activity
} from 'lucide-react';

const SecuritySettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('2fa');

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Security & Compliance"
        subtitle="Manage your account security and view HIPAA compliance status"
      >
        <div className="flex gap-2">
          <Badge className="bg-blue-100 text-blue-700">
            <Lock className="w-3 h-3 mr-1" />
            HIPAA Compliant
          </Badge>
          <Badge className="bg-green-100 text-green-700">
            <Shield className="w-3 h-3 mr-1" />
            Secure
          </Badge>
        </div>
      </PageHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="2fa" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            Two-Factor Auth
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Active Sessions
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <FileCheck className="w-4 h-4" />
            Compliance Monitor
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Audit Trail
          </TabsTrigger>
        </TabsList>

        <TabsContent value="2fa" className="space-y-6">
          <Enhanced2FA />
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <SessionManager />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <ComplianceMonitor />
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <div className="text-center py-12">
            <Activity className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Audit Trail</h3>
            <p className="text-muted-foreground">
              Detailed audit trail view coming soon. All activities are currently being logged for HIPAA compliance.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecuritySettings;