
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText,
  Lock,
  Eye,
  Download,
  AlertCircle,
  TrendingUp
} from "lucide-react";

interface ComplianceItem {
  id: string;
  category: string;
  requirement: string;
  status: 'compliant' | 'warning' | 'violation';
  lastChecked: string;
  description: string;
}

export const EHRComplianceMonitor = () => {
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([
    {
      id: "1",
      category: "HIPAA",
      requirement: "Data Encryption at Rest",
      status: "compliant",
      lastChecked: "2024-01-15 09:00",
      description: "All patient data is encrypted using AES-256 encryption"
    },
    {
      id: "2", 
      category: "HIPAA",
      requirement: "Access Audit Logs",
      status: "compliant",
      lastChecked: "2024-01-15 08:30",
      description: "All data access is logged and monitored"
    },
    {
      id: "3",
      category: "HITECH",
      requirement: "Breach Notification",
      status: "warning",
      lastChecked: "2024-01-14 16:45",
      description: "Automated breach detection system needs configuration"
    },
    {
      id: "4",
      category: "21 CFR Part 11",
      requirement: "Digital Signatures",
      status: "compliant",
      lastChecked: "2024-01-15 07:15",
      description: "Electronic signatures are properly validated"
    }
  ]);

  const complianceStats = [
    { label: "Overall Compliance", value: "94.5%", icon: Shield, trend: "+2.1%" },
    { label: "Active Violations", value: "0", icon: AlertTriangle, trend: "0%" },
    { label: "Warnings", value: "3", icon: Clock, trend: "-1" },
    { label: "Last Audit", value: "2 days ago", icon: FileText, trend: "On schedule" }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'violation':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      compliant: "default",
      warning: "secondary",
      violation: "destructive"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5" />
            EHR Compliance Monitor
          </h3>
          <p className="text-gray-600">
            Monitor HIPAA, HITECH, and other healthcare compliance requirements
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            Run Audit
          </Button>
        </div>
      </div>

      {/* Compliance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {complianceStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="w-3 h-3" />
                {stat.trend}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Compliance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Overview</CardTitle>
          <CardDescription>
            Overall compliance score based on all requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">HIPAA Compliance</span>
              <span className="text-sm text-gray-500">95%</span>
            </div>
            <Progress value={95} className="h-2" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">HITECH Compliance</span>
              <span className="text-sm text-gray-500">92%</span>
            </div>
            <Progress value={92} className="h-2" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">21 CFR Part 11</span>
              <span className="text-sm text-gray-500">98%</span>
            </div>
            <Progress value={98} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="requirements" className="space-y-6">
        <TabsList>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>

        <TabsContent value="requirements">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Requirements</CardTitle>
              <CardDescription>
                Status of all compliance requirements and regulations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Requirement</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Checked</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complianceItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.category}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.requirement}</p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          {getStatusBadge(item.status)}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {item.lastChecked}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <FileText className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>
                Complete audit log of all system access and data modifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Audit logs are automatically generated and stored for 7 years as required by HIPAA regulations.
                  </AlertDescription>
                </Alert>
                
                <div className="flex gap-2">
                  <Button variant="outline">View Recent Activity</Button>
                  <Button variant="outline">Export Audit Log</Button>
                  <Button variant="outline">Search Logs</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Controls</CardTitle>
              <CardDescription>
                Active security measures and data protection controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-green-600" />
                      <span className="font-medium">Data Encryption</span>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="font-medium">Access Controls</span>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-green-600" />
                      <span className="font-medium">Activity Monitoring</span>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium">Backup Verification</span>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-green-600" />
                      <span className="font-medium">Incident Response</span>
                    </div>
                    <Badge variant="default">Ready</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="font-medium">Session Management</span>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Training</CardTitle>
              <CardDescription>
                Staff training requirements and completion status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    All staff must complete annual HIPAA training and security awareness training.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">Required Training Modules</h4>
                    <div className="space-y-2">
                      {[
                        "HIPAA Privacy Rules",
                        "HIPAA Security Rules", 
                        "Breach Notification Procedures",
                        "Password Security",
                        "Incident Reporting"
                      ].map((module, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">{module}</span>
                          <Badge variant="outline">Required</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Training Status</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Completion Rate</span>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                      
                      <div className="text-sm text-gray-500 mt-2">
                        3 staff members need to complete training
                      </div>
                      
                      <Button size="sm" variant="outline">
                        Send Reminders
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
