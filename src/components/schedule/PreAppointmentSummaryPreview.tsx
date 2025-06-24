
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAppointments } from '@/hooks/useAppointments';
import { preAppointmentSummaryService, PreAppointmentSummary } from '@/services/preAppointmentSummaryService';
import { 
  User, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  Heart,
  Pill,
  FileText,
  Send
} from 'lucide-react';

export const PreAppointmentSummaryPreview = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<string>('');
  const [summaryData, setSummaryData] = useState<PreAppointmentSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const { appointments } = useAppointments();
  const { toast } = useToast();

  // Filter to confirmed appointments with providers
  const confirmedAppointments = appointments.filter(apt => 
    apt.status === 'confirmed' && apt.provider_id
  );

  const handleGeneratePreview = async () => {
    if (!selectedAppointment) {
      toast({
        title: "Error",
        description: "Please select an appointment first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const data = await preAppointmentSummaryService.generatePatientSummary(selectedAppointment);
      setSummaryData(data);
      
      if (data) {
        toast({
          title: "Preview Generated",
          description: `Pre-appointment summary for ${data.patient.name} is ready`,
        });
      } else {
        toast({
          title: "No Data",
          description: "No summary data available for this appointment",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error generating preview:', error);
      toast({
        title: "Error",
        description: "Failed to generate summary preview",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendSummary = async () => {
    if (!selectedAppointment || !summaryData) return;
    
    const appointment = appointments.find(apt => apt.id === selectedAppointment);
    if (!appointment?.provider_id) {
      toast({
        title: "Error",
        description: "No provider assigned to this appointment",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const success = await preAppointmentSummaryService.sendPreAppointmentSummary(
        selectedAppointment, 
        appointment.provider_id
      );
      
      if (success) {
        toast({
          title: "Summary Sent",
          description: "Pre-appointment summary has been sent to the provider",
        });
      } else {
        toast({
          title: "Send Failed",
          description: "Failed to send summary to provider",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending summary:', error);
      toast({
        title: "Error",
        description: "Error occurred while sending summary",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getFlagColor = (flagType: string) => {
    switch (flagType) {
      case 'high_priority': return 'bg-red-100 text-red-800 border-red-200';
      case 'follow_up_needed': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'insurance_issue': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'special_needs': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Pre-Appointment Patient Summaries</h3>
          <p className="text-sm text-gray-600">
            Generate and send patient summaries before appointments to help providers prepare
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Summary Preview</CardTitle>
          <CardDescription>
            Select an appointment to preview the patient summary that will be sent to the provider
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Appointment</label>
            <Select value={selectedAppointment} onValueChange={setSelectedAppointment}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an appointment..." />
              </SelectTrigger>
              <SelectContent>
                {confirmedAppointments.map(appointment => (
                  <SelectItem key={appointment.id} value={appointment.id}>
                    {appointment.date} at {appointment.time} - {appointment.title} ({appointment.appointment_type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleGeneratePreview}
              disabled={loading || !selectedAppointment}
              variant="outline"
              className="flex-1"
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Preview
            </Button>
            <Button
              onClick={handleSendSummary}
              disabled={loading || !selectedAppointment || !summaryData}
              className="flex-1"
            >
              <Send className="w-4 h-4 mr-2" />
              Send to Provider
            </Button>
          </div>
        </CardContent>
      </Card>

      {summaryData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Patient Summary: {summaryData.patient.name}
            </CardTitle>
            <CardDescription>
              Pre-appointment summary for {summaryData.appointment.date} at {summaryData.appointment.time}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Patient Info */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <h4 className="font-medium">{summaryData.patient.name}</h4>
                  <p className="text-sm text-gray-600">Age: {summaryData.patient.age}</p>
                  {summaryData.patient.phone && (
                    <p className="text-sm text-gray-600">Phone: {summaryData.patient.phone}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{summaryData.appointment.type}</p>
                  <p className="text-sm text-gray-600">{summaryData.appointment.duration} minutes</p>
                </div>
              </div>

              {/* Appointment Objective */}
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Appointment Objective</span>
                </div>
                <p className="text-sm text-gray-700">{summaryData.appointment.objective}</p>
              </div>

              {/* Last Visit */}
              {summaryData.lastVisit && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium">Last Visit</span>
                  </div>
                  <p className="text-sm">
                    <strong>{summaryData.lastVisit.date}</strong> ({summaryData.lastVisit.daysSince} days ago)
                  </p>
                  <p className="text-sm text-gray-600">{summaryData.lastVisit.type}</p>
                  {summaryData.lastVisit.summary && (
                    <p className="text-sm text-gray-700 mt-1">{summaryData.lastVisit.summary}</p>
                  )}
                </div>
              )}

              {/* Flags */}
              {summaryData.flags.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <h4 className="font-medium">Important Flags</h4>
                  </div>
                  <div className="space-y-2">
                    {summaryData.flags.map((flag, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Badge className={getFlagColor(flag.type)}>
                          {flag.type.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <p className="text-sm flex-1">{flag.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Medical History */}
              {summaryData.medicalHistory.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-4 h-4 text-red-600" />
                    <h4 className="font-medium">Active Medical Conditions</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {summaryData.medicalHistory.map((condition, index) => (
                      <div key={index} className="p-2 border rounded text-sm">
                        <span className="font-medium">{condition.condition}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {condition.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Medications */}
              {summaryData.currentMedications.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Pill className="w-4 h-4 text-blue-600" />
                    <h4 className="font-medium">Current Medications</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {summaryData.currentMedications.map((med, index) => (
                      <div key={index} className="p-2 border rounded text-sm">
                        <div className="font-medium">{med.name}</div>
                        {med.dosage && <div className="text-gray-600">{med.dosage}</div>}
                        {med.frequency && <div className="text-gray-500 text-xs">{med.frequency}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Allergies */}
              {summaryData.allergies.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <h4 className="font-medium">Allergies</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {summaryData.allergies.map((allergy, index) => (
                      <div key={index} className="p-2 border rounded text-sm">
                        <div className="font-medium">{allergy.allergen}</div>
                        {allergy.severity && (
                          <Badge variant="outline" className={`text-xs ${allergy.severity === 'severe' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {allergy.severity}
                          </Badge>
                        )}
                        {allergy.reaction && <div className="text-gray-600 text-xs">{allergy.reaction}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Notes */}
              {summaryData.recentNotes.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <h4 className="font-medium">Recent Visit Notes</h4>
                  </div>
                  <div className="space-y-2">
                    {summaryData.recentNotes.map((note, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                        {note}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
