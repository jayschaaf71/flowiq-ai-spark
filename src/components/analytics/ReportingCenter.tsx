import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Download, 
  Filter, 
  Calendar,
  FileText,
  Mail,
  Printer,
  Settings,
  Plus,
  Eye,
  Edit
} from "lucide-react";
import { toast } from "sonner";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'financial' | 'clinical' | 'operational' | 'compliance';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  lastGenerated?: string;
  isScheduled: boolean;
}

interface CustomReport {
  title: string;
  dateRange: string;
  metrics: string[];
  filters: Record<string, any>;
  visualizations: string[];
}

export const ReportingCenter = () => {
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [dateRange, setDateRange] = useState('30days');
  const [customReport, setCustomReport] = useState<CustomReport>({
    title: '',
    dateRange: '30days',
    metrics: [],
    filters: {},
    visualizations: []
  });

  // Mock data for reports
  const reportTemplates: ReportTemplate[] = [
    {
      id: 'financial-monthly',
      name: 'Monthly Financial Summary',
      description: 'Comprehensive revenue, expenses, and profitability analysis',
      type: 'financial',
      frequency: 'monthly',
      lastGenerated: '2024-01-15',
      isScheduled: true
    },
    {
      id: 'patient-satisfaction',
      name: 'Patient Satisfaction Report',
      description: 'Patient feedback, ratings, and satisfaction metrics',
      type: 'clinical',
      frequency: 'weekly',
      lastGenerated: '2024-01-12',
      isScheduled: true
    },
    {
      id: 'operational-efficiency',
      name: 'Operational Efficiency Dashboard',
      description: 'Appointment flow, wait times, and resource utilization',
      type: 'operational',
      frequency: 'daily',
      lastGenerated: '2024-01-16',
      isScheduled: false
    },
    {
      id: 'hipaa-compliance',
      name: 'HIPAA Compliance Audit',
      description: 'Security access logs, PHI handling, and compliance metrics',
      type: 'compliance',
      frequency: 'monthly',
      lastGenerated: '2024-01-01',
      isScheduled: true
    },
    {
      id: 'clinical-outcomes',
      name: 'Clinical Outcomes Analysis',
      description: 'Treatment effectiveness, patient outcomes, and quality metrics',
      type: 'clinical',
      frequency: 'quarterly',
      lastGenerated: '2024-01-01',
      isScheduled: false
    }
  ];

  const availableMetrics = [
    { id: 'patient-count', label: 'Patient Count', category: 'Clinical' },
    { id: 'revenue', label: 'Total Revenue', category: 'Financial' },
    { id: 'appointments', label: 'Appointment Volume', category: 'Operational' },
    { id: 'satisfaction', label: 'Patient Satisfaction', category: 'Clinical' },
    { id: 'wait-time', label: 'Average Wait Time', category: 'Operational' },
    { id: 'no-show-rate', label: 'No-Show Rate', category: 'Operational' },
    { id: 'collection-rate', label: 'Collection Rate', category: 'Financial' },
    { id: 'staff-utilization', label: 'Staff Utilization', category: 'Operational' }
  ];

  const visualizationTypes = [
    { id: 'line-chart', label: 'Line Chart' },
    { id: 'bar-chart', label: 'Bar Chart' },
    { id: 'pie-chart', label: 'Pie Chart' },
    { id: 'table', label: 'Data Table' },
    { id: 'kpi-cards', label: 'KPI Cards' }
  ];

  // Sample data for report preview
  const sampleFinancialData = [
    { month: 'Jan', revenue: 45000, expenses: 32000, profit: 13000 },
    { month: 'Feb', revenue: 52000, expenses: 34000, profit: 18000 },
    { month: 'Mar', revenue: 48000, expenses: 31000, profit: 17000 },
    { month: 'Apr', revenue: 55000, expenses: 36000, profit: 19000 },
    { month: 'May', revenue: 58000, expenses: 37000, profit: 21000 },
    { month: 'Jun', revenue: 61000, expenses: 38000, profit: 23000 }
  ];

  const handleGenerateReport = async (reportId: string) => {
    toast.info('Generating report...');
    
    // Simulate report generation
    setTimeout(() => {
      toast.success('Report generated successfully');
    }, 2000);
  };

  const handleScheduleReport = (reportId: string, enabled: boolean) => {
    toast.success(`Report ${enabled ? 'scheduled' : 'unscheduled'} successfully`);
  };

  const handleExportReport = (format: 'pdf' | 'excel' | 'csv') => {
    toast.success(`Exporting report as ${format.toUpperCase()}...`);
  };

  const handleCreateCustomReport = () => {
    if (!customReport.title || customReport.metrics.length === 0) {
      toast.error('Please provide a title and select at least one metric');
      return;
    }
    
    toast.success('Custom report created successfully');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'financial': return 'bg-green-100 text-green-800';
      case 'clinical': return 'bg-blue-100 text-blue-800';
      case 'operational': return 'bg-orange-100 text-orange-800';
      case 'compliance': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reporting Center</h2>
          <p className="text-muted-foreground">
            Generate comprehensive reports and analytics for your practice
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Configure
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="preview">Report Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reportTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getTypeColor(template.type)}>
                      {template.type}
                    </Badge>
                    <Badge variant={template.isScheduled ? 'default' : 'outline'}>
                      {template.frequency}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {template.lastGenerated && (
                    <div className="text-xs text-muted-foreground">
                      Last generated: {template.lastGenerated}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleGenerateReport(template.id)}
                    >
                      <FileText className="mr-1 h-3 w-3" />
                      Generate
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="mr-1 h-3 w-3" />
                      Preview
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`schedule-${template.id}`}
                      checked={template.isScheduled}
                      onCheckedChange={(checked) => 
                        handleScheduleReport(template.id, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`schedule-${template.id}`} 
                      className="text-xs"
                    >
                      Auto-schedule this report
                    </Label>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Custom Report</CardTitle>
              <CardDescription>
                Build a personalized report with your preferred metrics and visualizations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="report-title">Report Title</Label>
                  <Input
                    id="report-title"
                    value={customReport.title}
                    onChange={(e) => setCustomReport({...customReport, title: e.target.value})}
                    placeholder="Enter report title..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select 
                    value={customReport.dateRange} 
                    onValueChange={(value) => setCustomReport({...customReport, dateRange: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="90days">Last 90 Days</SelectItem>
                      <SelectItem value="1year">Last Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Select Metrics</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  {availableMetrics.map((metric) => (
                    <div key={metric.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={metric.id}
                        checked={customReport.metrics.includes(metric.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setCustomReport({
                              ...customReport,
                              metrics: [...customReport.metrics, metric.id]
                            });
                          } else {
                            setCustomReport({
                              ...customReport,
                              metrics: customReport.metrics.filter(m => m !== metric.id)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={metric.id} className="text-sm">
                        {metric.label}
                        <span className="text-xs text-muted-foreground ml-1">
                          ({metric.category})
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Visualization Types</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  {visualizationTypes.map((viz) => (
                    <div key={viz.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={viz.id}
                        checked={customReport.visualizations.includes(viz.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setCustomReport({
                              ...customReport,
                              visualizations: [...customReport.visualizations, viz.id]
                            });
                          } else {
                            setCustomReport({
                              ...customReport,
                              visualizations: customReport.visualizations.filter(v => v !== viz.id)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={viz.id} className="text-sm">
                        {viz.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleCreateCustomReport}>
                  <FileText className="mr-2 h-4 w-4" />
                  Create Report
                </Button>
                <Button variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>
                Manage automatically generated reports and their delivery settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportTemplates.filter(t => t.isScheduled).map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">{report.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Generated {report.frequency} • Last: {report.lastGenerated}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(report.type)}>
                        {report.type}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Mail className="mr-1 h-3 w-3" />
                        Email Settings
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Financial Performance Report</h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExportReport('pdf')}
              >
                <Download className="mr-1 h-3 w-3" />
                PDF
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExportReport('excel')}
              >
                <Download className="mr-1 h-3 w-3" />
                Excel
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExportReport('csv')}
              >
                <Download className="mr-1 h-3 w-3" />
                CSV
              </Button>
              <Button size="sm">
                <Printer className="mr-1 h-3 w-3" />
                Print
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends (Last 6 Months)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sampleFinancialData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Revenue"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="hsl(var(--success))" 
                      strokeWidth={2}
                      name="Profit"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$319,000</div>
                  <p className="text-xs text-muted-foreground">
                    +12.3% from previous period
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$208,000</div>
                  <p className="text-xs text-muted-foreground">
                    +5.7% from previous period
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Net Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">$111,000</div>
                  <p className="text-xs text-muted-foreground">
                    +23.1% from previous period
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};