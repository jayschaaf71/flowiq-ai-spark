import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Search, 
  Plus,
  MoreVertical,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';

export const PracticePatients = () => {
  const patients = [
    { 
      id: 1, 
      name: "Sarah Johnson", 
      email: "sarah@email.com", 
      phone: "(555) 123-4567",
      lastVisit: "2024-01-15",
      status: "active",
      upcoming: "Jan 22, 2024"
    },
    { 
      id: 2, 
      name: "Mike Chen", 
      email: "mike@email.com", 
      phone: "(555) 987-6543",
      lastVisit: "2024-01-10",
      status: "active",
      upcoming: null
    },
    { 
      id: 3, 
      name: "Lisa Rodriguez", 
      email: "lisa@email.com", 
      phone: "(555) 456-7890",
      lastVisit: "2023-12-20",
      status: "inactive",
      upcoming: "Jan 25, 2024"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Patient Management</h1>
          <p className="text-muted-foreground">Manage your practice's patient records</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Patient
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search patients..." className="pl-8" />
            </div>
            <Button variant="outline">Filter</Button>
            <Button variant="outline">Export</Button>
          </div>
        </CardContent>
      </Card>

      {/* Patient List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Patients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {patients.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{patient.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3" />
                        <span>{patient.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                      <span>Last visit: {patient.lastVisit}</span>
                      {patient.upcoming && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Next: {patient.upcoming}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={patient.status === 'active' ? 'default' : 'secondary'}>
                    {patient.status}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};