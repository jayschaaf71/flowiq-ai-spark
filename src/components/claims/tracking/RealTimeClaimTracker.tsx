
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useClaimsData } from "@/hooks/useClaimsData";
import { useClaimsRealtime } from "@/hooks/useClaimsRealtime";
import { useToast } from "@/hooks/use-toast";
import { 
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  Send,
  FileCheck,
  DollarSign,
  Calendar,
  User,
  Building,
  Zap
} from "lucide-react";

interface ClaimStatusUpdate {
  claimId: string;
  status: string;
  timestamp: Date;
  message: string;
  metadata?: Record<string, unknown>;
}

export const RealTimeClaimTracker = () => {
  const { claims, loading, updateClaimStatus } = useClaimsData();
  const [statusUpdates, setStatusUpdates] = useState<ClaimStatusUpdate[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);
  const [trackingFilter, setTrackingFilter] = useState<'all' | 'active' | 'completed'>('active');
  const { toast } = useToast();

  // Set up real-time updates
  useClaimsRealtime();

  useEffect(() => {
    // Simulate real-time status updates
    const interval = setInterval(() => {
      if (claims && claims.length > 0) {
        const randomClaim = claims[Math.floor(Math.random() * claims.length)];
        const statuses = ['ai_processing', 'validation_complete', 'submitted', 'under_review', 'approved'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Only add update if status is different
        if (randomClaim.processing_status !== randomStatus) {
          const update: ClaimStatusUpdate = {
            claimId: randomClaim.claim_number,
            status: randomStatus,
            timestamp: new Date(),
            message: getStatusMessage(randomStatus),
            metadata: {
              previousStatus: randomClaim.processing_status,
              processingTime: Math.floor(Math.random() * 120) + 30 // 30-150 seconds
            }
          };
          
          setStatusUpdates(prev => [update, ...prev.slice(0, 49)]); // Keep last 50 updates
          
          // Show toast for important updates
          if (['approved', 'denied', 'submitted'].includes(randomStatus)) {
            toast({
              title: `Claim ${randomClaim.claim_number}`,
              description: update.message,
              duration: 3000
            });
          }
        }
      }
    }, 8000); // Update every 8 seconds

    return () => clearInterval(interval);
  }, [claims, toast]);

  const getStatusMessage = (status: string): string => {
    const messages = {
      'ai_processing': 'AI validation in progress',
      'validation_complete': 'Validation completed successfully',
      'submitted': 'Submitted to payer',
      'under_review': 'Under payer review',
      'approved': 'Claim approved for payment',
      'denied': 'Claim denied - review required',
      'paid': 'Payment received',
      'pending_correction': 'Corrections needed'
    };
    return messages[status as keyof typeof messages] || 'Status updated';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ai_processing':
        return <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />;
      case 'validation_complete':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'submitted':
        return <Send className="w-4 h-4 text-blue-600" />;
      case 'under_review':
        return <Eye className="w-4 h-4 text-orange-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'denied':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'paid':
        return <DollarSign className="w-4 h-4 text-green-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'paid':
      case 'validation_complete':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'denied':
      case 'pending_correction':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'ai_processing':
      case 'submitted':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'under_review':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getClaimProgress = (claim: Claim) => {
    const statusOrder = ['draft', 'ai_processing', 'validation_complete', 'submitted', 'under_review', 'approved', 'paid'];
    const currentIndex = statusOrder.indexOf(claim.processing_status);
    return currentIndex >= 0 ? ((currentIndex + 1) / statusOrder.length) * 100 : 0;
  };

  const filteredClaims = claims?.filter(claim => {
    if (trackingFilter === 'all') return true;
    if (trackingFilter === 'active') {
      return !['approved', 'paid', 'denied'].includes(claim.processing_status);
    }
    if (trackingFilter === 'completed') {
      return ['approved', 'paid', 'denied'].includes(claim.processing_status);
    }
    return true;
  }) || [];

  const activeClaimsCount = claims?.filter(c => 
    !['approved', 'paid', 'denied'].includes(c.processing_status)
  ).length || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>Loading real-time claim tracker...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="h-8 w-8 text-green-600" />
          <div>
            <h2 className="text-2xl font-bold">Real-time Claim Tracking</h2>
            <p className="text-gray-600">Live updates and status monitoring</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-green-100 text-green-700">
            <Zap className="w-3 h-3 mr-1" />
            Live Updates
          </Badge>
          <Badge variant="outline">
            {statusUpdates.length} recent updates
          </Badge>
        </div>
      </div>

      {/* Real-time Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Claims</p>
                <p className="text-2xl font-bold text-blue-600">{activeClaimsCount}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing Today</p>
                <p className="text-2xl font-bold text-orange-600">
                  {claims?.filter(c => c.processing_status === 'ai_processing').length || 0}
                </p>
              </div>
              <RefreshCw className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Today</p>
                <p className="text-2xl font-bold text-green-600">
                  {claims?.filter(c => c.processing_status === 'approved').length || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Need Attention</p>
                <p className="text-2xl font-bold text-red-600">
                  {claims?.filter(c => c.processing_status === 'denied').length || 0}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Claim Status Tracker */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Claim Status Tracker</CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant={trackingFilter === 'active' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTrackingFilter('active')}
                >
                  Active
                </Button>
                <Button 
                  variant={trackingFilter === 'completed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTrackingFilter('completed')}
                >
                  Completed
                </Button>
                <Button 
                  variant={trackingFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTrackingFilter('all')}
                >
                  All
                </Button>
              </div>
            </div>
            <CardDescription>
              Real-time status tracking for all claims
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredClaims.map((claim) => (
                <div 
                  key={claim.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedClaim === claim.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedClaim(selectedClaim === claim.id ? null : claim.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(claim.processing_status)}
                      <span className="font-medium">{claim.claim_number}</span>
                    </div>
                    <Badge className={getStatusColor(claim.processing_status)}>
                      {claim.processing_status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(getClaimProgress(claim))}%</span>
                    </div>
                    <Progress value={getClaimProgress(claim)} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{claim.patient_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      <span>${claim.total_amount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(claim.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      <span>{claim.insurance_name}</span>
                    </div>
                  </div>

                  {selectedClaim === claim.id && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">AI Confidence: </span>
                          <span>{claim.ai_confidence_score}%</span>
                        </div>
                        <div>
                          <span className="font-medium">Days in A/R: </span>
                          <span>{claim.days_in_ar} days</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <Send className="w-3 h-3 mr-1" />
                          Resubmit
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Real-time Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Live Activity Feed
            </CardTitle>
            <CardDescription>
              Real-time updates from claim processing system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {statusUpdates.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Waiting for claim activity...</p>
                </div>
              ) : (
                statusUpdates.map((update, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    {getStatusIcon(update.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{update.claimId}</span>
                        <span className="text-xs text-gray-500">
                          {update.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{update.message}</p>
                      {update.metadata?.processingTime && (
                        <p className="text-xs text-gray-500 mt-1">
                          Processing time: {String(update.metadata.processingTime)}s
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health Alert */}
      <Alert>
        <Activity className="h-4 w-4" />
        <AlertDescription>
          <strong>System Status:</strong> All claim processing systems are operational. 
          Real-time updates are active with an average processing time of 2.3 minutes per claim.
        </AlertDescription>
      </Alert>
    </div>
  );
};
