
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
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
  FileText, 
  Download, 
  Calendar as CalendarIcon, 
  Filter,
  TrendingUp,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Share,
  Settings
} from "lucide-react";

interface ReportConfig {
  name: string;
  type: 'financial' | 'operational' | 'compliance' | 'custom';
  dateRange: {
    start: Date;
    end: Date;
  };
  filters: {
    providers?: string[];
    payers?: string[];
    status?: string[];
    specialty?: string[];
  };
  metrics: string[];
  format: 'pdf' | 'excel' | 'csv';
  schedule?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'financial' | 'operational' | 'compliance' | 'custom';
  isDefault: boolean;
  lastUsed?: Date;
  metrics: string[];
}

export const AdvancedReportingSystem = () => {
  const [activeTab, setActiveTab] = useState("generator");
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    name: '',
    type: 'financial',
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date()
    },
    filters: {},
    metrics: [],
    format: 'pdf'
  });
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [reports, setReports] = useState<Array<{
    id: string;
    name: string;
    type: string;
    generatedAt: Date;
    status: string;
    format: string;
    size: string;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadReportTemplates();
    loadRecentReports();
  }, []);

  const loadReportTemplates = () => {
    const mockTemplates: ReportTemplate[] = [
      {
        id: '1',
        name: 'Monthly Financial Summary',
        description: 'Comprehensive financial performance report',
        type: 'financial',
        isDefault: true,
        metrics: ['revenue', 'collections', 'denials', 'ar_aging']
      },
      {
        id: '2',
        name: 'Provider Performance Report',
        description: 'Individual provider productivity and performance metrics',
        type: 'operational',
        isDefault: true,
        metrics: ['productivity', 'approval_rate', 'avg_processing_time']
      },
      {
        id: '3',
        name: 'Payer Analysis Report',
        description: 'Detailed analysis of payer performance and trends',
        type: 'operational',
        isDefault: false,
        metrics: ['payer_performance', 'denial_patterns', 'payment_trends']
      },
      {
        id: '4',
        name: 'HIPAA Compliance Audit',
        description: 'Compliance monitoring and audit trail report',
        type: 'compliance',
        isDefault: true,
        metrics: ['access_logs', 'security_incidents', 'training_completion']
      }
    ];
    setTemplates(mockTemplates);
  };

  const loadRecentReports = () => {
    const mockReports = [
      {
        id: '1',
        name: 'Monthly Financial Summary - December 2024',
        type: 'financial',
        generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'completed',
        format: 'pdf',
        size: '2.3 MB'
      },
      {
        id: '2',
        name: 'Provider Performance Report - Q4 2024',
        type: 'operational',
        generatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'completed',
        format: 'excel',
        size: '1.8 MB'
      },
      {
        id: '3',
        name: 'Payer Analysis - November 2024',
        type: 'operational',
        generatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: 'completed',
        format: 'pdf',
        size: '3.1 MB'
      }
    ];
    setReports(mockReports);
  };

  const generateReport = async () => {
    try {
      setLoading(true);
      
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newReport = {
        id: Date.now().toString(),
        name: reportConfig.name || `Custom Report - ${format(new Date(), 'MMM dd, yyyy')}`,
        type: reportConfig.type,
        generatedAt: new Date(),
        status: 'completed',
        format: reportConfig.format,
        size: '2.1 MB'
      };
      
      setReports(prev => [newReport, ...prev]);
      
      toast({
        title: "Report Generated",
        description: "Your report has been generated successfully",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate report",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      toast({
        title: "Download Started",
        description: `Downloading ${report.name}`,
      });
    }
  };

  const applyTemplate = (template: ReportTemplate) => {
    setReportConfig(prev => ({
      ...prev,
      name: template.name,
      type: template.type,
      metrics: template.metrics
    }));
    setActiveTab("generator");
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'financial': return 'bg-green-100 text-green-700';
      case 'operational': return 'bg-blue-100 text-blue-700';
      case 'compliance': return 'bg-red-100 text-red-700';
      case 'custom': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing': return <Clock className="w-4 h-4 text-orange-600 animate-spin" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  // Mock analytics data
  const reportUsageData = [
    { month: 'Jul', financial: 45, operational: 32, compliance: 18, custom: 8 },
    { month: 'Aug', financial: 52, operational: 38, compliance: 22, custom: 12 },
    { month: 'Sep', financial: 48, operational: 41, compliance: 25, custom: 15 },
    { month: 'Oct', financial: 58, operational: 45, compliance: 28, custom: 18 },
    { month: 'Nov', financial: 62, operational: 48, compliance: 30, custom: 22 },
    { month: 'Dec', financial: 68, operational: 52, compliance: 35, custom: 25 }
  ];

  const reportTypeDistribution = [
    { name: 'Financial', value: 45, color: '#10B981' },
    { name: 'Operational', value: 32, color: '#3B82F6' },
    { name: 'Compliance', value: 18, color: '#EF4444' },
    { name: 'Custom', value: 5, color: '#8B5CF6' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold">Advanced Reporting System</h2>
            <p className="text-gray-600">Generate comprehensive reports with custom analytics</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-blue-100 text-blue-700">
            <TrendingUp className="w-3 h-3 mr-1" />
            Analytics Enabled
          </Badge>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="generator">Report Generator</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="reports">My Reports</TabsTrigger>
          <TabsTrigger value="analytics">Usage Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="generator">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Report Configuration</CardTitle>
                  <CardDescription>Configure your custom report settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Report Name</label>
                      <Input
                        placeholder="Enter report name"
                        value={reportConfig.name}
                        onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Report Type</label>
                      <Select 
                        value={reportConfig.type} 
                        onValueChange={(value: 'financial' | 'operational' | 'compliance' | 'custom') => 
                          setReportConfig(prev => ({ ...prev, type: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="financial">Financial</SelectItem>
                          <SelectItem value="operational">Operational</SelectItem>
                          <SelectItem value="compliance">Compliance</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Start Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(reportConfig.dateRange.start, 'MMM dd, yyyy')}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={reportConfig.dateRange.start}
                            onSelect={(date) => date && setReportConfig(prev => ({
                              ...prev,
                              dateRange: { ...prev.dateRange, start: date }
                            }))}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">End Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(reportConfig.dateRange.end, 'MMM dd, yyyy')}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={reportConfig.dateRange.end}
                            onSelect={(date) => date && setReportConfig(prev => ({
                              ...prev,
                              dateRange: { ...prev.dateRange, end: date }
                            }))}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Export Format</label>
                    <Select 
                      value={reportConfig.format} 
                      onValueChange={(value: 'pdf' | 'excel' | 'csv') => 
                        setReportConfig(prev => ({ ...prev, format: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Metrics & Filters</CardTitle>
                  <CardDescription>Select metrics and apply filters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Metrics to Include</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {[
                          'Total Revenue', 'Collection Rate', 'Denial Rate', 
                          'Days in A/R', 'Provider Performance', 'Payer Analysis',
                          'Claim Volume', 'Processing Time', 'Approval Rate'
                        ].map((metric) => (
                          <label key={metric} className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">{metric}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full mb-4" 
                    onClick={generateReport}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Generate Report
                      </>
                    )}
                  </Button>
                  
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>📊 Report will include selected metrics</p>
                    <p>📅 Date range: {format(reportConfig.dateRange.start, 'MMM dd')} - {format(reportConfig.dateRange.end, 'MMM dd')}</p>
                    <p>📄 Format: {reportConfig.format.toUpperCase()}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Download Last Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Share className="w-4 h-4 mr-2" />
                    Share Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Schedule Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge className={getTypeColor(template.type)}>
                      {template.type}
                    </Badge>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">Includes:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.metrics.slice(0, 3).map((metric) => (
                        <Badge key={metric} variant="outline" className="text-xs">
                          {metric.replace('_', ' ')}
                        </Badge>
                      ))}
                      {template.metrics.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.metrics.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => applyTemplate(template)}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Your generated reports and download history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(report.status)}
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-sm text-gray-600">
                          Generated {format(report.generatedAt, 'MMM dd, yyyy at HH:mm')} • {report.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(report.type)}>
                        {report.type}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => downloadReport(report.id)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Usage Trends</CardTitle>
                <CardDescription>Monthly report generation by type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportUsageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="financial" fill="#10B981" name="Financial" />
                    <Bar dataKey="operational" fill="#3B82F6" name="Operational" />
                    <Bar dataKey="compliance" fill="#EF4444" name="Compliance" />
                    <Bar dataKey="custom" fill="#8B5CF6" name="Custom" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Report Type Distribution</CardTitle>
                <CardDescription>Breakdown of report types generated</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportTypeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {reportTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
