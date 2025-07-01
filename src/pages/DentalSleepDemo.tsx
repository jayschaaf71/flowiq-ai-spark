
import React from 'react';
import { Layout } from '@/components/Layout';
import { DentalSleepDashboard } from '@/components/specialty/dashboards/DentalSleepDashboard';
import { DentalSleepTemplates } from '@/components/specialty/DentalSleepTemplates';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Moon, FileText, BarChart3 } from 'lucide-react';

const DentalSleepDemo: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-3">
              <Moon className="w-8 h-8" />
              Dental Sleep Medicine Demo
            </h1>
            <p className="text-blue-600 mt-2">
              Complete sleep apnea treatment workflow with FlowIQ
            </p>
          </div>
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Demo Environment
          </Badge>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Clinical Templates
            </TabsTrigger>
            <TabsTrigger value="workflow" className="flex items-center gap-2">
              <Moon className="w-4 h-4" />
              Patient Workflow
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DentalSleepDashboard />
          </TabsContent>

          <TabsContent value="templates">
            <DentalSleepTemplates />
          </TabsContent>

          <TabsContent value="workflow">
            <Card>
              <CardHeader>
                <CardTitle>Dental Sleep Medicine Patient Workflow</CardTitle>
                <CardDescription>
                  End-to-end patient journey from consultation to treatment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-blue-200">
                      <CardContent className="p-4 text-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-blue-600 font-bold">1</span>
                        </div>
                        <h3 className="font-semibold">Initial Consult</h3>
                        <p className="text-sm text-gray-600">Sleep study review</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-blue-200">
                      <CardContent className="p-4 text-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-blue-600 font-bold">2</span>
                        </div>
                        <h3 className="font-semibold">Appliance Fitting</h3>
                        <p className="text-sm text-gray-600">Custom MAD creation</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-blue-200">
                      <CardContent className="p-4 text-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-blue-600 font-bold">3</span>
                        </div>
                        <h3 className="font-semibold">Titration</h3>
                        <p className="text-sm text-gray-600">Optimize effectiveness</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-blue-200">
                      <CardContent className="p-4 text-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-blue-600 font-bold">4</span>
                        </div>
                        <h3 className="font-semibold">Follow-up</h3>
                        <p className="text-sm text-gray-600">Ongoing monitoring</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DentalSleepDemo;
