import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Search, Calendar, BarChart3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const SleepStudyManager = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  const sleepStudies = [
    {
      id: '1',
      patientName: 'John Smith',
      studyDate: '2024-01-15',
      studyType: 'In-Lab PSG',
      ahiScore: 32.5,
      severity: 'Moderate',
      status: 'completed',
      interpretation: 'Moderate obstructive sleep apnea'
    },
    {
      id: '2',
      patientName: 'Sarah Johnson',
      studyDate: '2024-01-12',
      studyType: 'Home Sleep Test',
      ahiScore: 18.2,
      severity: 'Mild',
      status: 'completed',
      interpretation: 'Mild obstructive sleep apnea'
    },
    {
      id: '3',
      patientName: 'Mike Wilson',
      studyDate: '2024-01-20',
      studyType: 'Split Night',
      ahiScore: 45.8,
      severity: 'Severe',
      status: 'in_progress',
      interpretation: 'Severe obstructive sleep apnea'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Normal': return 'bg-green-100 text-green-800';
      case 'Mild': return 'bg-yellow-100 text-yellow-800';
      case 'Moderate': return 'bg-orange-100 text-orange-800';
      case 'Severe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Sleep Study Manager</h2>
          <p className="text-muted-foreground">Track and manage sleep study results</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Sleep Study
        </Button>
      </div>

      <Tabs defaultValue="studies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="studies">Sleep Studies</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="studies">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Study Results</CardTitle>
              <CardDescription>
                Manage and review sleep study findings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by patient name or study type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                <div className="space-y-4">
                  {sleepStudies.map((study) => (
                    <Card key={study.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold text-foreground">{study.patientName}</h3>
                              <Badge className={getSeverityColor(study.severity)}>
                                {study.severity}
                              </Badge>
                              <Badge className={getStatusColor(study.status)}>
                                {study.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Study Date:</span>
                                <p className="font-medium">{study.studyDate}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Type:</span>
                                <p className="font-medium">{study.studyType}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">AHI Score:</span>
                                <p className="font-medium">{study.ahiScore}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Interpretation:</span>
                                <p className="font-medium">{study.interpretation}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <FileText className="w-4 h-4 mr-1" />
                              View Report
                            </Button>
                            <Button variant="outline" size="sm">
                              <BarChart3 className="w-4 h-4 mr-1" />
                              Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Study Analytics</CardTitle>
              <CardDescription>
                Track sleep study trends and outcomes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Studies</p>
                        <p className="text-2xl font-bold text-foreground">127</p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Avg AHI Score</p>
                        <p className="text-2xl font-bold text-foreground">28.4</p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Severe Cases</p>
                        <p className="text-2xl font-bold text-foreground">32%</p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Study Scheduling</CardTitle>
              <CardDescription>
                Schedule new sleep studies and manage appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient">Patient</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="patient1">John Smith</SelectItem>
                        <SelectItem value="patient2">Sarah Johnson</SelectItem>
                        <SelectItem value="patient3">Mike Wilson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studyType">Study Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select study type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in_lab">In-Lab PSG</SelectItem>
                        <SelectItem value="home">Home Sleep Test</SelectItem>
                        <SelectItem value="split">Split Night</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Study Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input type="time" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea placeholder="Special instructions or notes..." />
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Study
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};