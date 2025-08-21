import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Users, 
  DollarSign, 
  FileText, 
  RefreshCw,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Calendar,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { sleepImpressionsETL } from '@/services/sleepImpressionsETL';

interface ETLStats {
  totalRecords: number;
  patientVisits: number;
  billingRecords: number;
  claimsRecords: number;
  insuranceRecords: number;
  lastProcessed: string;
  status: 'processing' | 'completed' | 'error';
}

interface PatientData {
  id: string;
  patientName: string;
  visitDate: string;
  insurance: string;
  stage: string;
  claimAmount?: number;
  email?: string;
  phone?: string;
  location?: string;
}

interface ClaimsData {
  id: string;
  patientName: string;
  claimNumber: string;
  claimDate: string;
  totalCharge: number;
  status: string;
  payer: string;
  denialCode?: string;
}

export default function SleepImpressionsDashboard() {
  const [etlStats, setEtlStats] = useState<ETLStats>({
    totalRecords: 0,
    patientVisits: 0,
    billingRecords: 0,
    claimsRecords: 0,
    insuranceRecords: 0,
    lastProcessed: '',
    status: 'completed'
  });

  const [recentPatients, setRecentPatients] = useState<PatientData[]>([]);
  const [claimsData, setClaimsData] = useState<ClaimsData[]>([]);
  const [revenueInsights, setRevenueInsights] = useState({
    totalValue: 0,
    collectionsRate: 0,
    pendingClaims: 0
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load all data in parallel
      const [stats, patients, claims, revenue] = await Promise.all([
        sleepImpressionsETL.getETLStats(),
        sleepImpressionsETL.getRecentPatients(10),
        sleepImpressionsETL.getClaimsData(10),
        sleepImpressionsETL.getRevenueInsights()
      ]);

      setEtlStats(stats);
      setRecentPatients(patients);
      setClaimsData(claims);
      setRevenueInsights(revenue);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  const handleTriggerETL = async () => {
    try {
      const result = await sleepImpressionsETL.triggerETLProcess();
      if (result.success) {
        await loadDashboardData();
      }
    } catch (error) {
      console.error('Error triggering ETL:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStageBadge = (stage: string) => {
    const stageColors: Record<string, string> = {
      'bill_completed': 'bg-green-100 text-green-800',
      'bill_submitted': 'bg-blue-100 text-blue-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'denied': 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={stageColors[stage] || 'bg-gray-100 text-gray-800'}>
        {stage.replace('_', ' ')}
      </Badge>
    );
  };

  const getClaimStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'denied': 'bg-red-100 text-red-800',
      'paid': 'bg-green-100 text-green-800'
    };
    
    return (
      <Badge className={statusColors[status] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading Sleep Impressions data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sleep Impressions Integration</h1>
          <p className="text-gray-600">Real-time data from Sleep Impressions ETL pipeline</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleTriggerETL} disabled={isRefreshing}>
            <Activity className="h-4 w-4 mr-2" />
            Trigger ETL
          </Button>
        </div>
      </div>

      {/* ETL Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(etlStats.status)}
            ETL Pipeline Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{etlStats.totalRecords.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Records</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{etlStats.patientVisits.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Patient Visits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{etlStats.billingRecords.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Billing Records</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{etlStats.claimsRecords.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Claims Records</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Last processed: {etlStats.lastProcessed ? new Date(etlStats.lastProcessed).toLocaleString() : 'Never'}
          </div>
        </CardContent>
      </Card>

      {/* Data Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Patients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Patient Visits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPatients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{patient.patientName}</div>
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {patient.visitDate}
                      <span className="mx-1">•</span>
                      {patient.insurance}
                    </div>
                    {patient.email && (
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Mail className="h-3 w-3" />
                        {patient.email}
                      </div>
                    )}
                    {patient.phone && (
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {patient.phone}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    {getStageBadge(patient.stage)}
                    {patient.claimAmount && (
                      <div className="text-sm font-medium text-green-600 mt-1">
                        ${patient.claimAmount.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Revenue Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Total Claims Value</span>
                  <span className="font-medium">${revenueInsights.totalValue.toLocaleString()}</span>
                </div>
                <Progress value={75} className="mt-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Collections Rate</span>
                  <span className="font-medium">{revenueInsights.collectionsRate}%</span>
                </div>
                <Progress value={revenueInsights.collectionsRate} className="mt-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Pending Claims</span>
                  <span className="font-medium">{revenueInsights.pendingClaims}</span>
                </div>
                <Progress value={25} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Claims Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Claims
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {claimsData.map((claim) => (
              <div key={claim.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{claim.patientName}</div>
                  <div className="text-sm text-gray-600">
                    Claim #{claim.claimNumber} • {claim.payer}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(claim.claimDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  {getClaimStatusBadge(claim.status)}
                  <div className="text-sm font-medium text-green-600 mt-1">
                    ${claim.totalCharge.toFixed(2)}
                  </div>
                  {claim.denialCode && (
                    <div className="text-xs text-red-600">
                      Denial: {claim.denialCode}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integration Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            FlowIQ Integration Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <FileText className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="font-medium">Auto Claims Processing</div>
              <div className="text-sm text-gray-600">Processes new claims automatically</div>
              <Badge className="mt-2 bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="font-medium">Patient Sync</div>
              <div className="text-sm text-gray-600">Syncs patient data in real-time</div>
              <Badge className="mt-2 bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <div className="font-medium">Revenue Tracking</div>
              <div className="text-sm text-gray-600">Tracks revenue and collections</div>
              <Badge className="mt-2 bg-green-100 text-green-800">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
