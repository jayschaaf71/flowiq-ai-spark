import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { 
  Building, 
  Users, 
  Settings, 
  ExternalLink, 
  ArrowLeft,
  Calendar,
  Activity,
  Shield,
  Database
} from 'lucide-react';

export const TenantDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tenant = location.state?.tenant;

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [showUserManagementDialog, setShowUserManagementDialog] = useState(false);
  const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);

  console.log('🔧 [TenantDetails] Component rendered', { tenant });

  const handleEditTenant = () => {
    console.log('🔧 [TenantDetails] Editing tenant:', tenant);
    setShowEditDialog(true);
  };

  const handleVisitTenant = () => {
    console.log('🔧 [TenantDetails] Visiting tenant:', tenant);
    if (tenant?.subdomain) {
      const tenantUrl = `https://${tenant.subdomain}.flow-iq.ai`;
      window.open(tenantUrl, '_blank');
    } else {
      alert('No subdomain configured for this tenant');
    }
  };

  const handleEditInformation = () => {
    console.log('🔧 [TenantDetails] Editing tenant information');
    alert('Opening tenant information editor... (This would open an edit form in production)');
  };

  const handleConfigureSettings = () => {
    console.log('🔧 [TenantDetails] Configuring tenant settings');
    setShowConfigDialog(true);
  };

  const handleManageUsers = () => {
    console.log('🔧 [TenantDetails] Managing users for tenant');
    setShowUserManagementDialog(true);
  };

  const handleViewAnalytics = () => {
    console.log('🔧 [TenantDetails] Viewing tenant analytics');
    setShowAnalyticsDialog(true);
  };

  if (!tenant) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/platform-admin/tenants')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tenants
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Tenant Not Found</h2>
              <p className="text-muted-foreground">The requested tenant could not be found.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/platform-admin/tenants')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tenants
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{tenant.name || 'Unnamed Tenant'}</h1>
            <p className="text-muted-foreground">Tenant details and configuration</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEditTenant}>
            <Settings className="h-4 w-4 mr-2" />
            Edit Tenant
          </Button>
          <Button onClick={handleVisitTenant}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit Tenant
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant={tenant.is_active ? 'default' : 'secondary'}>
                {tenant.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Created {new Date(tenant.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Active users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Specialty</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenant.specialty || 'General'}</div>
            <p className="text-xs text-muted-foreground">
              Practice type
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Domain</CardTitle>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenant.subdomain || 'No domain'}</div>
            <p className="text-xs text-muted-foreground">
              .flow-iq.ai
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Tenant Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Business Name</span>
              <span className="text-sm text-muted-foreground">{tenant.business_name || 'Not set'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Address</span>
              <span className="text-sm text-muted-foreground">{tenant.address || 'Not set'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>City</span>
              <span className="text-sm text-muted-foreground">{tenant.city || 'Not set'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>State</span>
              <span className="text-sm text-muted-foreground">{tenant.state || 'Not set'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Phone</span>
              <span className="text-sm text-muted-foreground">{tenant.phone || 'Not set'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Email</span>
              <span className="text-sm text-muted-foreground">{tenant.email || 'Not set'}</span>
            </div>
            <Button className="w-full" variant="outline" onClick={handleEditInformation}>
              <Building className="h-4 w-4 mr-2" />
              Edit Information
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Practice Type</span>
              <Badge variant="secondary">{tenant.practice_type || 'specialty_clinic'}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Custom Branding</span>
              <Badge variant={tenant.settings?.branding?.custom_logo ? 'default' : 'secondary'}>
                {tenant.settings?.branding?.custom_logo ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>White Label</span>
              <Badge variant={tenant.settings?.branding?.white_label ? 'default' : 'secondary'}>
                {tenant.settings?.branding?.white_label ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>2FA Required</span>
              <Badge variant={tenant.settings?.security?.two_factor_required ? 'default' : 'secondary'}>
                {tenant.settings?.security?.two_factor_required ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Session Timeout</span>
              <span className="text-sm text-muted-foreground">
                {tenant.settings?.security?.session_timeout_minutes || 480} minutes
              </span>
            </div>
            <Button className="w-full" variant="outline" onClick={handleConfigureSettings}>
              <Settings className="h-4 w-4 mr-2" />
              Configure Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Total Users</span>
              <Badge variant="secondary">0</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Admin Users</span>
              <Badge variant="secondary">0</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Active Sessions</span>
              <Badge variant="secondary">0</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Last Activity</span>
              <span className="text-sm text-muted-foreground">Never</span>
            </div>
            <Button className="w-full" variant="outline" onClick={handleManageUsers}>
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Usage Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Storage Used</span>
              <Badge variant="secondary">0 MB</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>API Calls</span>
              <Badge variant="secondary">0</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Database Queries</span>
              <Badge variant="secondary">0</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Last Backup</span>
              <span className="text-sm text-muted-foreground">Never</span>
            </div>
            <Button className="w-full" variant="outline" onClick={handleViewAnalytics}>
              <Activity className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Edit Tenant Dialog */}
      <AlertDialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Tenant</AlertDialogTitle>
            <AlertDialogDescription>
              Edit settings for {tenant.name}? This will open the tenant configuration panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => setShowEditDialog(false)}>Edit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Configure Settings Dialog */}
      <AlertDialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Configure Settings</AlertDialogTitle>
            <AlertDialogDescription>
              Configure security, branding, and other settings for {tenant.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => setShowConfigDialog(false)}>Configure</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* User Management Dialog */}
      <AlertDialog open={showUserManagementDialog} onOpenChange={setShowUserManagementDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>User Management</AlertDialogTitle>
            <AlertDialogDescription>
              Manage users for {tenant.name}? This will open the user management panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => setShowUserManagementDialog(false)}>Manage</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Analytics Dialog */}
      <AlertDialog open={showAnalyticsDialog} onOpenChange={setShowAnalyticsDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usage Analytics</AlertDialogTitle>
            <AlertDialogDescription>
              View detailed analytics and usage statistics for {tenant.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => setShowAnalyticsDialog(false)}>View</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}; 