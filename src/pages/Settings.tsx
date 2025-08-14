import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

const Settings: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(false);

  // In a real app, dark mode would use a context or theme provider
  // For demo, just toggle the switch visually

  return (
    <div className="max-w-lg mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-col items-center">
          <img src="/wire_white.png" alt="Settings" className="w-20 h-20 rounded-full object-contain mb-4 bg-white/10" />
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <span className="font-medium">Dark Mode</span>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
          <div className="flex items-center justify-between mb-6">
            <span className="font-medium">Notifications</span>
            <Switch checked={notifications} onCheckedChange={setNotifications} disabled />
          </div>
          <p className="text-xs text-muted-foreground">More settings coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
