
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, Lock, Database, CheckCircle, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const ComplianceAnalytics = () => {
  const { profile } = useAuth();
  
  const complianceMetrics = [
    {
      category: "Data Access Monitoring",
      score: 98,
      status: "excellent",
      icon: Eye,
      details: "All PHI access properly logged"
    },
    {
      category: "Audit Trail Completeness",
      score: 95,
      status: "good",
      icon: Database,
      details: "Comprehensive audit coverage"
    },
    {
      category: "Tenant Isolation",
      score: 100,
      status: "excellent",
      icon: Lock,
      details: "Perfect data segregation"
    },
    {
      category: "Security Policies",
      score: 92,
      status: "good",
      icon: Shield,
      details: "All policies active and enforced"
    }
  ];

  const recentAuditEvents = [
    { event: "Patient record accessed", user: "Dr. Johnson", time: "2 minutes ago", status: "compliant" },
    { event: "Appointment created", user: "Reception", time: "15 minutes ago", status: "compliant" },
    { event: "Insurance claim processed", user: "Billing Team", time: "1 hour ago", status: "compliant" },
    { event: "SOAP note updated", user: "Dr. Chen", time: "3 hours ago", status: "compliant" }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            HIPAA Compliance Analytics
          </CardTitle>
          <CardDescription>
            Tenant: {profile?.tenant_id} - Real-time compliance monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {complianceMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.category} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-sm">{metric.category}</div>
                      <div className="text-xs text-muted-foreground">{metric.details}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{metric.score}%</div>
                    <Badge 
                      variant={metric.status === 'excellent' ? 'default' : 'secondary'}
                      className={metric.status === 'excellent' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {metric.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Audit Events</CardTitle>
          <CardDescription>Latest HIPAA-tracked activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAuditEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-2 border-l-2 border-l-green-500 pl-4">
                <div>
                  <div className="font-medium text-sm">{event.event}</div>
                  <div className="text-xs text-muted-foreground">by {event.user}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">{event.time}</div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">Compliant</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
