import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/PageHeader";
import { 
  User, 
  FileText, 
  Activity, 
  Calendar, 
  AlertTriangle,
  Plus,
  Search,
  Edit,
  Save,
  Clock,
  Heart,
  Thermometer,
  Scale,
  Moon,
  Stethoscope,
  Pill,
  Archive
} from "lucide-react";
import { useState } from "react";

export const DentalSleepEHR = () => {
  const [activePatient, setActivePatient] = useState("John Smith");
  const [searchTerm, setSearchTerm] = useState("");

  const patients = [
    { id: 1, name: "John Smith", mrn: "MRN-001234", lastVisit: "2024-01-15", status: "Active" },
    { id: 2, name: "Sarah Johnson", mrn: "MRN-001235", lastVisit: "2024-01-12", status: "Follow-up" },
    { id: 3, name: "Michael Brown", mrn: "MRN-001236", lastVisit: "2024-01-10", status: "New" }
  ];

  const vitalSigns = [
    { date: "2024-01-15", bp: "128/82", hr: "72", temp: "98.6°F", weight: "185 lbs", bmi: "28.3" },
    { date: "2024-01-01", bp: "132/85", hr: "75", temp: "98.4°F", weight: "187 lbs", bmi: "28.6" }
  ];

  const medications = [
    { name: "Lisinopril", dosage: "10mg daily", prescriber: "Dr. Wilson", date: "2024-01-15" },
    { name: "Metformin", dosage: "500mg twice daily", prescriber: "Dr. Wilson", date: "2024-01-10" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Electronic Health Records</h1>
          <p className="text-gray-600">Comprehensive patient health information management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Archive className="w-4 h-4 mr-2" />
            Export Records
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Patient
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Patient List Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Patient Search</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search patients..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {patients.map((patient) => (
              <div 
                key={patient.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  activePatient === patient.name ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                }`}
                onClick={() => setActivePatient(patient.name)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{patient.name}</div>
                    <div className="text-xs text-gray-600">{patient.mrn}</div>
                    <div className="text-xs text-gray-500">{patient.lastVisit}</div>
                  </div>
                  <Badge 
                    variant={patient.status === 'Active' ? 'default' : 
                            patient.status === 'Follow-up' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {patient.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Main EHR Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Patient Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{activePatient}</CardTitle>
                    <CardDescription>
                      DOB: 03/15/1978 • Age: 45 • MRN: MRN-001234 • Male
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Demographics
                  </Button>
                  <Button size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Appointment
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* EHR Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="notes">Clinical Notes</TabsTrigger>
              <TabsTrigger value="vitals">Vitals</TabsTrigger>
              <TabsTrigger value="medications">Medications</TabsTrigger>
              <TabsTrigger value="sleep">Sleep Studies</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Alerts & Warnings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      Alerts & Warnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="font-medium text-red-900">Drug Allergy</span>
                      </div>
                      <p className="text-sm text-red-700 mt-1">Penicillin - Severe reaction</p>
                    </div>
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-yellow-900">Overdue Follow-up</span>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">Sleep study follow-up due</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Activity className="w-5 h-5 text-blue-600" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Oral appliance delivery</p>
                        <p className="text-xs text-gray-600">Jan 15, 2024 - Dr. Smith</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Sleep study completed</p>
                        <p className="text-xs text-gray-600">Jan 10, 2024 - Sleep Lab</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Initial consultation</p>
                        <p className="text-xs text-gray-600">Jan 5, 2024 - Dr. Smith</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      <div>
                        <div className="text-2xl font-bold">128/82</div>
                        <p className="text-xs text-gray-600">Blood Pressure</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <Scale className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="text-2xl font-bold">28.3</div>
                        <p className="text-xs text-gray-600">BMI</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <Moon className="w-5 h-5 text-purple-500" />
                      <div>
                        <div className="text-2xl font-bold">28.5</div>
                        <p className="text-xs text-gray-600">AHI Score</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-5 h-5 text-orange-500" />
                      <div>
                        <div className="text-2xl font-bold">98.6°F</div>
                        <p className="text-xs text-gray-600">Temperature</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Clinical Notes Tab */}
            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Clinical Notes</CardTitle>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      New Note
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-medium">Progress Note - Sleep Appliance Follow-up</span>
                        <p className="text-sm text-gray-600">Dr. Smith • Jan 15, 2024 • 10:30 AM</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <p><strong>Chief Complaint:</strong> 2-week follow-up for oral appliance therapy</p>
                      <p><strong>Subjective:</strong> Patient reports improved sleep quality and reduced snoring. Wife confirms significant improvement. Patient comfortable wearing device nightly. No jaw pain or tooth movement noted.</p>
                      <p><strong>Objective:</strong> Oral appliance in good condition, proper fit maintained. No signs of tooth movement or TMJ dysfunction. Patient demonstrates proper insertion/removal technique.</p>
                      <p><strong>Assessment:</strong> Good initial response to oral appliance therapy. Patient compliant and comfortable.</p>
                      <p><strong>Plan:</strong> Continue current appliance settings. Return in 4 weeks for adjustment if needed. Schedule 3-month sleep study to assess treatment effectiveness.</p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-medium">Initial Consultation - Sleep Apnea</span>
                        <p className="text-sm text-gray-600">Dr. Smith • Jan 5, 2024 • 2:00 PM</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <p><strong>Chief Complaint:</strong> Referred for oral appliance therapy for OSA</p>
                      <p><strong>History:</strong> 45-year-old male with moderate OSA (AHI 28.5) per recent sleep study. Failed CPAP therapy due to claustrophobia and mask intolerance. Excellent dental health, no TMJ dysfunction.</p>
                      <p><strong>Clinical Findings:</strong> Class I occlusion, adequate protrusive range (8mm), healthy periodontium. Good candidate for oral appliance therapy.</p>
                      <p><strong>Treatment Plan:</strong> TAP 3 Elite oral appliance fabrication. Patient educated on therapy expectations and compliance requirements.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Vitals Tab */}
            <TabsContent value="vitals" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Vital Signs History</CardTitle>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Vitals
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Date</th>
                          <th className="text-left p-2">BP</th>
                          <th className="text-left p-2">HR</th>
                          <th className="text-left p-2">Temp</th>
                          <th className="text-left p-2">Weight</th>
                          <th className="text-left p-2">BMI</th>
                          <th className="text-left p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vitalSigns.map((vital, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-2">{vital.date}</td>
                            <td className="p-2">{vital.bp}</td>
                            <td className="p-2">{vital.hr}</td>
                            <td className="p-2">{vital.temp}</td>
                            <td className="p-2">{vital.weight}</td>
                            <td className="p-2">{vital.bmi}</td>
                            <td className="p-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-3 h-3" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Medications Tab */}
            <TabsContent value="medications" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Pill className="w-5 h-5" />
                      Current Medications
                    </CardTitle>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Medication
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {medications.map((med, index) => (
                    <div key={index} className="border rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <span className="font-medium">{med.name}</span>
                        <p className="text-sm text-gray-600">{med.dosage}</p>
                        <p className="text-xs text-gray-500">Prescribed by {med.prescriber} on {med.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sleep Studies Tab */}
            <TabsContent value="sleep" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Moon className="w-5 h-5" />
                      Sleep Study Results
                    </CardTitle>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Upload Study
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-medium">In-Lab Polysomnography</span>
                        <p className="text-sm text-gray-600">Jan 10, 2024 • Metro Sleep Center</p>
                      </div>
                      <Badge>Completed</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">AHI:</span>
                        <span className="ml-2 font-medium text-orange-600">28.5/hr</span>
                      </div>
                      <div>
                        <span className="text-gray-600">RDI:</span>
                        <span className="ml-2 font-medium">34.2/hr</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Lowest SpO2:</span>
                        <span className="ml-2 font-medium text-red-600">82%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Sleep Efficiency:</span>
                        <span className="ml-2 font-medium">78%</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-3">
                      View Full Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Patient Documents
                    </CardTitle>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Upload Document
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-blue-500" />
                      <div>
                        <span className="font-medium">Sleep Study Report</span>
                        <p className="text-sm text-gray-600">PDF • 2.3 MB • Jan 10, 2024</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                  <div className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-green-500" />
                      <div>
                        <span className="font-medium">Medical History Form</span>
                        <p className="text-sm text-gray-600">PDF • 1.1 MB • Jan 5, 2024</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                  <div className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-purple-500" />
                      <div>
                        <span className="font-medium">Insurance Authorization</span>
                        <p className="text-sm text-gray-600">PDF • 800 KB • Jan 3, 2024</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};