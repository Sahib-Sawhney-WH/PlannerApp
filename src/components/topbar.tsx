import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/mock';
import { cn } from '@/lib/utils';
import {
  Search,
  Plus,
  Bell,
  Moon,
  Sun,
  Settings,
  CheckSquare,
  FolderOpen,
  Users,
  X,
} from 'lucide-react';

const TopBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  const { 
    theme, 
    setTheme, 
    search, 
    clearSearch, 
    searchResults,
    openDrawer,
    tasks,
    projects,
    clients,
  } = useAppStore();

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      
      // Escape to clear search
      if (e.key === 'Escape' && searchFocused) {
        setSearchQuery('');
        clearSearch();
        searchInputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchFocused, clearSearch]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      search(query);
    } else {
      clearSearch();
    }
  };

  const handleQuickAdd = () => {
    openDrawer('task-form');
  };

  const toggleTheme = () => {
    const newMode = theme.mode === 'dark' ? 'light' : 'dark';
    setTheme({ mode: newMode });
    // Update document theme attribute
    document.documentElement.setAttribute('data-theme', newMode);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleSearchResultClick = (result: any) => {
    setSearchQuery('');
    clearSearch();
    searchInputRef.current?.blur();
    
    // Open the appropriate drawer based on result type
    switch (result.type) {
      case 'task':
        openDrawer({ type: 'task-details', data: result });
        break;
      case 'project':
        openDrawer({ type: 'project-details', data: result });
        break;
      case 'client':
        openDrawer({ type: 'client-details', data: result });
        break;
    }
  };

  // Get notifications (overdue tasks, upcoming deadlines, etc.)
  const getNotifications = () => {
    const notifications = [];
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Overdue tasks
    const overdueTasks = tasks.filter(task => 
      task.due && new Date(task.due) < now && task.status !== 'Done'
    );
    
    // Tasks due soon
    const dueSoonTasks = tasks.filter(task => 
      task.due && new Date(task.due) <= tomorrow && new Date(task.due) >= now && task.status !== 'Done'
    );

    overdueTasks.forEach(task => {
      notifications.push({
        id: `overdue-${task.id}`,
        type: 'overdue',
        title: 'Overdue Task',
        message: task.title,
        time: task.due,
        icon: CheckSquare,
        color: 'text-red-500',
      });
    });

    dueSoonTasks.forEach(task => {
      notifications.push({
        id: `due-soon-${task.id}`,
        type: 'due-soon',
        title: 'Due Soon',
        message: task.title,
        time: task.due,
        icon: CheckSquare,
        color: 'text-yellow-500',
      });
    });

    return notifications.slice(0, 5); // Limit to 5 notifications
  };

  const notifications = getNotifications();

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-background">
      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search everything... (Ctrl+K)"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            className={cn(
              'w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg',
              'text-sm placeholder:text-muted-foreground text-foreground',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
              'transition-all duration-200'
            )}
          />
        </div>
        
        {/* Search Results */}
        {searchQuery && searchResults.length > 0 && searchFocused && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
            {searchResults.map((result, index) => (
              <div
                key={index}
                onClick={() => handleSearchResultClick(result)}
                className="p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0 flex items-center space-x-3"
              >
                <div className="flex-shrink-0">
                  {result.type === 'task' && <CheckSquare className="w-4 h-4 text-primary" />}
                  {result.type === 'project' && <FolderOpen className="w-4 h-4 text-primary" />}
                  {result.type === 'client' && <Users className="w-4 h-4 text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground text-sm truncate">
                    {result.title}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {result.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {searchQuery && searchResults.length === 0 && searchFocused && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-xl z-50 p-4 text-center text-muted-foreground text-sm">
            No results found for "{searchQuery}"
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 ml-4">
        {/* Quick Add */}
        <button
          onClick={handleQuickAdd}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          title="Quick Add Task (Ctrl+N)"
        >
          <Plus className="w-4 h-4 text-muted-foreground hover:text-foreground" />
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={handleNotificationClick}
            className="p-2 hover:bg-muted rounded-lg transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full text-xs flex items-center justify-center text-destructive-foreground">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-background border border-border rounded-lg shadow-xl z-50">
              <div className="p-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-foreground">Notifications</h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 hover:bg-muted rounded"
                  >
                    <X className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>
              </div>
              
              <div className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => {
                    const Icon = notification.icon;
                    return (
                      <div
                        key={notification.id}
                        className="p-3 hover:bg-muted border-b border-border last:border-b-0"
                      >
                        <div className="flex items-start space-x-3">
                          <Icon className={cn('w-4 h-4 mt-0.5', notification.color)} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground">
                              {notification.title}
                            </div>
                            <div className="text-sm text-muted-foreground truncate">
                              {notification.message}
                            </div>
                            {notification.time && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {new Date(notification.time).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          title="Toggle Theme"
        >
          {theme.mode === 'dark' ? (
            <Sun className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          ) : (
            <Moon className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          )}
        </button>

        {/* Settings */}
        <button
          onClick={() => openDrawer({ type: 'settings' })}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4 text-muted-foreground hover:text-foreground" />
        </button>
      </div>
    </header>
  );
};

export default TopBar;