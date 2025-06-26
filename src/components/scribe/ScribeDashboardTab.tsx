
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
  ArrowRight
} from "lucide-react";
import { PlaudDeviceStatus } from "./PlaudDeviceStatus";

export const ScribeDashboardTab = () => {
  const handleNavigateToPlaud = () => {
    // Trigger tab change event
    window.dispatchEvent(new CustomEvent('changeScribeTab', { detail: 'plaud' }));
  };

  const handleNavigateToLive = () => {
    window.dispatchEvent(new CustomEvent('changeScribeTab', { detail: 'transcribe' }));
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="w-4 h-4" />
              SOAP Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">24</div>
            <p className="text-sm text-gray-600">Generated today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Mic className="w-4 h-4" />
              Recordings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">18</div>
            <p className="text-sm text-gray-600">Processed today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="w-4 h-4" />
              Avg. Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">2.3s</div>
            <p className="text-sm text-gray-600">Per recording</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="w-4 h-4" />
              Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">98.7%</div>
            <p className="text-sm text-gray-600">Transcription rate</p>
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
              <Brain className="w-5 h-5 text-purple-600" />
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

            <div className="pt-4 space-y-2 border-t">
              <h4 className="font-medium text-sm">Pilot Program Features</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Real-time Transcription
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  SOAP Generation
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
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
