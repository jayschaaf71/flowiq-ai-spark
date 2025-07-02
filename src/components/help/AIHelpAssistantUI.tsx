import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Sparkles, 
  Settings,
  Users,
  Calendar,
  FileText,
  DollarSign,
  Bell,
  Search,
  HelpCircle
} from 'lucide-react';

interface AIHelpAssistantUIProps {
  quickQuestions: string[];
  onQuickQuestion: (question: string) => void;
}

export const AIHelpAssistantUI: React.FC<AIHelpAssistantUIProps> = ({
  quickQuestions,
  onQuickQuestion
}) => {
  return (
    <>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">FlowiQ AI Assistant</h2>
              <p className="text-sm text-gray-600 font-normal">Get instant help with any FlowiQ feature</p>
            </div>
            <Badge variant="outline" className="ml-auto">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* AI Capabilities Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="w-5 h-5" />
            AI Assistant Capabilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-3 border rounded-lg bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Patient Management</h3>
              </div>
              <p className="text-xs text-blue-700">Add, update, search patients. View patient records and history.</p>
            </div>
            
            <div className="p-3 border rounded-lg bg-gradient-to-r from-green-50 to-green-100">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-green-600" />
                <h3 className="font-semibold text-green-900">Scheduling</h3>
              </div>
              <p className="text-xs text-green-700">Create, update, cancel appointments. Check availability and conflicts.</p>
            </div>
            
            <div className="p-3 border rounded-lg bg-gradient-to-r from-purple-50 to-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <h3 className="font-semibold text-purple-900">Intake Forms</h3>
              </div>
              <p className="text-xs text-purple-700">View submissions, create forms, process patient intake data.</p>
            </div>
            
            <div className="p-3 border rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-yellow-600" />
                <h3 className="font-semibold text-yellow-900">Claims Processing</h3>
              </div>
              <p className="text-xs text-yellow-700">Monitor claims, check status, view analytics and processing data.</p>
            </div>
            
            <div className="p-3 border rounded-lg bg-gradient-to-r from-red-50 to-red-100">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-4 h-4 text-red-600" />
                <h3 className="font-semibold text-red-900">Notifications</h3>
              </div>
              <p className="text-xs text-red-700">Send SMS/email notifications, reminders, and alerts to patients.</p>
            </div>
            
            <div className="p-3 border rounded-lg bg-gradient-to-r from-indigo-50 to-indigo-100">
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-4 h-4 text-indigo-600" />
                <h3 className="font-semibold text-indigo-900">Smart Search</h3>
              </div>
              <p className="text-xs text-indigo-700">Find patients, appointments, forms, and data across all systems.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Quick Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onQuickQuestion(question)}
                className="justify-start text-left h-auto py-2 px-3"
              >
                {question}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};