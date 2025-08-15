import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Header } from '@/components/ui/Header';

const Settings: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(false);

  // Need to research on context theme provider, or use the similar method i used on my website to render a dark theme
  // For demo only, just toggle the switch but no visual cjanges

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-50 to-background/80 dark:from-background dark:via-slate-900 dark:to-background/80">
      <Header />
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
    </div>
  );
};

export default Settings;
