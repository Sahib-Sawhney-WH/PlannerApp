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
  FileText,
  FolderOpen,
  Users,
  CheckSquare,
} from 'lucide-react';

const TopBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    theme, 
    toggleTheme,
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
      
      // Ctrl/Cmd + N for quick add
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleQuickAdd();
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

  const handleSearchResultClick = (result: any) => {
    // Navigate to the result or open in drawer
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
      case 'note':
        openDrawer({ type: 'note-details', data: result });
        break;
      default:
        console.log('Unknown result type:', result.type);
    }
    
    // Clear search after selection
    setSearchQuery('');
    clearSearch();
    searchInputRef.current?.blur();
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'task':
        return CheckSquare;
      case 'project':
        return FolderOpen;
      case 'client':
        return Users;
      case 'note':
        return FileText;
      default:
        return FileText;
    }
  };

  const getResultTypeColor = (type: string) => {
    switch (type) {
      case 'task':
        return 'text-accent';
      case 'project':
        return 'text-success';
      case 'client':
        return 'text-warn';
      case 'note':
        return 'text-muted';
      default:
        return 'text-muted';
    }
  };

  return (
    <header 
      className="top-bar"
      style={{
        backgroundColor: 'hsl(var(--bg))',
        borderBottom: '1px solid hsl(var(--border))'
      }}
    >
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
            onBlur={(e) => {
              // Delay blur to allow click on search results
              setTimeout(() => setSearchFocused(false), 200);
            }}
            className="search-input"
            style={{
              width: '100%',
              paddingLeft: '2.5rem',
              paddingRight: '1rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              backgroundColor: 'hsl(var(--bg-elev2))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              color: 'hsl(var(--text))',
              outline: 'none',
              transition: 'all 0.2s'
            }}
          />
          {searchQuery && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <kbd 
                className="px-1.5 py-0.5 text-xs rounded"
                style={{
                  backgroundColor: 'hsl(var(--border))',
                  color: 'hsl(var(--muted))'
                }}
              >
                ESC
              </kbd>
            </div>
          )}
        </div>
        
        {/* Search Results Dropdown - Fixed styling */}
        {searchResults.length > 0 && searchFocused && (
          <div 
            className="search-results"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '0.25rem',
              backgroundColor: 'hsl(var(--bg-elev1))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem',
              boxShadow: '0 8px 24px rgba(0,0,0,.25)',
              zIndex: 1200,
              maxHeight: '20rem',
              overflowY: 'auto'
            }}
          >
            {searchResults.map((result, index) => {
              const Icon = getResultIcon(result.type);
              const typeColor = getResultTypeColor(result.type);
              
              return (
                <div
                  key={`${result.type}-${result.id}-${index}`}
                  onClick={() => handleSearchResultClick(result)}
                  className="search-result-item"
                  style={{
                    padding: '0.75rem',
                    cursor: 'pointer',
                    borderBottom: index < searchResults.length - 1 ? '1px solid hsl(var(--border))' : 'none',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(var(--bg-elev2))';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon 
                      className={cn('w-4 h-4 flex-shrink-0', typeColor)} 
                    />
                    <div className="flex-1 min-w-0">
                      <div 
                        className="font-medium text-sm truncate"
                        style={{ color: 'hsl(var(--text))' }}
                      >
                        {result.title}
                      </div>
                      {result.description && (
                        <div 
                          className="text-xs truncate mt-1"
                          style={{ color: 'hsl(var(--muted))' }}
                        >
                          {result.description}
                        </div>
                      )}
                      <div 
                        className="text-xs capitalize mt-1"
                        style={{ color: 'hsl(var(--subtle))' }}
                      >
                        {result.type}
                      </div>
                    </div>
                    <div 
                      className="text-xs"
                      style={{ color: 'hsl(var(--subtle))' }}
                    >
                      {Math.round((result.relevance || 0) * 100)}% match
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Search footer */}
            <div 
              className="px-3 py-2 border-t text-xs"
              style={{
                borderTop: '1px solid hsl(var(--border))',
                backgroundColor: 'hsl(var(--bg-elev2))',
                color: 'hsl(var(--muted))'
              }}
            >
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
            </div>
          </div>
        )}
        
        {/* No results message */}
        {searchQuery.trim() && searchResults.length === 0 && searchFocused && (
          <div 
            className="search-results"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '0.25rem',
              backgroundColor: 'hsl(var(--bg-elev1))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem',
              boxShadow: '0 8px 24px rgba(0,0,0,.25)',
              zIndex: 1200,
              padding: '1rem',
              textAlign: 'center'
            }}
          >
            <div style={{ color: 'hsl(var(--muted))' }}>
              No results found for "{searchQuery}"
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 ml-4">
        {/* Quick Add */}
        <button
          onClick={handleQuickAdd}
          className="p-2 rounded-lg transition-colors"
          style={{
            color: 'hsl(var(--text))',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'hsl(var(--bg-elev2))';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          title="Quick Add (Ctrl+N)"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button
          className="p-2 rounded-lg transition-colors relative"
          style={{
            color: 'hsl(var(--text))',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'hsl(var(--bg-elev2))';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <div 
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full text-xs flex items-center justify-center"
            style={{
              backgroundColor: 'hsl(var(--danger))',
              color: 'white',
              fontSize: '0.625rem'
            }}
          >
            3
          </div>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg transition-colors"
          style={{
            color: 'hsl(var(--text))',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'hsl(var(--bg-elev2))';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
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
          className="p-2 rounded-lg transition-colors"
          style={{
            color: 'hsl(var(--text))',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'hsl(var(--bg-elev2))';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default TopBar;

