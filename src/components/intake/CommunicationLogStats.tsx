
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Users
} from 'lucide-react';

interface CommunicationStats {
  total: number;
  sent: number;
  pending: number;
  failed: number;
  delivered: number;
  emailCount: number;
  smsCount: number;
}

interface CommunicationLogStatsProps {
  stats: CommunicationStats;
}

export const CommunicationLogStats: React.FC<CommunicationLogStatsProps> = ({ stats }) => {
  const deliveryRate = stats.sent > 0 ? Math.round((stats.delivered / stats.sent) * 100) : 0;
  const successRate = stats.total > 0 ? Math.round(((stats.sent + stats.delivered) / stats.total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-xs text-gray-600">Total</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.sent}</div>
          <div className="text-xs text-gray-600">Sent</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-xs text-gray-600">Pending</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          <div className="text-xs text-gray-600">Failed</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Mail className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">{stats.emailCount}</div>
          <div className="text-xs text-gray-600">Emails</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <MessageSquare className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-teal-600">{stats.smsCount}</div>
          <div className="text-xs text-gray-600">SMS</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-600">{successRate}%</div>
          <div className="text-xs text-gray-600">Success Rate</div>
        </CardContent>
      </Card>
    </div>
  );
};
