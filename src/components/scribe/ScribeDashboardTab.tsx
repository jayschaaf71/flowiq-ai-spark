
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Mic, 
  Clock, 
  TrendingUp, 
  Brain,
  Smartphone,
  ArrowRight,
  Plus,
  Bell
} from "lucide-react";
import { PlaudDeviceStatus } from "./PlaudDeviceStatus";

export const ScribeDashboardTab = () => {
  const handleNavigateToPlaud = () => {
    window.dispatchEvent(new CustomEvent('changeScribeTab', { detail: 'plaud' }));
  };

  const handleNavigateToLive = () => {
    window.dispatchEvent(new CustomEvent('changeScribeTab', { detail: 'transcribe' }));
  };

  const handleNavigateToSOAP = () => {
    window.dispatchEvent(new CustomEvent('changeScribeTab', { detail: 'soap' }));
  };

  const handleNavigateToSettings = () => {
    window.dispatchEvent(new CustomEvent('changeScribeTab', { detail: 'settings' }));
  };

  const handleAddReminder = () => {
    // Navigate to RemindIQ page
    window.location.href = '/agents/remind';
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview - Now Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow duration-200 hover:border-blue-300"
          onClick={handleNavigateToSOAP}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="w-4 h-4" />
              SOAP Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">24</div>
            <p className="text-sm text-gray-600">Generated today</p>
            <p className="text-xs text-blue-600 mt-1 opacity-75">Click to view SOAP generation</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow duration-200 hover:border-green-300"
          onClick={handleNavigateToLive}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Mic className="w-4 h-4" />
              Recordings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">18</div>
            <p className="text-sm text-gray-600">Processed today</p>
            <p className="text-xs text-green-600 mt-1 opacity-75">Click to start recording</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow duration-200 hover:border-primary/30"
          onClick={handleNavigateToSettings}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="w-4 h-4" />
              Avg. Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">2.3s</div>
            <p className="text-sm text-muted-foreground">Per recording</p>
            <p className="text-xs text-primary/70 mt-1">Click to adjust settings</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow duration-200 hover:border-orange-300"
          onClick={handleNavigateToSettings}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="w-4 h-4" />
              Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">98.7%</div>
            <p className="text-sm text-gray-600">Transcription rate</p>
            <p className="text-xs text-orange-600 mt-1 opacity-75">Click to view settings</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plaud Device Status */}
        <PlaudDeviceStatus />

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Start recording or set up your Plaud device
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleNavigateToLive}
              className="w-full justify-start"
              size="lg"
            >
              <Mic className="w-4 h-4 mr-2" />
              Start Live Recording
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Button>
            
            <Button 
              onClick={handleNavigateToPlaud}
              variant="outline"
              className="w-full justify-start"
              size="lg"
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Configure Plaud Device
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Button>
            
            <Button 
              onClick={handleAddReminder}
              variant="outline"
              className="w-full justify-start"
              size="lg"
            >
              <Bell className="w-4 h-4 mr-2" />
              Add Reminder
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Button>

            <div className="pt-4 space-y-2 border-t">
              <h4 className="font-medium text-sm">Pilot Program Features</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Real-time Transcription
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  SOAP Generation
                </Badge>
                <Badge variant="outline" className="border-primary/20 text-primary">
                  Plaud Integration
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transcriptions</CardTitle>
          <CardDescription>Latest voice recordings and generated SOAP notes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Patient Visit #{i + 24}</p>
                    <p className="text-sm text-gray-600">
                      {i === 1 ? 'From Plaud Device' : 'Live Recording'} • 
                      {new Date(Date.now() - i * 3600000).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    SOAP Generated
                  </Badge>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
