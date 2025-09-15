import React from 'react';
import { useAppStore } from '@/store';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Drawer from './Drawer';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { viewState, theme } = useAppStore();
  const { drawerOpen } = viewState;
  const { density } = theme;

  return (
    <div className="flex h-screen bg-bg text-text overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <TopBar />
        
        {/* Main content */}
        <main 
          className={cn(
            "flex-1 overflow-hidden",
            density === 'compact' ? 'p-4' : 'p-6'
          )}
        >
          {children}
        </main>
      </div>
      
      {/* Right drawer */}
      <Drawer />
      
      {/* Drawer overlay */}
      {drawerOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => useAppStore.getState().closeDrawer()}
        />
      )}
    </div>
  );
};

export default Layout;

