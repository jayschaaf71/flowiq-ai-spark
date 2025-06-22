
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  Upload, 
  FileText, 
  Database, 
  Calendar,
  Shield,
  CheckCircle,
  AlertTriangle 
} from 'lucide-react';
import { useTenantConfig } from '@/utils/tenantConfig';

interface ExportJob {
  id: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  size?: string;
  downloadUrl?: string;
}

export const DataExportManager: React.FC = () => {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'pdf'>('csv');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y' | 'all'>('30d');
  const [selectedTables, setSelectedTables] = useState<string[]>(['patients', 'appointments']);
  const [isExporting, setIsExporting] = useState(false);
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([
    {
      id: '1',
      type: 'Patient Data Export',
      status: 'completed',
      progress: 100,
      createdAt: '2024-01-15T10:30:00Z',
      size: '2.3 MB',
      downloadUrl: '#'
    },
    {
      id: '2',
      type: 'Appointment History',
      status: 'processing',
      progress: 65,
      createdAt: '2024-01-15T11:00:00Z'
    }
  ]);

  const tenantConfig = useTenantConfig();

  const availableTables = [
    { id: 'patients', label: 'Patient Records', description: 'Basic patient information and demographics' },
    { id: 'appointments', label: 'Appointments', description: 'Appointment history and scheduling data' },
    { id: 'intake_forms', label: 'Intake Forms', description: 'Patient intake form submissions' },
    { id: 'medical_history', label: 'Medical History', description: 'Patient medical history records' },
    { id: 'medications', label: 'Medications', description: 'Prescription and medication data' },
    { id: 'allergies', label: 'Allergies', description: 'Patient allergy information' },
    { id: 'soap_notes', label: 'SOAP Notes', description: 'Clinical notes and assessments' },
    { id: 'billing', label: 'Billing Data', description: 'Claims and payment information' }
  ];

  const handleTableSelection = (tableId: string, checked: boolean) => {
    if (checked) {
      setSelectedTables([...selectedTables, tableId]);
    } else {
      setSelectedTables(selectedTables.filter(id => id !== tableId));
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    const newJob: ExportJob = {
      id: Date.now().toString(),
      type: `${selectedTables.length} Tables Export`,
      status: 'processing',
      progress: 0,
      createdAt: new Date().toISOString()
    };

    setExportJobs([newJob, ...exportJobs]);

    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setExportJobs(prev => prev.map(job => 
        job.id === newJob.id ? { ...job, progress: i } : job
      ));
    }

    // Complete the job
    setExportJobs(prev => prev.map(job => 
      job.id === newJob.id 
        ? { 
            ...job, 
            status: 'completed', 
            size: '1.8 MB',
            downloadUrl: '#'
          } 
        : job
    ));

    setIsExporting(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing': return <Database className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Data Export & Import</h2>
        <p className="text-gray-600">Export patient data and import from external systems</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export Data
            </CardTitle>
            <CardDescription>Configure and export your practice data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Export Format */}
            <div>
              <label className="text-sm font-medium mb-2 block">Export Format</label>
              <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (Spreadsheet)</SelectItem>
                  <SelectItem value="json">JSON (Structured Data)</SelectItem>
                  <SelectItem value="pdf">PDF (Reports)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                  <SelectItem value="all">All data</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Data Tables</label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availableTables.map((table) => (
                  <div key={table.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={table.id}
                      checked={selectedTables.includes(table.id)}
                      onCheckedChange={(checked) => handleTableSelection(table.id, !!checked)}
                    />
                    <div>
                      <label htmlFor={table.id} className="text-sm font-medium cursor-pointer">
                        {table.label}
                      </label>
                      <p className="text-xs text-gray-500">{table.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* HIPAA Compliance Notice */}
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                All exports are HIPAA compliant and encrypted. Patient data will be anonymized unless specifically authorized.
              </AlertDescription>
            </Alert>

            <Button 
              onClick={handleExport}
              disabled={isExporting || selectedTables.length === 0}
              className="w-full"
            >
              {isExporting ? (
                <>
                  <Database className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export {selectedTables.length} Table{selectedTables.length !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Import Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Import Data
            </CardTitle>
            <CardDescription>Import patient data from external systems</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
              <Button variant="outline" size="sm">
                Select Files
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Supported Formats:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• CSV files with patient data</li>
                <li>• HL7 FHIR bundles</li>
                <li>• Epic MyChart exports</li>
                <li>• Cerner PowerChart data</li>
                <li>• Custom JSON formats</li>
              </ul>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                All imported data will be validated and checked for duplicates before being added to your system.
              </AlertDescription>
            </Alert>

            <Button variant="outline" className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Start Import Wizard
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Export History */}
      <Card>
        <CardHeader>
          <CardTitle>Export History</CardTitle>
          <CardDescription>Recent data exports and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {exportJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(job.status)}
                  <div>
                    <p className="font-medium">{job.type}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(job.createdAt).toLocaleDateString()} at {new Date(job.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(job.status)}>
                    {job.status}
                  </Badge>
                  
                  {job.status === 'processing' && (
                    <div className="w-24">
                      <Progress value={job.progress} />
                    </div>
                  )}
                  
                  {job.status === 'completed' && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{job.size}</span>
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
