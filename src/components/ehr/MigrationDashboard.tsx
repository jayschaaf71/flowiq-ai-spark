
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileSpreadsheet, 
  Check, 
  AlertTriangle,
  Download,
  Settings,
  Brain,
  Database
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const MigrationDashboard = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [migrationStep, setMigrationStep] = useState<'upload' | 'mapping' | 'preview' | 'complete'>('upload');

  const mockMigrationHistory = [
    {
      id: "1",
      fileName: "EZBIS_Export_2024_01_15.csv",
      date: "2024-01-15",
      recordsImported: 1247,
      status: "Completed",
      errors: 0,
      warnings: 5
    },
    {
      id: "2",
      fileName: "Legacy_Patients_Dec_2023.csv",
      date: "2023-12-20", 
      recordsImported: 892,
      status: "Completed",
      errors: 0,
      warnings: 12
    },
    {
      id: "3",
      fileName: "Insurance_Update_Jan_2024.csv",
      date: "2024-01-10",
      recordsImported: 345,
      status: "Failed",
      errors: 23,
      warnings: 0
    }
  ];

  const mockFieldMapping = {
    "Patient Name": "name",
    "Date of Birth": "dob", 
    "Phone Number": "phone",
    "Email Address": "email",
    "Insurance Provider": "insuranceProvider",
    "Last Visit Date": "lastVisit",
    "Diagnosis Codes": "diagnosisCodes"
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Data Migration</h2>
          <p className="text-muted-foreground">Import patient records from EZBIS and other systems</p>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Migration Settings
        </Button>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload & Import</TabsTrigger>
          <TabsTrigger value="mapping">Field Mapping</TabsTrigger>
          <TabsTrigger value="history">Migration History</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Patient Data
              </CardTitle>
              <CardDescription>
                Drag and drop your CSV file or click to browse. Supported formats: CSV from EZBIS, ChiroTouch, Eclipse, etc.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Drop your CSV file here
                </h3>
                <p className="text-gray-500 mb-4">
                  or <span className="text-blue-600 font-medium">browse files</span>
                </p>
                <Button>
                  Select File
                </Button>
              </div>

              {uploadProgress > 0 && (
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading EZBIS_Export_2024.csv</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Field Detection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Field Detection
              </CardTitle>
              <CardDescription>
                Our AI automatically detects and maps fields from your CSV to FlowIQ schema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Check className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-medium text-green-900">Auto-Mapping</h4>
                  <p className="text-sm text-green-700">95% field accuracy</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Database className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium text-blue-900">Data Validation</h4>
                  <p className="text-sm text-blue-700">Real-time error checking</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-medium text-purple-900">Smart Cleanup</h4>
                  <p className="text-sm text-purple-700">Automatic data formatting</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Field Mapping Configuration</CardTitle>
              <CardDescription>
                Review and adjust how CSV fields map to FlowIQ patient records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(mockFieldMapping).map(([csvField, flowiQField]) => (
                  <div key={csvField} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium">{csvField}</div>
                      <div className="text-gray-400">→</div>
                      <div className="text-sm text-blue-600">{flowiQField}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        <Check className="h-3 w-3 mr-1" />
                        Mapped
                      </Badge>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-6">
                <Button>
                  <Brain className="h-4 w-4 mr-2" />
                  Auto-Map with AI
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Mapping Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Migration History</CardTitle>
              <CardDescription>
                View past data imports and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMigrationHistory.map((migration) => (
                  <div key={migration.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{migration.fileName}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(migration.date).toLocaleDateString()} • 
                        {" "}{migration.recordsImported} records imported
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm">
                        {migration.errors > 0 && (
                          <div className="text-red-600 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {migration.errors} errors
                          </div>
                        )}
                        {migration.warnings > 0 && (
                          <div className="text-yellow-600">
                            {migration.warnings} warnings
                          </div>
                        )}
                      </div>
                      <Badge 
                        variant={
                          migration.status === 'Completed' ? 'default' :
                          migration.status === 'Failed' ? 'destructive' : 'secondary'
                        }
                      >
                        {migration.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
