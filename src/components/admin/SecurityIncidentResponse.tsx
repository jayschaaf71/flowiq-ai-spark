import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye, 
  Lock, 
  Activity,
  FileText,
  Users,
  Zap,
  Bell
} from 'lucide-react';

interface SecurityIncident {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  type: 'unauthorized_access' | 'data_breach' | 'system_vulnerability' | 'malicious_activity' | 'compliance_violation';
  detectedAt: string;
  assignedTo: string;
  affectedSystems: string[];
  impactLevel: string;
  responseTime: number;
  resolutionTime?: number;
}

interface ThreatIntelligence {
  id: string;
  source: string;
  threatType: string;
  description: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  indicators: string[];
  recommendedActions: string[];
  lastUpdated: string;
}

interface ComplianceViolation {
  id: string;
  regulation: 'HIPAA' | 'SOC2' | 'GDPR' | 'PCI-DSS';
  violation: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  detectedAt: string;
  remediation: string;
  status: 'open' | 'remediated' | 'mitigated';
}

export const SecurityIncidentResponse: React.FC = () => {
  const [incidents] = useState<SecurityIncident[]>([
    {
      id: '1',
      title: 'Suspicious Login Activity',
      description: 'Multiple failed login attempts from unknown IP addresses targeting admin accounts',
      severity: 'high',
      status: 'investigating',
      type: 'unauthorized_access',
      detectedAt: '2024-01-15 09:45',
      assignedTo: 'Security Team',
      affectedSystems: ['Authentication Service', 'User Management'],
      impactLevel: 'Medium',
      responseTime: 15
    },
    {
      id: '2',
      title: 'Database Query Anomaly',
      description: 'Unusual database access patterns detected in patient records table',
      severity: 'critical',
      status: 'open',
      type: 'data_breach',
      detectedAt: '2024-01-15 11:20',
      assignedTo: 'Data Security Team',
      affectedSystems: ['Primary Database', 'Patient Records'],
      impactLevel: 'High',
      responseTime: 5
    },
    {
      id: '3',
      title: 'Outdated SSL Certificate',
      description: 'SSL certificate for api.flowiq.com expired, potential security vulnerability',
      severity: 'medium',
      status: 'resolved',
      type: 'system_vulnerability',
      detectedAt: '2024-01-14 14:30',
      assignedTo: 'DevOps Team',
      affectedSystems: ['API Gateway'],
      impactLevel: 'Low',
      responseTime: 120,
      resolutionTime: 180
    }
  ]);

  const [threats] = useState<ThreatIntelligence[]>([
    {
      id: '1',
      source: 'External Threat Feed',
      threatType: 'Advanced Persistent Threat',
      description: 'Healthcare-targeted ransomware campaign affecting practice management systems',
      riskLevel: 'critical',
      indicators: ['Specific file hashes', 'Suspicious network patterns', 'Email attack vectors'],
      recommendedActions: ['Update endpoint protection', 'Review backup procedures', 'Staff security training'],
      lastUpdated: '2024-01-15 08:00'
    },
    {
      id: '2',
      source: 'Internal Analysis',
      threatType: 'Credential Stuffing',
      description: 'Automated attempts to access accounts using compromised credentials',
      riskLevel: 'high',
      indicators: ['High frequency login attempts', 'Geographic anomalies', 'User agent patterns'],
      recommendedActions: ['Enforce MFA', 'Monitor login patterns', 'Implement rate limiting'],
      lastUpdated: '2024-01-15 06:30'
    }
  ]);

  const [violations] = useState<ComplianceViolation[]>([
    {
      id: '1',
      regulation: 'HIPAA',
      violation: 'Audit log retention period below required 6 years',
      severity: 'high',
      detectedAt: '2024-01-14 16:00',
      remediation: 'Update log retention policies and configure automated archiving',
      status: 'remediated'
    },
    {
      id: '2',
      regulation: 'SOC2',
      violation: 'Incomplete access review documentation for Q4 2023',
      severity: 'medium',
      detectedAt: '2024-01-13 10:30',
      remediation: 'Complete access review documentation and implement quarterly reviews',
      status: 'open'
    }
  ]);

  const [selectedIncident, setSelectedIncident] = useState<SecurityIncident | null>(null);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-500 text-white">High</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium</Badge>;
      default:
        return <Badge variant="secondary">Low</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="destructive">Open</Badge>;
      case 'investigating':
        return <Badge variant="warning">Investigating</Badge>;
      case 'resolved':
        return <Badge variant="success">Resolved</Badge>;
      case 'closed':
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const criticalIncidents = incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved');
  const openIncidents = incidents.filter(i => i.status === 'open' || i.status === 'investigating');

  return (
    <div className="space-y-6">
      {/* Security Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openIncidents.length}</div>
            <p className="text-xs text-muted-foreground">
              {criticalIncidents.length} critical
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 min</div>
            <p className="text-xs text-success">Average response time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threat Level</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">Elevated</div>
            <p className="text-xs text-muted-foreground">Current status</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">HIPAA compliance</p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {criticalIncidents.length > 0 && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>CRITICAL ALERT:</strong> {criticalIncidents.length} critical security incident(s) require immediate attention.
            <Button variant="link" className="p-0 h-auto ml-2">
              View All Critical Incidents
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="incidents" className="space-y-6">
        <TabsList>
          <TabsTrigger value="incidents">Security Incidents</TabsTrigger>
          <TabsTrigger value="threats">Threat Intelligence</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Monitoring</TabsTrigger>
          <TabsTrigger value="response">Response Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="incidents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Incident Management</CardTitle>
              <CardDescription>
                Active security incidents and their response status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Incident</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Detected</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{incident.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {incident.description.substring(0, 60)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {incident.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{getSeverityBadge(incident.severity)}</TableCell>
                      <TableCell>{getStatusBadge(incident.status)}</TableCell>
                      <TableCell className="text-sm">{incident.detectedAt}</TableCell>
                      <TableCell className="text-sm">{incident.responseTime} min</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedIncident(incident)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{incident.title}</DialogTitle>
                              <DialogDescription>
                                Security incident details and response actions
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium">Severity</h4>
                                  {getSeverityBadge(incident.severity)}
                                </div>
                                <div>
                                  <h4 className="font-medium">Status</h4>
                                  {getStatusBadge(incident.status)}
                                </div>
                                <div>
                                  <h4 className="font-medium">Type</h4>
                                  <p className="text-sm">{incident.type.replace('_', ' ')}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium">Assigned To</h4>
                                  <p className="text-sm">{incident.assignedTo}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Description</h4>
                                <p className="text-sm text-muted-foreground">{incident.description}</p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Affected Systems</h4>
                                <div className="flex gap-2">
                                  {incident.affectedSystems.map((system) => (
                                    <Badge key={system} variant="outline">{system}</Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Response Notes</h4>
                                <Textarea 
                                  placeholder="Add incident response notes..."
                                  className="min-h-[100px]"
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline">Update Status</Button>
                                <Button>Add Response</Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Threat Intelligence Dashboard</CardTitle>
              <CardDescription>
                Latest security threats and recommended countermeasures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {threats.map((threat) => (
                  <div key={threat.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{threat.threatType}</h4>
                        <p className="text-sm text-muted-foreground">Source: {threat.source}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getSeverityBadge(threat.riskLevel)}
                        <Badge variant="outline">Updated {threat.lastUpdated}</Badge>
                      </div>
                    </div>
                    <p className="text-sm mb-3">{threat.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-sm mb-2">Threat Indicators</h5>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {threat.indicators.map((indicator, index) => (
                            <li key={index}>• {indicator}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm mb-2">Recommended Actions</h5>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {threat.recommendedActions.map((action, index) => (
                            <li key={index}>• {action}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Violations</CardTitle>
              <CardDescription>
                Monitor and remediate regulatory compliance issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Regulation</TableHead>
                    <TableHead>Violation</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Detected</TableHead>
                    <TableHead>Remediation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {violations.map((violation) => (
                    <TableRow key={violation.id}>
                      <TableCell>
                        <Badge variant="outline">{violation.regulation}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="text-sm">{violation.violation}</div>
                      </TableCell>
                      <TableCell>{getSeverityBadge(violation.severity)}</TableCell>
                      <TableCell>
                        <Badge variant={violation.status === 'remediated' ? 'success' : 'warning'}>
                          {violation.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{violation.detectedAt}</TableCell>
                      <TableCell className="max-w-xs text-sm">
                        {violation.remediation}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="response" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Automated Response Rules
                </CardTitle>
                <CardDescription>
                  Configure automated incident response workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Failed Login Auto-Block</h4>
                      <p className="text-sm text-muted-foreground">Block IP after 5 failed attempts</p>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Suspicious Data Access Alert</h4>
                      <p className="text-sm text-muted-foreground">Alert on unusual data patterns</p>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Malware Detection Response</h4>
                      <p className="text-sm text-muted-foreground">Isolate affected systems</p>
                    </div>
                    <Badge variant="secondary">Disabled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Escalation Procedures
                </CardTitle>
                <CardDescription>
                  Automated escalation based on incident severity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="destructive">Critical</Badge>
                      <span className="font-medium">Immediate Escalation</span>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Notify CISO immediately</li>
                      <li>• Activate incident response team</li>
                      <li>• Generate compliance report</li>
                    </ul>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-orange-500 text-white">High</Badge>
                      <span className="font-medium">15-minute Escalation</span>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Notify security team lead</li>
                      <li>• Create incident ticket</li>
                      <li>• Begin investigation</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};