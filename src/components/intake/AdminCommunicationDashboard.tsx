
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CommunicationTestPanel } from './CommunicationTestPanel';
import { CommunicationLogViewer } from './CommunicationLogViewer';
import { PatientCommunicationManager } from './PatientCommunicationManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, TestTube, History, Users } from 'lucide-react';

interface AdminCommunicationDashboardProps {
  submissionId?: string;
  submission?: any;
  onSendCommunication?: (
    submissionId: string,
    templateId: string,
    recipient: string,
    patientName: string,
    customMessage?: string,
    type?: 'email' | 'sms'
  ) => void;
}

export const AdminCommunicationDashboard: React.FC<AdminCommunicationDashboardProps> = ({
  submissionId = 'demo-submission-id',
  submission,
  onSendCommunication
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Communication System Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">2</div>
              <div className="text-sm text-gray-600">Email Templates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">1</div>
              <div className="text-sm text-gray-600">SMS Templates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">0</div>
              <div className="text-sm text-gray-600">Messages Sent Today</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="test" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="test" className="flex items-center gap-2">
            <TestTube className="w-4 h-4" />
            Test System
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="send" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Send Message
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="test" className="space-y-4">
          <CommunicationTestPanel submissionId={submissionId} />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <CommunicationLogViewer submissionId={submissionId} />
        </TabsContent>

        <TabsContent value="send" className="space-y-4">
          {submission && onSendCommunication ? (
            <PatientCommunicationManager
              submission={submission}
              onSendCommunication={onSendCommunication}
            />
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">Select a submission to send communications</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Resend API Key</span>
                <Badge variant="outline" className="text-orange-600">
                  Not Configured
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Email Domain</span>
                <Badge variant="outline" className="text-orange-600">
                  Needs Setup
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>SMS Provider</span>
                <Badge variant="outline" className="text-blue-600">
                  Simulation Mode
                </Badge>
              </div>
              <div className="text-sm text-gray-600 mt-4 p-4 bg-gray-50 rounded">
                <p className="font-medium mb-2">Next Steps:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Configure Resend API key in Supabase secrets</li>
                  <li>Verify your email domain with Resend</li>
                  <li>Test email delivery functionality</li>
                  <li>Optional: Configure SMS provider for real SMS</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
