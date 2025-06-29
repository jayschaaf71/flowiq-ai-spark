
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuditLogs } from "@/hooks/useAuditLog";
import { Search, Download, Filter, Eye, Shield, User, Clock } from "lucide-react";

export const SecurityAuditTrail = () => {
  const { data: auditLogs, loading } = useAuditLogs();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLogs, setFilteredLogs] = useState(auditLogs || []);

  useEffect(() => {
    if (auditLogs) {
      const filtered = auditLogs.filter(log => 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.table_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.user_id && log.user_id.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredLogs(filtered);
    }
  }, [auditLogs, searchTerm]);

  const getRiskLevel = (action: string) => {
    if (action.includes('DELETE')) return 'high';
    if (action.includes('UPDATE')) return 'medium';
    return 'low';
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'high':
        return <Badge variant="destructive">High Risk</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium Risk</Badge>;
      default:
        return <Badge variant="outline">Low Risk</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Audit Trail
          </CardTitle>
          <CardDescription>
            Complete audit log of all system access and data modifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search audit logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center p-8">
              <div className="text-gray-500">Loading audit logs...</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        {log.user_id || 'System'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.action}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{log.table_name}</TableCell>
                    <TableCell>
                      {getRiskBadge(getRiskLevel(log.action))}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {filteredLogs.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No audit logs found matching your search criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
