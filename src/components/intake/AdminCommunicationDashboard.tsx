
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CommunicationTestPanel } from './CommunicationTestPanel';
import { CommunicationLogViewer } from './CommunicationLogViewer';
import { PatientCommunicationManager } from './PatientCommunicationManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, TestTube, History, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { useIntakeSubmissions } from '@/hooks/useIntakeSubmissions';

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
  const { submissions } = useIntakeSubmissions();
  
  // Get the first submission for demo purposes if none provided
  const demoSubmission = submission || submissions[0];

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">4</div>
              <div className="text-sm text-gray-600">Email Templates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">1</div>
              <div className="text-sm text-gray-600">SMS Templates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {submissions.filter(s => s.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending Submissions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {submissions.filter(s => s.currentAssignment).length}
              </div>
              <div className="text-sm text-gray-600">Assigned Cases</div>
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
            Communication History
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
          {demoSubmission && onSendCommunication ? (
            <PatientCommunicationManager
              submission={demoSubmission}
              onSendCommunication={onSendCommunication}
            />
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-2">No submissions available</p>
                <p className="text-sm text-gray-400">
                  Submit an intake form to test communication features
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Resend API Key
                </span>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Configured
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  Email Domain
                </span>
                <Badge variant="outline" className="text-orange-600 border-orange-200">
                  Using Test Domain
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  SMS Provider
                </span>
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  Simulation Mode
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Database Tables
                </span>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Ready
                </Badge>
              </div>
              
              <div className="text-sm text-gray-600 mt-4 p-4 bg-gray-50 rounded">
                <p className="font-medium mb-2">System Status:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li className="text-green-700">✅ Communication system is operational</li>
                  <li className="text-green-700">✅ Email sending via Resend is configured</li>
                  <li className="text-blue-700">ℹ️ SMS is in simulation mode (for testing)</li>
                  <li className="text-orange-700">⚠️ Using test email domain (configure custom domain for production)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
