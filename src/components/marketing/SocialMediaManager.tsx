import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export const SocialMediaManager = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Social Media Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Facebook className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-medium">Facebook</h3>
              <p className="text-sm text-muted-foreground">1.2k followers</p>
              <Button size="sm" className="mt-2">Manage</Button>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Instagram className="w-8 h-8 mx-auto mb-2 text-pink-600" />
              <h3 className="font-medium">Instagram</h3>
              <p className="text-sm text-muted-foreground">890 followers</p>
              <Button size="sm" className="mt-2">Manage</Button>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Twitter className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <h3 className="font-medium">Twitter</h3>
              <p className="text-sm text-muted-foreground">654 followers</p>
              <Button size="sm" className="mt-2">Manage</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};