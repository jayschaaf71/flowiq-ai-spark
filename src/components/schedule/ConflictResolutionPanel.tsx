
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Clock, Users, Zap } from "lucide-react";
import { aiSchedulingService, ConflictResolution } from "@/services/aiSchedulingService";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";

interface ConflictResolutionPanelProps {
  date: string;
  onConflictsResolved: () => void;
}

export const ConflictResolutionPanel = ({ date, onConflictsResolved }: ConflictResolutionPanelProps) => {
  const [conflictData, setConflictData] = useState<ConflictResolution | null>(null);
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState<string | null>(null);
  const { toast } = useToast();

  const loadConflicts = async () => {
    setLoading(true);
    try {
      const conflicts = await aiSchedulingService.detectAndResolveConflicts(date);
      setConflictData(conflicts);
    } catch (error) {
      console.error('Error loading conflicts:', error);
      toast({
        title: "Error",
        description: "Failed to analyze schedule conflicts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resolveConflict = async (resolutionId: string) => {
    setResolving(resolutionId);
    try {
      // Simulate resolution process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Remove resolved conflict from the list
      setConflictData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          resolutions: prev.resolutions.filter(r => r.conflictId !== resolutionId),
          conflicts: prev.conflicts.filter(c => c.id !== resolutionId.replace('conflict_', '')),
          autoResolved: prev.autoResolved + 1
        };
      });

      toast({
        title: "Conflict Resolved",
        description: "Schedule conflict has been automatically resolved",
      });

      onConflictsResolved();
    } catch (error) {
      console.error('Error resolving conflict:', error);
      toast({
        title: "Resolution Error", 
        description: "Failed to resolve conflict",
        variant: "destructive"
      });
    } finally {
      setResolving(null);
    }
  };

  const resolveAllConflicts = async () => {
    if (!conflictData) return;

    setResolving('all');
    try {
      for (const resolution of conflictData.resolutions) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setConflictData(prev => prev ? {
        ...prev,
        conflicts: [],
        resolutions: [],
        autoResolved: prev.conflicts.length
      } : null);

      toast({
        title: "All Conflicts Resolved",
        description: `Successfully resolved ${conflictData.conflicts.length} schedule conflicts`,
      });

      onConflictsResolved();
    } catch (error) {
      console.error('Error resolving all conflicts:', error);
      toast({
        title: "Resolution Error",
        description: "Failed to resolve some conflicts",
        variant: "destructive"
      });
    } finally {
      setResolving(null);
    }
  };

  useEffect(() => {
    loadConflicts();
  }, [date]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Conflict Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Analyzing schedule for conflicts...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!conflictData || conflictData.conflicts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Schedule Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              No scheduling conflicts detected for {format(parseISO(date), 'EEEE, MMMM d, yyyy')}. 
              Your schedule is optimized and conflict-free.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          Schedule Conflicts Detected
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium">Total Conflicts</span>
            </div>
            <div className="text-2xl font-bold text-red-700">
              {conflictData.conflicts.length}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Auto-Resolvable</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">
              {conflictData.autoResolved}
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Manual Review</span>
            </div>
            <div className="text-2xl font-bold text-yellow-700">
              {conflictData.manualReviewRequired}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            onClick={resolveAllConflicts}
            disabled={resolving === 'all'}
            className="bg-green-600 hover:bg-green-700"
          >
            {resolving === 'all' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Resolving All...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Resolve All Conflicts
              </>
            )}
          </Button>
          <Button variant="outline" onClick={loadConflicts}>
            Refresh Analysis
          </Button>
        </div>

        {/* Conflict Details */}
        <div className="space-y-4">
          <h4 className="font-medium">Conflict Details</h4>
          {conflictData.resolutions.map((resolution) => (
            <div key={resolution.conflictId} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="text-xs">
                    {resolution.conflictId.replace('conflict_', 'Conflict ')}
                  </Badge>
                  <Badge variant="outline">Double Booking</Badge>
                </div>
                <Button
                  size="sm"
                  onClick={() => resolveConflict(resolution.conflictId)}
                  disabled={resolving === resolution.conflictId}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {resolving === resolution.conflictId ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                      Resolving...
                    </>
                  ) : (
                    'Resolve'
                  )}
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  <strong>AI Resolution:</strong> {resolution.resolution}
                </p>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Alternative slots: {resolution.alternativeSlots.join(', ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
