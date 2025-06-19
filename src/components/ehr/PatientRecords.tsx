
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Filter,
  MoreVertical,
  Phone,
  Mail,
  Calendar,
  FileText,
  User
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const PatientRecords = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const mockPatients = [
    {
      id: "1",
      name: "Sarah Johnson",
      dob: "1985-03-15",
      phone: "(555) 123-4567",
      email: "sarah.johnson@email.com",
      insuranceProvider: "BlueCross BlueShield",
      lastVisit: "2024-01-10",
      diagnosisHistory: ["Lower back pain", "Sciatica"],
      visitCount: 12,
      status: "Active"
    },
    {
      id: "2",
      name: "Mike Chen",
      dob: "1990-07-22",
      phone: "(555) 234-5678",
      email: "mike.chen@email.com",
      insuranceProvider: "Aetna",
      lastVisit: "2024-01-08",
      diagnosisHistory: ["Neck strain", "Headaches"],
      visitCount: 8,
      status: "Active"
    },
    {
      id: "3",
      name: "Lisa Williams",
      dob: "1978-11-03",
      phone: "(555) 345-6789",
      email: "lisa.williams@email.com",
      insuranceProvider: "Cigna",
      lastVisit: "2023-12-20",
      diagnosisHistory: ["Shoulder impingement", "Tennis elbow"],
      visitCount: 15,
      status: "Inactive"
    }
  ];

  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.diagnosisHistory.some(diagnosis => 
      diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search patients by name, email, or condition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Patient
          </Button>
        </div>
      </div>

      {/* Patient List */}
      <div className="grid gap-4">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{patient.name}</CardTitle>
                    <CardDescription>
                      DOB: {new Date(patient.dob).toLocaleDateString()} • 
                      {" "}{patient.visitCount} visits
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={patient.status === 'Active' ? 'default' : 'secondary'}>
                    {patient.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit Patient</DropdownMenuItem>
                      <DropdownMenuItem>Schedule Appointment</DropdownMenuItem>
                      <DropdownMenuItem>View Notes</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {patient.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {patient.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  Insurance: {patient.insuranceProvider}
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Recent Diagnoses:</p>
                <div className="flex flex-wrap gap-2">
                  {patient.diagnosisHistory.map((diagnosis, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {diagnosis}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Notes
                </Button>
                <Button size="sm" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
                <Button size="sm">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? `No patients match "${searchTerm}"` : "No patients in the system"}
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Patient
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
