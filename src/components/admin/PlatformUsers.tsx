import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { User, Shield, Mail, MoreVertical, Trash2, Loader2, AlertCircle, Send, X } from 'lucide-react';
import { UserInviteDialog } from './UserInviteDialog';
import { usePlatformUsers, type PlatformUser } from '@/hooks/usePlatformUsers';

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
  const { 
    users, 
    isLoading, 
    error, 
    removeUser, 
    isRemoving,
    resendInvite,
    isResendingInvite,
    cancelInvite,
    isCancellingInvite
  } = usePlatformUsers();
  
  const [userToDelete, setUserToDelete] = useState<PlatformUser | null>(null);

  const handleRemoveUser = (user: PlatformUser) => {
    setUserToDelete(user);
  };

  const confirmRemoveUser = () => {
    if (userToDelete) {
      removeUser(userToDelete.id);
      setUserToDelete(null);
    }
  };

  if (isLoading) {
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

      <Card>
        <CardHeader>
          <CardTitle>All Platform Users</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No users found.
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'No Name'}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{user.email || 'No email'}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {user.tenant_name || 'No tenant assigned'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getRoleVariant(user.role) as any}>
                      <Shield className="h-3 w-3 mr-1" />
                      {getRoleDisplayName(user.role)}
                    </Badge>
                    <Badge variant={getStatusVariant(user.status) as any}>
                      {user.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          disabled={isRemoving}
                        >
                          {isRemoving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreVertical className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {user.status === 'pending' && (
                          <>
                            <DropdownMenuItem 
                              onClick={() => resendInvite(user.id)}
                              disabled={isResendingInvite}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Re-send Invite
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => cancelInvite(user.id)}
                              disabled={isCancellingInvite}
                              className="text-destructive"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel Invitation
                            </DropdownMenuItem>
                          </>
                        )}
                        {user.status !== 'pending' && (
                          <DropdownMenuItem 
                            onClick={() => handleRemoveUser(user)} 
                            className="text-destructive"
                            disabled={user.role === 'platform_admin'}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove User
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {userToDelete?.full_name || `${userToDelete?.first_name || ''} ${userToDelete?.last_name || ''}`.trim() || 'this user'} from the platform? 
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