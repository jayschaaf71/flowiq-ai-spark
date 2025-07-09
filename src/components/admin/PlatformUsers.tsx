import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { User, Shield, Mail, MoreVertical, Trash2 } from 'lucide-react';
import { UserInviteDialog } from './UserInviteDialog';
import { useToast } from '@/hooks/use-toast';

export const PlatformUsers = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Dr. Mark Thompson", email: "mark.thompson@westcountyspine.com", role: "practice_admin", tenant: "West County Spine & Joint", status: "active" },
    { id: 2, name: "Dr. Amanda Chen", email: "amanda.chen@midwestdentalsleep.com", role: "practice_admin", tenant: "Midwest Dental Sleep Medicine", status: "active" },
    { id: 3, name: "Sarah Wilson", email: "sarah.wilson@westcountyspine.com", role: "staff", tenant: "West County Spine & Joint", status: "pending" },
    { id: 4, name: "James Parker", email: "james.parker@midwestdentalsleep.com", role: "staff", tenant: "Midwest Dental Sleep Medicine", status: "active" },
  ]);
  const [userToDelete, setUserToDelete] = useState<typeof users[0] | null>(null);
  const { toast } = useToast();

  const handleRemoveUser = (user: typeof users[0]) => {
    setUserToDelete(user);
  };

  const confirmRemoveUser = () => {
    if (userToDelete) {
      setUsers(users.filter(u => u.id !== userToDelete.id));
      toast({
        title: "User removed",
        description: `${userToDelete.name} has been removed from the platform.`,
      });
      setUserToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage platform users across all tenants</p>
        </div>
        <UserInviteDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Platform Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span>{user.email}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.tenant}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    <Shield className="h-3 w-3 mr-1" />
                    {user.role}
                  </Badge>
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                    {user.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleRemoveUser(user)} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {userToDelete?.name} from the platform? 
              This action cannot be undone and will revoke their access to all tenants.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmRemoveUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};