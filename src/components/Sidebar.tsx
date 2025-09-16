import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  CheckSquare,
  FolderOpen,
  Users,
  Target,
  FileText,
  BookOpen,
  Clock,
  AlertTriangle,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare, path: '/tasks' },
  { id: 'projects', label: 'Projects', icon: FolderOpen, path: '/projects' },
  { id: 'clients', label: 'Clients', icon: Users, path: '/clients' },
  { id: 'opportunities', label: 'Opportunities', icon: Target, path: '/opportunities' },
  { id: 'notes', label: 'Notes', icon: FileText, path: '/notes' },
  { id: 'knowledge', label: 'Knowledge', icon: BookOpen, path: '/knowledge' },
  { id: 'time', label: 'Time Tracking', icon: Clock, path: '/time' },
  { id: 'raid', label: 'RAID', icon: AlertTriangle, path: '/raid' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { viewState, toggleSidebar } = useAppStore();
  const { sidebarExpanded } = viewState;

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <aside className={cn(
      'sidebar',
      sidebarExpanded ? 'expanded' : 'collapsed'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {sidebarExpanded && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg">Planner</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-bg-elev2 transition-colors"
          title={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarExpanded ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            (item.path === '/dashboard' && location.pathname === '/');
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                'hover:bg-bg-elev2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                isActive && 'bg-accent/10 text-accent border border-accent/20',
                !sidebarExpanded && 'justify-center px-2'
              )}
              title={!sidebarExpanded ? item.label : undefined}
            >
              <Icon className={cn(
                'w-5 h-5 flex-shrink-0',
                isActive ? 'text-accent' : 'text-muted'
              )} />
              {sidebarExpanded && (
                <span className={cn(
                  'font-medium',
                  isActive ? 'text-accent' : 'text-text'
                )}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      {sidebarExpanded && (
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted">
            Desktop Planner v1.0.0
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;