
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface TeamInvitation {
  id: string;
  tenant_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  department?: string;
  personal_message?: string;
  status: string;
  expires_at: string;
  tenants: {
    name: string;
    brand_name: string;
    specialty: string;
  };
}

const AcceptInvitation = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [invitation, setInvitation] = useState<TeamInvitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    const fetchInvitation = async () => {
      if (!token) {
        setError('Invalid invitation link');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('team_invitations')
          .select(`
            *,
            tenants (
              name,
              brand_name,
              specialty
            )
          `)
          .eq('invitation_token', token)
          .single();

        if (error) throw error;

        if (new Date(data.expires_at) < new Date()) {
          setError('This invitation has expired');
        } else if (data.status !== 'pending') {
          setError('This invitation is no longer valid');
        } else {
          setInvitation(data);
        }
      } catch (error) {
        console.error('Error fetching invitation:', error);
        setError('Invitation not found');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [token]);

  const handleAcceptInvitation = async () => {
    if (!invitation || !user) return;

    setAccepting(true);
    try {
      // Add user to tenant
      const { error: tenantUserError } = await supabase
        .from('tenant_users')
        .insert([{
          tenant_id: invitation.tenant_id,
          user_id: user.id,
          role: invitation.role,
          joined_at: new Date().toISOString(),
        }]);

      if (tenantUserError) throw tenantUserError;

      // Update invitation status
      const { error: invitationError } = await supabase
        .from('team_invitations')
        .update({
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
        .eq('id', invitation.id);

      if (invitationError) throw invitationError;

      toast({
        title: 'Welcome to the team!',
        description: `You've successfully joined ${invitation.tenants.brand_name}.`,
      });

      // Navigate to dashboard
      navigate('/');
    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast({
        title: 'Error accepting invitation',
        description: 'There was an issue accepting your invitation. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading invitation...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-900">Invalid Invitation</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/')} 
              className="w-full"
              variant="outline"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to accept this team invitation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/auth')} 
              className="w-full"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <Card className="w-full max-w-lg mx-4">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">You're Invited!</CardTitle>
          <CardDescription>
            Join {invitation?.tenants.brand_name} as a team member
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-lg">
              <strong>{invitation?.first_name} {invitation?.last_name}</strong>
            </p>
            <Badge variant="secondary" className="text-sm">
              {invitation?.role}
            </Badge>
            {invitation?.department && (
              <p className="text-sm text-gray-600">
                {invitation.department} Department
              </p>
            )}
          </div>

          {invitation?.personal_message && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 italic">
                "{invitation.personal_message}"
              </p>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-gray-900">Organization Details</h4>
            <p className="text-sm text-gray-600">
              <strong>Practice:</strong> {invitation?.tenants.brand_name}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Specialty:</strong> {invitation?.tenants.specialty}
            </p>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleAcceptInvitation}
              disabled={accepting}
              className="flex-1"
            >
              {accepting ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Accepting...
                </>
              ) : (
                'Accept Invitation'
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex-1"
            >
              Decline
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            By accepting, you'll gain access to this organization's FlowIQ workspace.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcceptInvitation;
