
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  TrendingUp,
  Plus,
  Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIntakeForms } from "@/hooks/useIntakeForms";

export const IntakeDashboard = () => {
  const navigate = useNavigate();
  const { forms, submissions } = useIntakeForms();

  const stats = {
    formsProcessed: submissions?.length || 0,
    avgCompletionTime: "8.5 min",
    completionRate: 94,
    pendingReviews: submissions?.filter(s => s.status === 'partial')?.length || 0
  };

  const recentActivity = [
    { time: "3 min ago", action: "Processed intake form for Maria Garcia", type: "completion" },
    { time: "7 min ago", action: "Sent reminder to 5 incomplete forms", type: "reminder" },
    { time: "12 min ago", action: "Generated new patient packet for Dr. Smith", type: "generation" },
    { time: "18 min ago", action: "Flagged incomplete insurance info for review", type: "flag" },
    { time: "25 min ago", action: "Auto-filled patient data from previous visit", type: "automation" }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "completion": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "reminder": return <Clock className="w-4 h-4 text-blue-600" />;
      case "generation": return <FileText className="w-4 h-4 text-purple-600" />;
      case "flag": return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case "automation": return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleCreateNewForm = () => {
    // Navigate to form builder tab
    const currentUrl = new URL(window.location.href);
    currentUrl.hash = '';
    window.history.pushState({}, '', currentUrl.toString());
    
    // Trigger tab change by dispatching a custom event
    const event = new CustomEvent('changeIntakeTab', { detail: 'builder' });
    window.dispatchEvent(event);
  };

  const handleReviewForms = () => {
    // Navigate to submissions tab
    const event = new CustomEvent('changeIntakeTab', { detail: 'submissions' });
    window.dispatchEvent(event);
  };

  const handleGeneratePackets = () => {
    // Navigate to templates tab
    const event = new CustomEvent('changeIntakeTab', { detail: 'templates' });
    window.dispatchEvent(event);
  };

  const handleViewAnalytics = () => {
    // Navigate to analytics tab
    const event = new CustomEvent('changeIntakeTab', { detail: 'analytics' });
    window.dispatchEvent(event);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Forms Today</p>
                <p className="text-2xl font-bold">{stats.formsProcessed}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Time</p>
                <p className="text-2xl font-bold">{stats.avgCompletionTime}</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{stats.completionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <Progress value={stats.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{stats.pendingReviews}</p>
              </div>
              <Users className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest intake form processing actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common intake management tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={handleCreateNewForm}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Form Template
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={handleReviewForms}
            >
              <Eye className="w-4 h-4 mr-2" />
              Review Flagged Forms
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={handleGeneratePackets}
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Patient Packets
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={handleViewAnalytics}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              View Analytics Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
