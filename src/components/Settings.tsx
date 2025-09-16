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
  Check,
  Monitor,
  Smartphone,
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
      <div className="w-64 border-r border-border bg-bg-elev1">
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
                      ? 'bg-accent text-white'
                      : 'text-muted hover:text-text hover:bg-bg-elev2'
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
  const handleThemeChange = (updates: any) => {
    const newTheme = { ...theme, ...updates };
    setTheme(newTheme);
    
    // Apply theme changes to document
    if (updates.mode) {
      document.documentElement.setAttribute('data-theme', updates.mode);
    }
    
    if (updates.accentColor) {
      document.documentElement.style.setProperty('--accent', updates.accentColor);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Appearance</h2>
        <p className="text-muted mb-6">Customize how the application looks and feels.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-3 block">Theme</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleThemeChange({ mode: 'light' })}
              className={cn(
                'p-4 rounded-lg border-2 transition-colors text-left',
                theme.mode === 'light'
                  ? 'border-accent bg-accent/5'
                  : 'border-border hover:border-muted'
              )}
            >
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                <span className="font-medium">Light</span>
                {theme.mode === 'light' && <Check className="w-4 h-4 text-accent ml-auto" />}
              </div>
              <p className="text-xs text-muted mt-1">Clean and bright interface</p>
            </button>
            <button
              onClick={() => handleThemeChange({ mode: 'dark' })}
              className={cn(
                'p-4 rounded-lg border-2 transition-colors text-left',
                theme.mode === 'dark'
                  ? 'border-accent bg-accent/5'
                  : 'border-border hover:border-muted'
              )}
            >
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-800 border border-gray-600 rounded"></div>
                <span className="font-medium">Dark</span>
                {theme.mode === 'dark' && <Check className="w-4 h-4 text-accent ml-auto" />}
              </div>
              <p className="text-xs text-muted mt-1">Easy on the eyes</p>
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-3 block">Density</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleThemeChange({ density: 'comfortable' })}
              className={cn(
                'p-4 rounded-lg border-2 transition-colors text-left',
                theme.density === 'comfortable'
                  ? 'border-accent bg-accent/5'
                  : 'border-border hover:border-muted'
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium flex items-center space-x-2">
                    <Monitor className="w-4 h-4" />
                    <span>Comfortable</span>
                  </div>
                  <div className="text-sm text-muted mt-1">More spacing between elements</div>
                </div>
                {theme.density === 'comfortable' && <Check className="w-4 h-4 text-accent" />}
              </div>
            </button>
            <button
              onClick={() => handleThemeChange({ density: 'compact' })}
              className={cn(
                'p-4 rounded-lg border-2 transition-colors text-left',
                theme.density === 'compact'
                  ? 'border-accent bg-accent/5'
                  : 'border-border hover:border-muted'
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium flex items-center space-x-2">
                    <Smartphone className="w-4 h-4" />
                    <span>Compact</span>
                  </div>
                  <div className="text-sm text-muted mt-1">Less spacing, more content</div>
                </div>
                {theme.density === 'compact' && <Check className="w-4 h-4 text-accent" />}
              </div>
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-3 block">Accent Color</label>
          <div className="grid grid-cols-8 gap-2">
            {[
              { color: '#3b82f6', name: 'Blue' },
              { color: '#ef4444', name: 'Red' },
              { color: '#10b981', name: 'Green' },
              { color: '#f59e0b', name: 'Amber' },
              { color: '#8b5cf6', name: 'Purple' },
              { color: '#ec4899', name: 'Pink' },
              { color: '#06b6d4', name: 'Cyan' },
              { color: '#84cc16', name: 'Lime' }
            ].map(({ color, name }) => (
              <button
                key={color}
                onClick={() => handleThemeChange({ accentColor: color })}
                className={cn(
                  'w-10 h-10 rounded-lg border-2 transition-all relative',
                  theme.accentColor === color
                    ? 'border-text scale-110'
                    : 'border-border hover:scale-105'
                )}
                style={{ backgroundColor: color }}
                title={name}
              >
                {theme.accentColor === color && (
                  <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted mt-2">
            Current color: {theme.accentColor}
          </p>
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="text-sm font-medium mb-2">Preview</h3>
          <div className="p-4 rounded-lg border border-border bg-bg-elev1">
            <div className="flex items-center space-x-3 mb-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: theme.accentColor }}
              />
              <span className="font-medium">Sample Task</span>
              <span className="text-xs px-2 py-1 rounded-full bg-bg-elev2 text-muted">
                {theme.density}
              </span>
            </div>
            <p className="text-sm text-muted">
              This is how your content will look with the current settings.
            </p>
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
    soundEnabled: true,
    desktopNotifications: true,
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <p className="text-muted mb-6">Manage when and how you receive notifications.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
          <div>
            <div className="font-medium">Task Reminders</div>
            <div className="text-sm text-muted">Get notified about upcoming task deadlines</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.taskReminders}
              onChange={(e) => handleSettingChange('taskReminders', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
          <div>
            <div className="font-medium">Project Updates</div>
            <div className="text-sm text-muted">Notifications for project status changes</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.projectUpdates}
              onChange={(e) => handleSettingChange('projectUpdates', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
          <div>
            <div className="font-medium">Client Notifications</div>
            <div className="text-sm text-muted">Updates about client interactions</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.clientNotifications}
              onChange={(e) => handleSettingChange('clientNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
          <div>
            <div className="font-medium">System Alerts</div>
            <div className="text-sm text-muted">Important system messages and updates</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.systemAlerts}
              onChange={(e) => handleSettingChange('systemAlerts', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
          <div>
            <div className="font-medium">Desktop Notifications</div>
            <div className="text-sm text-muted">Show notifications on your desktop</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.desktopNotifications}
              onChange={(e) => handleSettingChange('desktopNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
          <div>
            <div className="font-medium">Sound Notifications</div>
            <div className="text-sm text-muted">Play sounds for notifications</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

const DataSettings: React.FC = () => {
  const { exportData, importData, resetData } = useAppStore();

  const handleExport = () => {
    exportData();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          importData(data);
        } catch (error) {
          console.error('Failed to import data:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      resetData();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Data & Backup</h2>
        <p className="text-muted mb-6">Manage your application data and backups.</p>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Export Data</div>
              <div className="text-sm text-muted">Download all your data as a JSON file</div>
            </div>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Import Data</div>
              <div className="text-sm text-muted">Restore data from a JSON backup file</div>
            </div>
            <label className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 flex items-center space-x-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-red-800 dark:text-red-200">Reset All Data</div>
              <div className="text-sm text-red-600 dark:text-red-300">Permanently delete all application data</div>
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShortcutSettings: React.FC = () => {
  const shortcuts = [
    { key: 'Ctrl+K', description: 'Open search' },
    { key: 'Ctrl+N', description: 'Create new task' },
    { key: 'Ctrl+P', description: 'Create new project' },
    { key: 'Ctrl+Shift+C', description: 'Create new client' },
    { key: 'Escape', description: 'Close drawer/modal' },
    { key: 'Ctrl+/', description: 'Show keyboard shortcuts' },
    { key: 'Ctrl+,', description: 'Open settings' },
    { key: 'Ctrl+B', description: 'Toggle sidebar' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Keyboard Shortcuts</h2>
        <p className="text-muted mb-6">Speed up your workflow with keyboard shortcuts.</p>
      </div>

      <div className="space-y-2">
        {shortcuts.map((shortcut, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-bg-elev1"
          >
            <span className="text-sm">{shortcut.description}</span>
            <kbd className="px-2 py-1 text-xs font-mono bg-bg-elev2 border border-border rounded">
              {shortcut.key}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;