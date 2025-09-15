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
} from 'lucide-react';

const TopBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    theme, 
    setTheme, 
    search, 
    clearSearch, 
    searchResults,
    openDrawer 
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
    setTheme({ mode: theme.mode === 'dark' ? 'light' : 'dark' });
    // Update document theme attribute
    document.documentElement.setAttribute(
      'data-theme', 
      theme.mode === 'dark' ? 'light' : 'dark'
    );
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-bg-elev1">
      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search everything... (Ctrl+K)"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={cn(
              'w-full pl-10 pr-4 py-2 bg-bg-elev2 border border-border rounded-lg',
              'text-sm placeholder:text-muted',
              'focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent',
              'transition-all duration-200'
            )}
          />
          {searchQuery && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <kbd className="px-1.5 py-0.5 text-xs bg-border rounded text-muted">
                ESC
              </kbd>
            </div>
          )}
        </div>
        
        {/* Search Results Dropdown */}
        {searchResults.length > 0 && searchFocused && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
            {searchResults.map((result) => (
              <div
                key={result.id}
                className="px-4 py-3 hover:bg-bg-elev1 cursor-pointer border-b border-border last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-text truncate">
                      {result.title}
                    </div>
                    <div className="text-xs text-muted capitalize">
                      {result.type}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 ml-4">
        {/* Quick Add */}
        <button
          onClick={handleQuickAdd}
          className="p-2 rounded-lg hover:bg-bg-elev2 transition-colors"
          title="Quick Add (N)"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button
          className="p-2 rounded-lg hover:bg-bg-elev2 transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full text-xs flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-bg-elev2 transition-colors"
          title={`Switch to ${theme.mode === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme.mode === 'dark' ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* Settings */}
        <button
          onClick={() => openDrawer('settings')}
          className="p-2 rounded-lg hover:bg-bg-elev2 transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default TopBar;

