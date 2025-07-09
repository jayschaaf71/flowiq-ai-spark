import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { PilotDashboard } from '@/components/admin/PilotDashboard';
import { PlatformTenants } from '@/components/admin/PlatformTenants';
import { PlatformUsers } from '@/components/admin/PlatformUsers';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';

export const Admin = () => {
  const { profile } = useAuth();

  // Check if user has platform admin access
  if (!profile || profile.role !== 'platform_admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 space-y-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pilots">Pilots</TabsTrigger>
            <TabsTrigger value="tenants">Tenants</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminDashboard />
          </TabsContent>
          
          <TabsContent value="pilots">
            <PilotDashboard />
          </TabsContent>

          <TabsContent value="tenants">
            <PlatformTenants />
          </TabsContent>

          <TabsContent value="users">
            <PlatformUsers />
          </TabsContent>

          <TabsContent value="analytics">
            <AdminAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};