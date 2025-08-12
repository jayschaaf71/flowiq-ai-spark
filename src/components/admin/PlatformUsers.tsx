import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { User, Shield, Mail, MoreVertical, Trash2, Loader2, AlertCircle, Send, X, MessageSquare, Settings } from 'lucide-react';
import { UserInviteDialog } from './UserInviteDialog';
import { useRealPlatformMetrics } from '@/hooks/useRealPlatformMetrics';

const getRoleDisplayName = (role: string) => {
  const roleMap: Record<string, string> = {
    'platform_admin': 'Platform Admin',
    'practice_admin': 'Practice Admin',
    'practice_manager': 'Practice Manager',
    'provider': 'Provider',
    'staff': 'Staff',
  };
  return roleMap[role] || role;
};

const getRoleVariant = (role: string) => {
  if (role === 'platform_admin') return 'default';
  if (role === 'practice_admin') return 'secondary';
  return 'outline';
};

const getStatusVariant = (status: string) => {
  if (status === 'active') return 'default';
  if (status === 'inactive') return 'destructive';
  return 'secondary';
};

export const PlatformUsers = () => {
  const { users, loading, error } = useRealPlatformMetrics();
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [userToMessage, setUserToMessage] = useState<any>(null);
  const [userToManage, setUserToManage] = useState<any>(null);

  console.log('🔧 [PlatformUsers] Component rendered', { users, loading, error });

  const handleRemoveUser = (user: any) => {
    setUserToDelete(user);
  };

  const confirmRemoveUser = () => {
    if (userToDelete) {
      console.log('🔧 [PlatformUsers] Removing user:', userToDelete);
      // In a real implementation, this would call an API to remove the user
      alert(`Removing user ${userToDelete.first_name} ${userToDelete.last_name}... (This would call an API in production)`);
      setUserToDelete(null);
    }
  };

  const handleSendMessage = (user: any) => {
    console.log('🔧 [PlatformUsers] Sending message to user:', user);
    setUserToMessage(user);
  };

  const confirmSendMessage = () => {
    if (userToMessage) {
      console.log('🔧 [PlatformUsers] Sending message to:', userToMessage);
      // In a real implementation, this would open a message dialog or send an email
      alert(`Sending message to ${userToMessage.first_name} ${userToMessage.last_name}... (This would open a message dialog in production)`);
      setUserToMessage(null);
    }
  };

  const handleManagePermissions = (user: any) => {
    console.log('🔧 [PlatformUsers] Managing permissions for user:', user);
    setUserToManage(user);
  };

  const confirmManagePermissions = () => {
    if (userToManage) {
      console.log('🔧 [PlatformUsers] Managing permissions for:', userToManage);
      // In a real implementation, this would open a permissions management dialog
      alert(`Managing permissions for ${userToManage.first_name} ${userToManage.last_name}... (This would open a permissions dialog in production)`);
      setUserToManage(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage platform users across all tenants</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading users...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage platform users across all tenants</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>Error loading users. Please try again.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage platform users across all tenants</p>
        </div>
        <UserInviteDialog />
      </div>

      <div className="grid gap-6">
        {users?.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{user.first_name} {user.last_name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge variant={getRoleVariant(user.role)}>
                  {getRoleDisplayName(user.role)}
                </Badge>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleSendMessage(user)}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleManagePermissions(user)}>
                      <Shield className="h-4 w-4 mr-2" />
                      Manage Permissions
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleRemoveUser(user)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        )) || []}
      </div>

      {/* Remove User Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {userToDelete?.first_name} {userToDelete?.last_name}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveUser}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Send Message Dialog */}
      <AlertDialog open={!!userToMessage} onOpenChange={() => setUserToMessage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Message</AlertDialogTitle>
            <AlertDialogDescription>
              Send a message to {userToMessage?.first_name} {userToMessage?.last_name} ({userToMessage?.email})?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSendMessage}>Send Message</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Manage Permissions Dialog */}
      <AlertDialog open={!!userToManage} onOpenChange={() => setUserToManage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Manage Permissions</AlertDialogTitle>
            <AlertDialogDescription>
              Manage permissions for {userToManage?.first_name} {userToManage?.last_name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmManagePermissions}>Manage</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};