
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, MessageSquare } from 'lucide-react';
import { EnhancedSMSTestPanel } from './EnhancedSMSTestPanel';
import { EmailTestPanel } from './EmailTestPanel';
import { Template } from '@/hooks/useTemplates';

interface TemplateTestingPanelProps {
  templates: Template[];
  submissionId?: string;
}

export const TemplateTestingPanel: React.FC<TemplateTestingPanelProps> = ({
  templates,
  submissionId
}) => {
  const smsTemplates = templates.filter(t => t.type === 'sms');
  const emailTemplates = templates.filter(t => t.type === 'email');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Template Testing</h3>
        <p className="text-gray-600">
          Test your SMS and email templates with sample data before using them in production.
        </p>
      </div>

      <Tabs defaultValue="sms" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sms" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            SMS Testing ({smsTemplates.length})
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Testing ({emailTemplates.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sms">
          <EnhancedSMSTestPanel 
            templates={smsTemplates} 
            submissionId={submissionId}
          />
        </TabsContent>

        <TabsContent value="email">
          <EmailTestPanel 
            templates={emailTemplates} 
            submissionId={submissionId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
