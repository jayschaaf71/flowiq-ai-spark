import React, { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, CreditCard, DollarSign, BarChart3, FileText, Settings } from 'lucide-react';

// Placeholder components - these would be implemented with actual functionality
const RevenueDashboard = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
        <p className="text-3xl font-bold text-green-600">$124,567</p>
        <p className="text-sm text-gray-500">+12% from last month</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Outstanding Balance</h3>
        <p className="text-3xl font-bold text-orange-600">$23,456</p>
        <p className="text-sm text-gray-500">15% of total revenue</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Collection Rate</h3>
        <p className="text-3xl font-bold text-blue-600">94.2%</p>
        <p className="text-sm text-gray-500">+2.1% from last month</p>
      </div>
    </div>
    
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Revenue Trends</h3>
      <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
        <p className="text-gray-500">Revenue chart will be displayed here</p>
      </div>
    </div>
  </div>
);

const BillingWorkflow = () => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Billing Automation</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded">
          <div>
            <h4 className="font-medium">Auto-Invoice Generation</h4>
            <p className="text-sm text-gray-500">Automatically generate invoices after appointments</p>
          </div>
          <Badge className="bg-green-100 text-green-700">Active</Badge>
        </div>
        <div className="flex items-center justify-between p-4 border rounded">
          <div>
            <h4 className="font-medium">Insurance Verification</h4>
            <p className="text-sm text-gray-500">Real-time insurance eligibility checks</p>
          </div>
          <Badge className="bg-green-100 text-green-700">Active</Badge>
        </div>
        <div className="flex items-center justify-between p-4 border rounded">
          <div>
            <h4 className="font-medium">Claim Submission</h4>
            <p className="text-sm text-gray-500">Automated claim processing and submission</p>
          </div>
          <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
        </div>
      </div>
    </div>
  </div>
);

const PaymentProcessingCenter = () => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Payment Processing</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium">Online Payments</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Stripe Integration</span>
              <Badge className="bg-green-100 text-green-700">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Payment Plans</span>
              <Badge className="bg-green-100 text-green-700">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Auto-Pay</span>
              <Badge className="bg-yellow-100 text-yellow-700">Setup Required</Badge>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="font-medium">Collections</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Automated Reminders</span>
              <Badge className="bg-green-100 text-green-700">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Payment Plans</span>
              <Badge className="bg-green-100 text-green-700">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Collections Agency</span>
              <Badge className="bg-gray-100 text-gray-700">Inactive</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const RevenueAnalytics = () => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Revenue Analytics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-3">Revenue by Service</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Chiropractic Care</span>
              <span className="font-medium">$45,230</span>
            </div>
            <div className="flex justify-between">
              <span>Physical Therapy</span>
              <span className="font-medium">$32,150</span>
            </div>
            <div className="flex justify-between">
              <span>Consultations</span>
              <span className="font-medium">$28,450</span>
            </div>
            <div className="flex justify-between">
              <span>Supplements</span>
              <span className="font-medium">$18,737</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-3">Payment Methods</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Insurance</span>
              <span className="font-medium">65%</span>
            </div>
            <div className="flex justify-between">
              <span>Credit Card</span>
              <span className="font-medium">25%</span>
            </div>
            <div className="flex justify-between">
              <span>Cash</span>
              <span className="font-medium">8%</span>
            </div>
            <div className="flex justify-between">
              <span>Other</span>
              <span className="font-medium">2%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CollectionsManagement = () => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Collections Management</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded">
          <div>
            <h4 className="font-medium">Outstanding Balances</h4>
            <p className="text-sm text-gray-500">$23,456 across 45 accounts</p>
          </div>
          <Badge className="bg-orange-100 text-orange-700">45 Accounts</Badge>
        </div>
        <div className="flex items-center justify-between p-4 border rounded">
          <div>
            <h4 className="font-medium">Payment Plans</h4>
            <p className="text-sm text-gray-500">12 active payment plans</p>
          </div>
          <Badge className="bg-green-100 text-green-700">Active</Badge>
        </div>
        <div className="flex items-center justify-between p-4 border rounded">
          <div>
            <h4 className="font-medium">Auto-Pay Setup</h4>
            <p className="text-sm text-gray-500">8 patients with auto-pay enabled</p>
          </div>
          <Badge className="bg-blue-100 text-blue-700">8 Active</Badge>
        </div>
      </div>
    </div>
  </div>
);

const FinancialReporting = () => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Financial Reports</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium">Monthly Reports</h4>
          <div className="space-y-2">
            <button className="w-full text-left p-3 border rounded hover:bg-gray-50">
              <div className="font-medium">Revenue Summary</div>
              <div className="text-sm text-gray-500">January 2024</div>
            </button>
            <button className="w-full text-left p-3 border rounded hover:bg-gray-50">
              <div className="font-medium">Collections Report</div>
              <div className="text-sm text-gray-500">January 2024</div>
            </button>
            <button className="w-full text-left p-3 border rounded hover:bg-gray-50">
              <div className="font-medium">Insurance Claims</div>
              <div className="text-sm text-gray-500">January 2024</div>
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="font-medium">Quick Actions</h4>
          <div className="space-y-2">
            <button className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700">
              Generate Monthly Report
            </button>
            <button className="w-full p-3 bg-green-600 text-white rounded hover:bg-green-700">
              Export Financial Data
            </button>
            <button className="w-full p-3 bg-purple-600 text-white rounded hover:bg-purple-700">
              Schedule Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const RevenueIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Revenue iQ"
        subtitle="Complete revenue cycle management with AI-powered billing, payments, and financial analytics"
      >
        <div className="flex gap-2">
          <Badge className="bg-blue-100 text-blue-700">AI Agent</Badge>
          <Badge className="bg-green-100 text-green-700">
            <TrendingUp className="w-3 h-3 mr-1" />
            Revenue Optimization
          </Badge>
        </div>
      </PageHeader>
      
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <RevenueDashboard />
        </TabsContent>
        
        <TabsContent value="billing">
          <BillingWorkflow />
        </TabsContent>
        
        <TabsContent value="payments">
          <PaymentProcessingCenter />
        </TabsContent>
        
        <TabsContent value="analytics">
          <RevenueAnalytics />
        </TabsContent>
        
        <TabsContent value="collections">
          <CollectionsManagement />
        </TabsContent>
        
        <TabsContent value="reports">
          <FinancialReporting />
        </TabsContent>
      </Tabs>
    </div>
  );
}; 