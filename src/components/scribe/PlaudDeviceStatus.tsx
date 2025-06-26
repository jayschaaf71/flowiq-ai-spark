
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Battery, 
  CheckCircle, 
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { usePlaudIntegration } from "@/hooks/usePlaudIntegration";

export const PlaudDeviceStatus = () => {
  const { 
    isConnected, 
    config, 
    recordings, 
    isPolling, 
    manualSync 
  } = usePlaudIntegration();

  const recentRecordings = recordings.slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-blue-600" />
          Plaud Device Status
        </CardTitle>
        <CardDescription>
          Real-time connection status and recent activity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              isConnected ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {isConnected ? (
                <Wifi className="w-5 h-5 text-green-600" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div>
              <p className="font-medium">
                {isConnected ? 'Connected' : 'Disconnected'}
              </p>
              <p className="text-sm text-gray-600">
                {isConnected 
                  ? `Auto-sync ${isPolling ? 'enabled' : 'disabled'}` 
                  : 'Connect your Plaud device'
                }
              </p>
            </div>
          </div>
          {isConnected && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={manualSync}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Sync Now
            </Button>
          )}
        </div>

        {isConnected && recentRecordings.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Recent Recordings</h4>
            {recentRecordings.map((recording) => (
              <div key={recording.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">{recording.filename}</p>
                  <p className="text-xs text-gray-600">
                    {new Date(recording.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {recording.processed ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Processed
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Processing
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isConnected && (
          <div className="text-center py-6 text-gray-500">
            <Smartphone className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No Plaud device connected</p>
            <p className="text-sm">Go to the Plaud Device tab to set up your connection</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
