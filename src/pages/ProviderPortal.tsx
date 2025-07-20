
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  User,
  Phone,
  Mail,
  Stethoscope,
  Mic,
  MicOff,
  Save,
  Search,
  Filter,
  Bell,
  Settings
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAppointments } from "@/hooks/useAppointments";
import { useTenantPatients } from "@/hooks/useTenantData";
import { format } from "date-fns";

interface SOAPNote {
  id: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export const ProviderPortal = () => {
  const { user, profile } = useAuth();
  const { appointments, loading: appointmentsLoading } = useAppointments();
  const { data: patients, isLoading: patientsLoading } = useTenantPatients();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [soapNote, setSoapNote] = useState<SOAPNote>({
    id: '',
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Filter appointments for today
  const todayAppointments = appointments?.filter(apt => 
    apt.date === format(new Date(), 'yyyy-MM-dd')
  ) || [];

  // Filter patients based on search
  const filteredPatients = patients?.filter(patient =>
    `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleScribeRecord = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice-to-text integration
    console.log('ScribeIQ recording:', !isRecording);
  };

  const handleSaveSOAP = () => {
    // TODO: Save SOAP note to database
    console.log('Saving SOAP note:', soapNote);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
              <p className="text-gray-600 mb-4">Please log in to access the provider portal.</p>
              <Button onClick={() => window.location.href = '/auth'}>
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Provider Portal</h1>
                <p className="text-sm text-gray-600">Welcome back, Dr. {profile?.last_name || user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="scribe">ScribeIQ</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{todayAppointments.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {todayAppointments.filter(apt => apt.status === 'confirmed').length} confirmed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{patients?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Active patients</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">Require attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAppointments.slice(0, 5).map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <User className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{appointment.patient_name}</p>
                          <p className="text-xs text-gray-500">{appointment.appointment_type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{appointment.time}</p>
                        <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                          {appointment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Patient Management</h2>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Patient List */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Patients ({filteredPatients.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-96 overflow-y-auto">
                      {patientsLoading ? (
                        <div className="p-4 text-center">Loading patients...</div>
                      ) : (
                        filteredPatients.map((patient) => (
                          <div
                            key={patient.id}
                            className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                              selectedPatient?.id === patient.id ? 'bg-blue-50 border-blue-200' : ''
                            }`}
                            onClick={() => setSelectedPatient(patient)}
                          >
                            <div className="flex items-center space-x-3">
                              <User className="h-8 w-8 text-gray-400" />
                              <div>
                                <p className="font-medium">{patient.first_name} {patient.last_name}</p>
                                <p className="text-xs text-gray-500">{patient.email}</p>
                                <p className="text-xs text-gray-500">{patient.phone}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Patient Details */}
              <div className="lg:col-span-2">
                {selectedPatient ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {selectedPatient.first_name} {selectedPatient.last_name}
                      </CardTitle>
                      <CardDescription>Patient ID: {selectedPatient.patient_number}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Contact Information</label>
                          <div className="mt-1 space-y-1">
                            <p className="flex items-center text-sm">
                              <Mail className="h-4 w-4 mr-2 text-gray-400" />
                              {selectedPatient.email}
                            </p>
                            <p className="flex items-center text-sm">
                              <Phone className="h-4 w-4 mr-2 text-gray-400" />
                              {selectedPatient.phone}
                            </p>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Demographics</label>
                          <div className="mt-1 space-y-1">
                            <p className="text-sm">DOB: {selectedPatient.date_of_birth}</p>
                            <p className="text-sm">Gender: {selectedPatient.gender}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700">Medical History</label>
                        <p className="mt-1 text-sm text-gray-600">
                          {selectedPatient.medical_history || 'No medical history recorded'}
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">Allergies</label>
                        <p className="mt-1 text-sm text-gray-600">
                          {selectedPatient.allergies || 'No allergies recorded'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Patient</h3>
                      <p className="text-gray-500">Choose a patient from the list to view their details</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Appointment Management</h2>
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule New
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>
                  {format(new Date(), 'EEEE, MMMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {appointmentsLoading ? (
                  <div className="text-center py-8">Loading appointments...</div>
                ) : todayAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments today</h3>
                    <p className="text-gray-500">Your schedule is clear for today.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todayAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <Clock className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium">{appointment.patient_name}</p>
                            <p className="text-sm text-gray-500">{appointment.appointment_type}</p>
                            <p className="text-xs text-gray-400">{appointment.time} - {appointment.duration} minutes</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                            {appointment.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ScribeIQ Tab */}
          <TabsContent value="scribe" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">ScribeIQ - AI Documentation Assistant</h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant={isRecording ? "destructive" : "default"}
                  onClick={handleScribeRecord}
                  className="flex items-center gap-2"
                >
                  {isRecording ? (
                    <>
                      <MicOff className="h-4 w-4" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4" />
                      Start Recording
                    </>
                  )}
                </Button>
              </div>
            </div>

            {isRecording && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-700 font-medium">Recording in progress...</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>SOAP Note Generator</CardTitle>
                  <CardDescription>
                    AI-powered documentation from voice recordings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Subjective</label>
                    <Textarea
                      placeholder="Patient's chief complaint and history..."
                      value={soapNote.subjective}
                      onChange={(e) => setSoapNote(prev => ({ ...prev, subjective: e.target.value }))}
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Objective</label>
                    <Textarea
                      placeholder="Physical examination findings..."
                      value={soapNote.objective}
                      onChange={(e) => setSoapNote(prev => ({ ...prev, objective: e.target.value }))}
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Assessment</label>
                    <Textarea
                      placeholder="Clinical assessment and diagnosis..."
                      value={soapNote.assessment}
                      onChange={(e) => setSoapNote(prev => ({ ...prev, assessment: e.target.value }))}
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Plan</label>
                    <Textarea
                      placeholder="Treatment plan and follow-up..."
                      value={soapNote.plan}
                      onChange={(e) => setSoapNote(prev => ({ ...prev, plan: e.target.value }))}
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <Button onClick={handleSaveSOAP} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save SOAP Note
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common documentation tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Progress Note
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Update Patient Record
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Follow-up
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Patient Message
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Secure Messaging</h2>
              <Button>
                <MessageSquare className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>
                  Secure communication with patients and staff
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No messages</h3>
                  <p className="text-gray-500">Your message inbox is empty.</p>
                  <Button className="mt-4">
                    Start Conversation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
