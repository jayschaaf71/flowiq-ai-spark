
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  Send,
  AlertTriangle,
  Zap,
  BarChart3
} from 'lucide-react';

interface Claim {
  id: string;
  claimNumber: string;
  patientName: string;
  serviceDate: string;
  amount: number;
  status: 'draft' | 'submitted' | 'paid' | 'denied' | 'pending';
  payer: string;
  daysInAR: number;
  priority: 'low' | 'medium' | 'high';
}

export const ClaimsManagementHub: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const claims: Claim[] = [
    {
      id: '1',
      claimNumber: 'CLM-2024-001',
      patientName: 'Sarah Johnson',
      serviceDate: '2024-01-15',
      amount: 450.00,
      status: 'submitted',
      payer: 'Blue Cross Blue Shield',
      daysInAR: 5,
      priority: 'medium'
    },
    {
      id: '2',
      claimNumber: 'CLM-2024-002',
      patientName: 'Mike Chen',
      serviceDate: '2024-01-14',
      amount: 275.00,
      status: 'paid',
      payer: 'Aetna',
      daysInAR: 0,
      priority: 'low'
    },
    {
      id: '3',
      claimNumber: 'CLM-2024-003',
      patientName: 'Emily Davis',
      serviceDate: '2024-01-12',
      amount: 680.00,
      status: 'denied',
      payer: 'Cigna',
      daysInAR: 8,
      priority: 'high'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'paid': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'denied': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'denied': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = claim.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || claim.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-8 w-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold">Claims Management Hub</h2>
          <p className="text-gray-600">Manage and track insurance claims</p>
        </div>
      </div>

      {/* Claims Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">$2,450</div>
              <div className="text-sm text-gray-600">Total Collected Today</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">23</div>
              <div className="text-sm text-gray-600">Claims Submitted</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">3</div>
              <div className="text-sm text-gray-600">Denied Claims</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">15.2</div>
              <div className="text-sm text-gray-600">Avg Days in A/R</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Claim Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search claims by patient name or claim number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={selectedStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('all')}
                size="sm"
              >
                All Claims
              </Button>
              <Button
                variant={selectedStatus === 'submitted' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('submitted')}
                size="sm"
              >
                Submitted
              </Button>
              <Button
                variant={selectedStatus === 'denied' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('denied')}
                size="sm"
              >
                Denied
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Claims List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Claims</CardTitle>
          <CardDescription>
            Monitor and manage all insurance claims
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredClaims.map((claim) => (
              <div key={claim.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(claim.status)}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{claim.claimNumber}</span>
                        <Badge className={getStatusColor(claim.status)}>
                          {claim.status}
                        </Badge>
                        <Badge className={getPriorityColor(claim.priority)}>
                          {claim.priority} priority
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        Patient: {claim.patientName} | Service Date: {claim.serviceDate}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Payer: {claim.payer}</span>
                        <span>Amount: ${claim.amount.toFixed(2)}</span>
                        <span>Days in A/R: {claim.daysInAR}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Send className="h-4 w-4 mr-2" />
                      Resubmit
                    </Button>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              AI Claim Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Automated claim generation and error detection
              </p>
              <Button className="w-full">
                Generate AI Claims
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Batch Operations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Process multiple claims simultaneously
              </p>
              <Button variant="outline" className="w-full">
                Batch Submit
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Denial Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Review and appeal denied claims
              </p>
              <Button variant="outline" className="w-full">
                Review Denials
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
