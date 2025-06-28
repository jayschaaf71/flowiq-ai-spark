
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter,
  Download,
  Eye,
  Shield,
  User,
  Database,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Activity
} from 'lucide-react';

interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress: string;
  userAgent: string;
  result: 'success' | 'failure' | 'warning';
  details: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export const SecurityAuditTrail: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const [auditEvents] = useState<AuditEvent[]>([
    {
      id: '1',
      timestamp: '2024-01-20 10:30:15',
      userId: 'user-123',
      userName: 'Dr. Sarah Johnson',
      action: 'PATIENT_RECORD_ACCESS',
      resource: 'patient_records',
      resourceId: 'patient-456',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      result: 'success',
      details: 'Accessed patient record for John Doe (ID: P000123)',
      riskLevel: 'low'
    },
    {
      id: '2',
      timestamp: '2024-01-20 10:28:42',
      userId: 'user-456',
      userName: 'Nurse Emily Davis',
      action: 'MEDICATION_UPDATE',
      resource: 'medications',
      resourceId: 'med-789',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      result: 'success',
      details: 'Updated medication dosage for patient P000123',
      riskLevel: 'medium'
    },
    {
      id: '3',
      timestamp: '2024-01-20 10:25:18',
      userId: 'user-789',
      userName: 'Admin Mike Wilson',
      action: 'FAILED_LOGIN_ATTEMPT',
      resource: 'authentication',
      ipAddress: '203.0.113.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      result: 'failure',
      details: 'Multiple failed login attempts detected',
      riskLevel: 'high'
    },
    {
      id: '4',
      timestamp: '2024-01-20 10:22:33',
      userId: 'user-321',
      userName: 'Dr. Robert Chen',
      action: 'EXPORT_PHI_DATA',
      resource: 'patient_data',
      resourceId: 'export-001',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      result: 'success',
      details: 'Exported patient data for quality review',
      riskLevel: 'high'
    }
  ]);

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failure': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEvents = auditEvents.filter(event => {
    const matchesSearch = event.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || event.result === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-red-600" />
        <div>
          <h2 className="text-2xl font-bold">Security Audit Trail</h2>
          <p className="text-gray-600">Comprehensive logging of all system activities</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">1,247</div>
              <div className="text-sm text-gray-600">Total Events Today</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">98.5%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">3</div>
              <div className="text-sm text-gray-600">High Risk Events</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">47</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Event Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search events by user, action, or details..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('all')}
                size="sm"
              >
                All Events
              </Button>
              <Button
                variant={selectedFilter === 'success' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('success')}
                size="sm"
              >
                Success
              </Button>
              <Button
                variant={selectedFilter === 'failure' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('failure')}
                size="sm"
              >
                Failures
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Events List */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Events</CardTitle>
          <CardDescription>
            Detailed log of all system activities and security events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredEvents.map((event) => (
              <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getResultIcon(event.result)}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{event.action.replace(/_/g, ' ')}</span>
                        <Badge className={getRiskColor(event.riskLevel)}>
                          {event.riskLevel} risk
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        {event.details}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {event.userName}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.timestamp}
                        </div>
                        <div className="flex items-center gap-1">
                          <Database className="h-3 w-3" />
                          {event.ipAddress}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-time Security Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">Normal</div>
              <div className="text-sm text-gray-600">System Status</div>
            </div>
            
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Monitoring Active</div>
            </div>
            
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">2.3s</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
