import React, { useState } from 'react';
import { useAppStore } from '@/store/mock';
import { cn } from '@/lib/utils';
import { 
  Settings as SettingsIcon, 
  Palette, 
  Database, 
  Bell, 
  Keyboard, 
  Download, 
  Upload,
  Trash2,
} from 'lucide-react';

const Settings: React.FC = () => {
  const { theme, setTheme } = useAppStore();
  const [activeTab, setActiveTab] = useState('appearance');

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data & Backup', icon: Database },
    { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'appearance':
        return <AppearanceSettings theme={theme} setTheme={setTheme} />;
      case 'notifications':
        return <NotificationSettings />;
      case 'data':
        return <DataSettings />;
      case 'shortcuts':
        return <ShortcutSettings />;
      default:
        return <AppearanceSettings theme={theme} setTheme={setTheme} />;
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-muted/30">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <SettingsIcon className="h-5 w-5" />
            <h1 className="text-lg font-semibold">Settings</h1>
          </div>
          
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};

const AppearanceSettings: React.FC<{ theme: any; setTheme: (theme: any) => void }> = ({ theme, setTheme }) => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Appearance</h2>
        <p className="text-muted-foreground mb-6">Customize how the application looks and feels.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-3 block">Theme</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTheme({ mode: 'light' })}
              className={cn(
                'p-4 rounded-lg border-2 transition-colors',
                theme.mode === 'light'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground'
              )}
            >
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                <span className="font-medium">Light</span>
              </div>
            </button>
            <button
              onClick={() => setTheme({ mode: 'dark' })}
              className={cn(
                'p-4 rounded-lg border-2 transition-colors',
                theme.mode === 'dark'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground'
              )}
            >
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-800 border border-gray-600 rounded"></div>
                <span className="font-medium">Dark</span>
              </div>
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-3 block">Density</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTheme({ density: 'comfortable' })}
              className={cn(
                'p-4 rounded-lg border-2 transition-colors',
                theme.density === 'comfortable'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground'
              )}
            >
              <div className="font-medium">Comfortable</div>
              <div className="text-sm text-muted-foreground">More spacing</div>
            </button>
            <button
              onClick={() => setTheme({ density: 'compact' })}
              className={cn(
                'p-4 rounded-lg border-2 transition-colors',
                theme.density === 'compact'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground'
              )}
            >
              <div className="font-medium">Compact</div>
              <div className="text-sm text-muted-foreground">Less spacing</div>
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-3 block">Accent Color</label>
          <div className="grid grid-cols-6 gap-2">
            {[
              '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
              '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
            ].map((color) => (
              <button
                key={color}
                onClick={() => setTheme({ accentColor: color })}
                className={cn(
                  'w-10 h-10 rounded-lg border-2 transition-all',
                  theme.accentColor === color
                    ? 'border-foreground scale-110'
                    : 'border-border hover:scale-105'
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    taskReminders: true,
    projectUpdates: true,
    clientNotifications: false,
    systemAlerts: true,
    emailDigest: true,
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <p className="text-muted-foreground mb-6">Manage when and how you receive notifications.</p>
      </div>

      <div className="space-y-4">
        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <div className="font-medium">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </div>
              <div className="text-sm text-muted-foreground">
                {getNotificationDescription(key)}
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

const DataSettings: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Data & Backup</h2>
        <p className="text-muted-foreground mb-6">Manage your data, backups, and storage.</p>
      </div>

      <div className="space-y-4">
        <div className="p-4 border border-border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Export Data</h3>
            <Download className="h-4 w-4" />
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Download all your data as a JSON file for backup or migration.
          </p>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            Export All Data
          </button>
        </div>

        <div className="p-4 border border-border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Import Data</h3>
            <Upload className="h-4 w-4" />
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Import data from a previously exported JSON file.
          </p>
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90">
            Import Data
          </button>
        </div>

        <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-destructive">Clear All Data</h3>
            <Trash2 className="h-4 w-4 text-destructive" />
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Permanently delete all your data. This action cannot be undone.
          </p>
          <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90">
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
};

const ShortcutSettings: React.FC = () => {
  const shortcuts = [
    { key: 'Ctrl+N', description: 'Create new task' },
    { key: 'Ctrl+K', description: 'Open command palette' },
    { key: 'Ctrl+/', description: 'Toggle sidebar' },
    { key: 'Ctrl+Shift+D', description: 'Toggle dark mode' },
    { key: 'Ctrl+1', description: 'Go to Dashboard' },
    { key: 'Ctrl+2', description: 'Go to Tasks' },
    { key: 'Ctrl+3', description: 'Go to Projects' },
    { key: 'Ctrl+4', description: 'Go to Clients' },
    { key: 'Escape', description: 'Close drawer/modal' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Keyboard Shortcuts</h2>
        <p className="text-muted-foreground mb-6">Learn keyboard shortcuts to work more efficiently.</p>
      </div>

      <div className="space-y-2">
        {shortcuts.map((shortcut, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
            <span className="text-sm">{shortcut.description}</span>
            <kbd className="px-2 py-1 text-xs font-mono bg-muted border border-border rounded">
              {shortcut.key}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  );
};

function getNotificationDescription(key: string): string {
  const descriptions: Record<string, string> = {
    taskReminders: 'Get notified about upcoming task deadlines',
    projectUpdates: 'Receive updates when project status changes',
    clientNotifications: 'Get alerts for client-related activities',
    systemAlerts: 'Important system messages and updates',
    emailDigest: 'Daily summary of your activities via email',
  };
  return descriptions[key] || '';
}

export default Settings;

