
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  Clock, 
  Calendar,
  RefreshCw,
  CheckCircle,
  XCircle 
} from "lucide-react";

interface Conflict {
  id: string;
  title: string;
  time: string;
  duration: number;
  type: 'overlap' | 'back-to-back' | 'buffer-violation';
  severity: 'high' | 'medium' | 'low';
}

interface ConflictResolutionProps {
  conflicts: Conflict[];
  onResolve: (conflictId: string, resolution: 'reschedule' | 'override' | 'modify') => void;
  onRefresh: () => void;
  loading?: boolean;
}

export const ConflictResolution = ({ 
  conflicts, 
  onResolve, 
  onRefresh, 
  loading = false 
}: ConflictResolutionProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getConflictIcon = (type: string) => {
    switch (type) {
      case 'overlap': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'back-to-back': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'buffer-violation': return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getConflictDescription = (type: string) => {
    switch (type) {
      case 'overlap': return 'Direct time overlap with existing appointment';
      case 'back-to-back': return 'No buffer time between appointments';
      case 'buffer-violation': return 'Insufficient buffer time (less than 15 minutes)';
      default: return 'Scheduling conflict detected';
    }
  };

  if (conflicts.length === 0) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          No scheduling conflicts detected. This time slot is available.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <AlertTriangle className="h-5 w-5" />
          Scheduling Conflicts Detected ({conflicts.length})
        </CardTitle>
        <div className="flex justify-between items-center">
          <p className="text-sm text-orange-600">
            Please resolve conflicts before confirming the appointment
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {conflicts.map((conflict) => (
          <div key={conflict.id} className="border rounded-lg p-4 bg-white">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {getConflictIcon(conflict.type)}
                <div>
                  <h4 className="font-medium">{conflict.title}</h4>
                  <p className="text-sm text-gray-600">
                    {conflict.time} • {conflict.duration} minutes
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {getConflictDescription(conflict.type)}
                  </p>
                </div>
              </div>
              <Badge className={getSeverityColor(conflict.severity)}>
                {conflict.severity} priority
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onResolve(conflict.id, 'reschedule')}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Calendar className="h-3 w-3 mr-1" />
                Reschedule
              </Button>
              
              {conflict.severity !== 'high' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onResolve(conflict.id, 'override')}
                  className="text-orange-600 border-orange-200 hover:bg-orange-50"
                >
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Override
                </Button>
              )}
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => onResolve(conflict.id, 'modify')}
                className="text-green-600 border-green-200 hover:bg-green-50"
              >
                <Clock className="h-3 w-3 mr-1" />
                Modify Time
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
