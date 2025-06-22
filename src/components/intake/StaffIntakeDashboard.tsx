
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Bell, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Users, 
  Filter,
  Search,
  Mail,
  Phone,
  UserCheck,
  Calendar
} from 'lucide-react';
import { useIntakeSubmissions } from '@/hooks/useIntakeSubmissions';
import { FormSubmissionsList } from './FormSubmissionsList';
import { IntakeAnalyticsDashboard } from './IntakeAnalyticsDashboard';
import { EnhancedAnalyticsDashboard } from './EnhancedAnalyticsDashboard';

export const StaffIntakeDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  
  const { 
    submissions, 
    isLoading, 
    assignStaff, 
    sendCommunication, 
    updateStatus,
    isAssigning,
    isSendingCommunication,
    isUpdatingStatus
  } = useIntakeSubmissions();

  // Filter submissions based on status and filters
  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      submission.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.patient_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = priorityFilter === 'all' || submission.priority_level === priorityFilter;
    const matchesStatus = activeTab === 'all' || submission.status === activeTab;
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getStatusCounts = () => {
    return {
      pending: submissions.filter(s => s.status === 'pending').length,
      completed: submissions.filter(s => s.status === 'completed').length,
      high_priority: submissions.filter(s => s.priority_level === 'high').length,
      total: submissions.length
    };
  };

  const statusCounts = getStatusCounts();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-orange-600">{statusCounts.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-600">{statusCounts.high_priority}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processed</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-blue-600">{statusCounts.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by patient name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="normal">Normal Priority</SelectItem>
              </SelectContent>
            </Select>
            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger className="w-48">
                <UserCheck className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Staff</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                <SelectItem value="nurse-johnson">Nurse Johnson</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pending">
            Pending ({statusCounts.pending})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({statusCounts.completed})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({statusCounts.total})
          </TabsTrigger>
          <TabsTrigger value="analytics">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="notifications">
            Communications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-600" />
                Submissions Requiring Review
              </CardTitle>
              <CardDescription>
                New patient intake forms that need staff attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormSubmissionsList 
                submissions={filteredSubmissions} 
                onViewSubmission={(submission) => console.log('View:', submission)}
                showActions={true}
                onAssignToStaff={assignStaff}
                onSendCommunication={sendCommunication}
                isAssigning={isAssigning}
                isSendingCommunication={isSendingCommunication}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Processed Submissions
              </CardTitle>
              <CardDescription>
                Successfully reviewed and processed intake forms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormSubmissionsList 
                submissions={filteredSubmissions} 
                onViewSubmission={(submission) => console.log('View:', submission)}
                showActions={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <FormSubmissionsList 
            submissions={filteredSubmissions} 
            onViewSubmission={(submission) => console.log('View:', submission)}
            showActions={true}
            onAssignToStaff={assignStaff}
            onSendCommunication={sendCommunication}
            isAssigning={isAssigning}
            isSendingCommunication={isSendingCommunication}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <EnhancedAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Communication Center</CardTitle>
              <CardDescription>
                Send follow-ups and manage patient communications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="h-24 flex flex-col items-center justify-center">
                    <Mail className="w-6 h-6 mb-2" />
                    Send Bulk Reminders
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <Phone className="w-6 h-6 mb-2" />
                    Schedule Callbacks
                  </Button>
                </div>
                <div className="text-sm text-gray-600">
                  <p>• {statusCounts.pending} patients have incomplete forms</p>
                  <p>• {statusCounts.high_priority} high-priority submissions need immediate attention</p>
                  <p>• 8 follow-up emails scheduled for today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
