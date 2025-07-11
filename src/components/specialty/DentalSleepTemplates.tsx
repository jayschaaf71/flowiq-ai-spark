import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Search, Edit, Copy } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const DentalSleepTemplates = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for dental sleep templates
  const templates = [
    {
      id: '1',
      name: 'Initial Sleep Apnea Consultation',
      category: 'consultation',
      description: 'Comprehensive initial evaluation template for sleep apnea patients',
      lastModified: '2024-01-15',
      usage: 45,
      content: 'Patient presents with symptoms of sleep apnea including...'
    },
    {
      id: '2',
      name: 'Oral Appliance Fitting Note',
      category: 'treatment',
      description: 'Template for documenting oral appliance fitting procedures',
      lastModified: '2024-01-12',
      usage: 32,
      content: 'Oral appliance fitting completed today. Patient reports...'
    },
    {
      id: '3',
      name: 'Sleep Study Review',
      category: 'assessment',
      description: 'Template for reviewing and interpreting sleep study results',
      lastModified: '2024-01-10',
      usage: 28,
      content: 'Sleep study results reviewed. AHI of [value] indicates...'
    },
    {
      id: '4',
      name: 'Titration Follow-up',
      category: 'follow-up',
      description: 'Follow-up template for oral appliance titration sessions',
      lastModified: '2024-01-08',
      usage: 22,
      content: 'Patient returns for titration adjustment. Current setting...'
    },
    {
      id: '5',
      name: 'Treatment Progress Note',
      category: 'progress',
      description: 'Template for documenting treatment progress and outcomes',
      lastModified: '2024-01-05',
      usage: 18,
      content: 'Patient reports improved sleep quality since beginning treatment...'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'consultation': return 'bg-blue-100 text-blue-800';
      case 'treatment': return 'bg-green-100 text-green-800';
      case 'assessment': return 'bg-purple-100 text-purple-800';
      case 'follow-up': return 'bg-orange-100 text-orange-800';
      case 'progress': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dental Sleep Templates</h2>
          <p className="text-muted-foreground">Standardized documentation templates for sleep medicine practice</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="consultation">Consultation</TabsTrigger>
          <TabsTrigger value="treatment">Treatment</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="follow-up">Follow-up</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Documentation Templates</CardTitle>
              <CardDescription>
                Pre-built templates for common dental sleep medicine documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.map((template) => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h3 className="font-semibold text-foreground">{template.name}</h3>
                              <Badge className={getCategoryColor(template.category)}>
                                {template.category}
                              </Badge>
                            </div>
                            <FileText className="w-5 h-5 text-muted-foreground" />
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            {template.description}
                          </p>
                          
                          <div className="text-xs text-muted-foreground space-y-1">
                            <p>Used {template.usage} times</p>
                            <p>Modified: {template.lastModified}</p>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Copy className="w-3 h-3 mr-1" />
                              Use
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

        <TabsContent value="consultation">
          <Card>
            <CardHeader>
              <CardTitle>Consultation Templates</CardTitle>
              <CardDescription>
                Templates for initial consultations and patient evaluations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Initial Sleep Apnea Consultation</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Chief Complaint:</strong> [Patient's primary sleep-related concerns]</p>
                      <p><strong>Sleep History:</strong> [Duration and quality of sleep issues]</p>
                      <p><strong>Symptoms:</strong> [Snoring, witnessed apneas, daytime fatigue, etc.]</p>
                      <p><strong>Medical History:</strong> [Relevant medical conditions]</p>
                      <p><strong>Examination:</strong> [Oral and airway examination findings]</p>
                      <p><strong>Assessment:</strong> [Clinical impression]</p>
                      <p><strong>Plan:</strong> [Recommended next steps]</p>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit Template
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="w-3 h-3 mr-1" />
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="treatment">
          <Card>
            <CardHeader>
              <CardTitle>Treatment Templates</CardTitle>
              <CardDescription>
                Templates for treatment planning and procedure documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Oral Appliance Treatment Plan</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Appliance Type:</strong> [Mandibular Advancement Device]</p>
                      <p><strong>Manufacturer:</strong> [Device manufacturer and model]</p>
                      <p><strong>Fitting Schedule:</strong> [Timeline for impressions, delivery, adjustments]</p>
                      <p><strong>Expected Outcomes:</strong> [Treatment goals and success criteria]</p>
                      <p><strong>Follow-up Plan:</strong> [Schedule for titration and monitoring]</p>
                      <p><strong>Patient Education:</strong> [Care instructions and expectations]</p>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit Template
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="w-3 h-3 mr-1" />
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessment">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Templates</CardTitle>
              <CardDescription>
                Templates for sleep study reviews and clinical assessments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Sleep Study Assessment</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Study Type:</strong> [In-lab PSG, Home Sleep Test, etc.]</p>
                      <p><strong>AHI Score:</strong> [Apnea-Hypopnea Index value]</p>
                      <p><strong>Severity:</strong> [Normal, Mild, Moderate, Severe]</p>
                      <p><strong>Sleep Architecture:</strong> [Sleep stage distribution]</p>
                      <p><strong>Oxygen Saturation:</strong> [Minimum and average levels]</p>
                      <p><strong>Interpretation:</strong> [Clinical significance of findings]</p>
                      <p><strong>Recommendations:</strong> [Treatment recommendations]</p>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit Template
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="w-3 h-3 mr-1" />
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="follow-up">
          <Card>
            <CardHeader>
              <CardTitle>Follow-up Templates</CardTitle>
              <CardDescription>
                Templates for monitoring progress and ongoing care
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Titration Follow-up Visit</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Current Setting:</strong> [Appliance advancement in mm]</p>
                      <p><strong>Comfort Level:</strong> [Patient comfort rating 1-10]</p>
                      <p><strong>Symptom Improvement:</strong> [Changes in sleep quality, snoring, fatigue]</p>
                      <p><strong>Side Effects:</strong> [Any reported adverse effects]</p>
                      <p><strong>Objective Measures:</strong> [Home sleep test results if available]</p>
                      <p><strong>Adjustment:</strong> [Changes made to appliance]</p>
                      <p><strong>Next Steps:</strong> [Follow-up plan and timeline]</p>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit Template
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="w-3 h-3 mr-1" />
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};