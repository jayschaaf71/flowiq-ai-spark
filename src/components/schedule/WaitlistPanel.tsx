import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, MessageSquare, Eye, Plus, Clock, AlertTriangle, UserCheck, Brain, RefreshCw, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WaitlistItem {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  preferredDate: string;
  preferredTime: string;
  appointmentType: string;
  priority: 'high' | 'medium' | 'low';
  addedDate: string;
  notes?: string;
  status: 'waiting' | 'contacted' | 'scheduled' | 'expired';
  urgency: 'urgent' | 'routine' | 'followup';
  insurance: string;
  lastContactDate?: string;
  contactAttempts: number;
}

export const WaitlistPanel = () => {
  const { toast } = useToast();
  const [waitlistItems, setWaitlistItems] = useState<WaitlistItem[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WaitlistItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock data
  useEffect(() => {
    const mockWaitlistItems: WaitlistItem[] = [
      {
        id: '1',
        patientName: 'John Smith',
        patientPhone: '(555) 123-4567',
        patientEmail: 'john.smith@email.com',
        preferredDate: '2024-01-15',
        preferredTime: '09:00',
        appointmentType: 'Sleep Study Consultation',
        priority: 'high',
        addedDate: '2024-01-10',
        notes: 'Urgent case - severe sleep apnea, patient experiencing extreme fatigue',
        status: 'waiting',
        urgency: 'urgent',
        insurance: 'Blue Cross Blue Shield',
        contactAttempts: 1,
      },
      {
        id: '2',
        patientName: 'Sarah Wilson',
        patientPhone: '(555) 234-5678',
        patientEmail: 'sarah.wilson@email.com',
        preferredDate: '2024-01-20',
        preferredTime: '14:00',
        appointmentType: 'CPAP Fitting',
        priority: 'medium',
        addedDate: '2024-01-12',
        status: 'waiting',
        urgency: 'routine',
        insurance: 'Aetna',
        contactAttempts: 0,
      },
      {
        id: '3',
        patientName: 'Mike Davis',
        patientPhone: '(555) 345-6789',
        patientEmail: 'mike.davis@email.com',
        preferredDate: '2024-01-18',
        preferredTime: '10:00',
        appointmentType: 'Follow-up Visit',
        priority: 'low',
        addedDate: '2024-01-11',
        status: 'contacted',
        urgency: 'followup',
        insurance: 'Cigna',
        lastContactDate: '2024-01-13',
        contactAttempts: 2,
      },
      {
        id: '4',
        patientName: 'Emily Johnson',
        patientPhone: '(555) 456-7890',
        patientEmail: 'emily.johnson@email.com',
        preferredDate: '2024-01-22',
        preferredTime: '11:00',
        appointmentType: 'Sleep Study Consultation',
        priority: 'high',
        addedDate: '2024-01-14',
        notes: 'Patient reports severe snoring and daytime sleepiness',
        status: 'waiting',
        urgency: 'urgent',
        insurance: 'UnitedHealth',
        contactAttempts: 0,
      },
    ];

    setWaitlistItems(mockWaitlistItems);
  }, []);

  const handleContactPatient = (item: WaitlistItem) => {
    toast({
      title: 'Patient Contacted',
      description: `Contacted ${item.patientName} via ${item.patientEmail}`,
    });
  };

  const handleViewDetails = (item: WaitlistItem) => {
    setSelectedItem(item);
    setShowDetailsDialog(true);
  };

  const handleRemoveFromWaitlist = (itemId: string) => {
    setWaitlistItems(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: 'Patient Removed',
      description: 'Patient removed from waitlist',
    });
  };

  const handleAutoFillWaitlist = async () => {
    setIsProcessing(true);
    toast({
      title: 'AI Processing',
      description: 'AI is analyzing cancellations and matching waitlist patients...',
    });

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate AI filling appointments
    const updatedWaitlist = waitlistItems.map(item => {
      if (item.id === '1') {
        return { ...item, status: 'scheduled' as const };
      }
      return item;
    });

    setWaitlistItems(updatedWaitlist);

    toast({
      title: 'AI Waitlist Update Complete',
      description: 'Successfully filled 1 cancellation with waitlist patient.',
    });

    setIsProcessing(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'routine': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'followup': return <UserCheck className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const waitingCount = waitlistItems.filter(item => item.status === 'waiting').length;
  const highPriorityCount = waitlistItems.filter(item => item.priority === 'high').length;
  const urgentCount = waitlistItems.filter(item => item.urgency === 'urgent').length;

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Waitlist
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleAutoFillWaitlist}
                disabled={isProcessing}
              >
                <Brain className="w-4 h-4 mr-1" />
                {isProcessing ? 'Processing...' : 'AI Fill'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.location.href = '/schedule-settings'}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-blue-50 rounded">
              <div className="font-bold text-blue-600">{waitlistItems.length}</div>
              <div className="text-blue-500">Total</div>
            </div>
            <div className="text-center p-2 bg-red-50 rounded">
              <div className="font-bold text-red-600">{highPriorityCount}</div>
              <div className="text-red-500">High</div>
            </div>
            <div className="text-center p-2 bg-orange-50 rounded">
              <div className="font-bold text-orange-600">{urgentCount}</div>
              <div className="text-orange-500">Urgent</div>
            </div>
          </div>

          {/* Waitlist Items */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {waitlistItems.map((item) => (
              <div key={item.id} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getUrgencyIcon(item.urgency)}
                    <div>
                      <p className="font-medium text-sm">{item.patientName}</p>
                      <p className="text-xs text-gray-600">{item.appointmentType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="text-xs text-gray-600">
                  <p>Preferred: {item.preferredDate} at {item.preferredTime}</p>
                  <p>Added: {item.addedDate}</p>
                </div>

                {item.notes && (
                  <div className="text-xs">
                    <p className="text-gray-600">Notes:</p>
                    <p className="italic">{item.notes}</p>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-6"
                    onClick={() => handleContactPatient(item)}
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-6"
                    onClick={() => handleViewDetails(item)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Add to Waitlist Button */}
          <Button
            className="w-full"
            variant="outline"
            size="sm"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Waitlist
          </Button>
        </CardContent>
      </Card>

      {/* Add to Waitlist Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Patient to Waitlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Patient Name</Label>
              <Input placeholder="Enter patient name" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input placeholder="Enter phone number" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input placeholder="Enter email address" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Preferred Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Preferred Time</Label>
                <Input type="time" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Appointment Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select appointment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sleep-study">Sleep Study Consultation</SelectItem>
                  <SelectItem value="cpap-fitting">CPAP Fitting</SelectItem>
                  <SelectItem value="follow-up">Follow-up Visit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="Enter any additional notes" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast({
                  title: 'Patient Added',
                  description: 'Patient added to waitlist successfully',
                });
                setShowAddDialog(false);
              }}>
                Add to Waitlist
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Patient Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="space-y-2">
                <p><strong>Name:</strong> {selectedItem.patientName}</p>
                <p><strong>Phone:</strong> {selectedItem.patientPhone}</p>
                <p><strong>Email:</strong> {selectedItem.patientEmail}</p>
                <p><strong>Appointment Type:</strong> {selectedItem.appointmentType}</p>
                <p><strong>Preferred Date:</strong> {selectedItem.preferredDate}</p>
                <p><strong>Preferred Time:</strong> {selectedItem.preferredTime}</p>
                <p><strong>Insurance:</strong> {selectedItem.insurance}</p>
                <p><strong>Added Date:</strong> {selectedItem.addedDate}</p>
                <p><strong>Contact Attempts:</strong> {selectedItem.contactAttempts}</p>
                {selectedItem.notes && (
                  <p><strong>Notes:</strong> {selectedItem.notes}</p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={getPriorityColor(selectedItem.priority)}>
                  {selectedItem.priority} priority
                </Badge>
                <Badge className={getStatusColor(selectedItem.status)}>
                  {selectedItem.status}
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => handleContactPatient(selectedItem)}>
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Patient
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}; 