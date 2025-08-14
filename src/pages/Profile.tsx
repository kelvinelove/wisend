import React from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-lg mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-col items-center">
          <img src="/wire_white.png" alt="Profile" className="w-20 h-20 rounded-full object-contain mb-4 bg-white/10" />
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input value={user?.name || ''} readOnly className="bg-gray-100" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input value={user?.email || ''} readOnly className="bg-gray-100" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Change Password</label>
            <Input type="password" placeholder="New password (mock)" disabled className="bg-gray-100" />
          </div>
          <Button disabled className="w-full opacity-60 cursor-not-allowed">Change Password (Coming Soon)</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
