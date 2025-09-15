import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppStore } from '@/store/mock';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import Tasks from '@/components/Tasks';
import Projects from '@/components/Projects';
import Clients from '@/components/Clients';
import Opportunities from '@/components/Opportunities';
import Notes from '@/components/Notes';
import Knowledge from '@/components/Knowledge';
import TimeTracking from '@/components/TimeTracking';
import RAID from '@/components/RAID';
import Settings from '@/components/Settings';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorBoundary from '@/components/ErrorBoundary';

function App() {
  const { initializeApp, loading, error } = useAppStore();

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg text-text">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-danger mb-4">Application Error</h1>
          <p className="text-muted mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="h-screen bg-bg text-text overflow-hidden">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/knowledge" element={<Knowledge />} />
            <Route path="/time" element={<TimeTracking />} />
            <Route path="/raid" element={<RAID />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </div>
    </ErrorBoundary>
  );
}

export default App;

