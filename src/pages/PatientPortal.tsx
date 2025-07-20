
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar, 
  Clock, 
  User, 
  MessageSquare, 
  CreditCard, 
  FileText, 
  Phone, 
  Mail,
  MapPin,
  AlertCircle,
  CheckCircle,
  Bell,
  Settings,
  Mic,
  MicOff,
  Camera,
  Upload,
  X,
  Plus,
  Edit
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRealAppointments } from "@/hooks/useRealAppointments";
import { useChat } from "@/hooks/useChat";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscription }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        // TODO: Send to voice-to-text edge function
        console.log('Voice recording completed', audioBlob);
        onTranscription("Voice recording processed - integration pending");
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  return (
    <Button
      variant={isRecording ? "destructive" : "outline"}
      size="sm"
      onClick={isRecording ? stopRecording : startRecording}
    >
      {isRecording ? (
        <>
          <MicOff className="h-4 w-4 mr-2" />
          Stop Recording
        </>
      ) : (
        <>
          <Mic className="h-4 w-4 mr-2" />
          Voice Input
        </>
      )}
    </Button>
  );
};

export const PatientPortal = () => {
  const { user, profile } = useAuth();
  const { appointments, loading: appointmentsLoading, cancelAppointment } = useRealAppointments();
  const { conversations, messages, sendMessage, createConversation } = useChat();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [messageText, setMessageText] = useState("");
  const [intakeResponses, setIntakeResponses] = useState<Record<string, string>>({});

  // Mock patient data - in real app, this would come from the patients table
  const patientData = {
    firstName: profile?.first_name || user?.user_metadata?.first_name || 'Patient',
    lastName: profile?.last_name || user?.user_metadata?.last_name || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    address: '',
    insurance: 'Blue Cross Blue Shield',
    memberID: 'BC123456789'
  };

  const upcomingAppointments = appointments?.filter(apt => 
    new Date(apt.date + 'T' + apt.time) > new Date() && apt.status !== 'cancelled'
  ) || [];

  const pastAppointments = appointments?.filter(apt => 
    new Date(apt.date + 'T' + apt.time) < new Date() || apt.status === 'completed'
  ) || [];

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await cancelAppointment(appointmentId, "Cancelled by patient");
      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been successfully cancelled.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      let conversation = conversations[0];
      if (!conversation) {
        conversation = await createConversation();
        if (!conversation) return;
      }

      await sendMessage(conversation.id, messageText);
      setMessageText("");
      toast({
        title: "Message Sent",
        description: "Your message has been sent to the care team.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleVoiceTranscription = (text: string) => {
    setIntakeResponses(prev => ({
      ...prev,
      'voice_input': text
    }));
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
              <p className="text-gray-600 mb-4">Please log in to access your patient portal.</p>
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
              <User className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Health Portal</h1>
                <p className="text-sm text-gray-600">Welcome back, {patientData.firstName}</p>
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="intake">Health Forms</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Visits</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Next visit: {upcomingAppointments[0] ? format(parseISO(upcomingAppointments[0].date), 'MMM d') : 'None scheduled'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Messages</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{conversations.length}</div>
                  <p className="text-xs text-muted-foreground">Active conversations</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$0.00</div>
                  <p className="text-xs text-muted-foreground">No outstanding balance</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks you can perform</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex-col"
                  onClick={() => setActiveTab("appointments")}
                >
                  <Calendar className="h-6 w-6 mb-2" />
                  Book Appointment
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col"
                  onClick={() => setActiveTab("messages")}
                >
                  <MessageSquare className="h-6 w-6 mb-2" />
                  Send Message
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col"
                  onClick={() => setActiveTab("billing")}
                >
                  <CreditCard className="h-6 w-6 mb-2" />
                  Pay Bill
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col"
                  onClick={() => setActiveTab("intake")}
                >
                  <FileText className="h-6 w-6 mb-2" />
                  Health Forms
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {appointments && appointments.length > 0 ? (
                  <div className="space-y-4">
                    {appointments.slice(0, 3).map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">{appointment.appointment_type}</p>
                            <p className="text-xs text-gray-500">
                              {format(parseISO(appointment.date), 'MMM d, yyyy')} at {appointment.time}
                            </p>
                          </div>
                        </div>
                        <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                          {appointment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent activity</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Appointments</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule New
              </Button>
            </div>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your scheduled visits</CardDescription>
              </CardHeader>
              <CardContent>
                {appointmentsLoading ? (
                  <div className="text-center py-8">Loading appointments...</div>
                ) : upcomingAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming appointments</h3>
                    <p className="text-gray-500 mb-4">Schedule your next visit with us.</p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Book Appointment
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">{appointment.appointment_type}</p>
                            <p className="text-sm text-gray-500">
                              {format(parseISO(appointment.date), 'EEEE, MMMM d, yyyy')} at {appointment.time}
                            </p>
                            <p className="text-xs text-gray-400">Duration: {appointment.duration} minutes</p>
                            {appointment.providers && (
                              <p className="text-xs text-gray-500">
                                with {appointment.providers.title} {appointment.providers.first_name} {appointment.providers.last_name}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                            {appointment.status}
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedAppointment(appointment)}
                          >
                            View Details
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleCancelAppointment(appointment.id)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Past Appointments */}
            {pastAppointments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Past Appointments</CardTitle>
                  <CardDescription>Your appointment history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pastAppointments.slice(0, 5).map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium">{appointment.appointment_type}</p>
                            <p className="text-sm text-gray-500">
                              {format(parseISO(appointment.date), 'MMM d, yyyy')} at {appointment.time}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">Completed</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Secure Messages</h2>
              <Button onClick={() => createConversation()}>
                <Plus className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Message Center</CardTitle>
                <CardDescription>
                  Secure communication with your care team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Type your message to the care team..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1"
                    rows={3}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <VoiceRecorder onTranscription={handleVoiceTranscription} />
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Photo
                    </Button>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Attach
                    </Button>
                  </div>
                  <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>

                {conversations.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                    <p className="text-gray-500">Start a conversation with your care team.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 rounded-lg ${
                          message.sender_type === 'patient' 
                            ? 'bg-blue-100 ml-12' 
                            : 'bg-gray-100 mr-12'
                        }`}
                      >
                        <p className="text-sm">{message.message_text}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(message.created_at), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Billing & Payments</h2>
              <Button>
                <CreditCard className="h-4 w-4 mr-2" />
                Make Payment
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Summary</CardTitle>
                  <CardDescription>Your current balance and payment status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Balance</span>
                    <span className="text-lg font-bold text-green-600">$0.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Insurance Coverage</span>
                    <span className="text-sm font-medium">{patientData.insurance}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Member ID</span>
                    <span className="text-sm font-medium">{patientData.memberID}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment options</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No payment methods</h3>
                    <p className="text-gray-500 mb-4">Add a payment method for easy billing.</p>
                    <Button>Add Payment Method</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>Your past statements and payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No billing history</h3>
                  <p className="text-gray-500">Your billing statements will appear here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Health Forms Tab */}
          <TabsContent value="intake" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Health Forms & Intake</h2>
              <div className="flex items-center space-x-2">
                <VoiceRecorder onTranscription={handleVoiceTranscription} />
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Complete Form
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Voice-Enabled Health Assessment</CardTitle>
                <CardDescription>
                  Complete your health forms using voice input or traditional typing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You can use voice input to quickly complete forms. Just click the microphone button and speak naturally.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      What brings you in today? (Chief Complaint)
                    </label>
                    <div className="mt-1 flex space-x-2">
                      <Textarea
                        placeholder="Describe your main concern or reason for the visit..."
                        value={intakeResponses.chief_complaint || ''}
                        onChange={(e) => setIntakeResponses(prev => ({
                          ...prev,
                          chief_complaint: e.target.value
                        }))}
                        rows={3}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Current Medications
                    </label>
                    <Textarea
                      placeholder="List any medications you're currently taking..."
                      value={intakeResponses.medications || ''}
                      onChange={(e) => setIntakeResponses(prev => ({
                        ...prev,
                        medications: e.target.value
                      }))}
                      rows={2}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Allergies
                    </label>
                    <Textarea
                      placeholder="List any known allergies..."
                      value={intakeResponses.allergies || ''}
                      onChange={(e) => setIntakeResponses(prev => ({
                        ...prev,
                        allergies: e.target.value
                      }))}
                      rows={2}
                      className="mt-1"
                    />
                  </div>

                  {intakeResponses.voice_input && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Voice Input (Auto-transcribed)
                      </label>
                      <Textarea
                        value={intakeResponses.voice_input}
                        onChange={(e) => setIntakeResponses(prev => ({
                          ...prev,
                          voice_input: e.target.value
                        }))}
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Save Draft</Button>
                  <Button>Submit Form</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Profile</h2>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your basic contact and demographic information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">First Name</label>
                      <p className="mt-1 text-sm">{patientData.firstName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Last Name</label>
                      <p className="mt-1 text-sm">{patientData.lastName}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {patientData.email}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {patientData.phone || 'Not provided'}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                    <p className="mt-1 text-sm">{patientData.dateOfBirth || 'Not provided'}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact & Insurance</CardTitle>
                  <CardDescription>Your address and insurance information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    <p className="mt-1 text-sm flex items-start">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                      {patientData.address || 'Not provided'}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Insurance Provider</label>
                    <p className="mt-1 text-sm">{patientData.insurance}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Member ID</label>
                    <p className="mt-1 text-sm">{patientData.memberID}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientPortal;
