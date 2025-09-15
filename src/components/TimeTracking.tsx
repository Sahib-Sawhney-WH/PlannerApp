import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/mock';
import { cn } from '@/lib/utils';
import { 
  Clock, 
  Play, 
  Square, 
  Plus, 
  Search, 
  Building,
  Edit3,
  Trash2,
  Save,
  X,
  Timer,
  BarChart3,
} from 'lucide-react';

interface TimeEntry {
  id: string;
  taskId?: string;
  projectId?: string;
  clientId?: string;
  description: string;
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
  isRunning: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const TimeTracking: React.FC = () => {
  const { clients, projects, tasks } = useAppStore();
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    {
      id: '1',
      taskId: '1',
      projectId: '1',
      clientId: '1',
      description: 'Security infrastructure analysis',
      startTime: new Date('2024-01-05T09:00:00').toISOString(),
      endTime: new Date('2024-01-05T11:30:00').toISOString(),
      duration: 150,
      isRunning: false,
      tags: ['analysis', 'security'],
      createdAt: new Date('2024-01-05').toISOString(),
      updatedAt: new Date('2024-01-05').toISOString(),
    },
    {
      id: '2',
      taskId: '2',
      projectId: '2',
      clientId: '2',
      description: 'AI model training and optimization',
      startTime: new Date('2024-01-04T14:00:00').toISOString(),
      endTime: new Date('2024-01-04T17:45:00').toISOString(),
      duration: 225,
      isRunning: false,
      tags: ['development', 'ai'],
      createdAt: new Date('2024-01-04').toISOString(),
      updatedAt: new Date('2024-01-04').toISOString(),
    },
    {
      id: '3',
      projectId: '1',
      clientId: '1',
      description: 'Client meeting and requirements gathering',
      startTime: new Date('2024-01-03T10:00:00').toISOString(),
      endTime: new Date('2024-01-03T11:00:00').toISOString(),
      duration: 60,
      isRunning: false,
      tags: ['meeting', 'requirements'],
      createdAt: new Date('2024-01-03').toISOString(),
      updatedAt: new Date('2024-01-03').toISOString(),
    }
  ]);

  const [activeTimer, setActiveTimer] = useState<TimeEntry | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second for active timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredEntries = timeEntries.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !dateFilter || entry.startTime.startsWith(dateFilter);
    return matchesSearch && matchesDate;
  });

  const totalHours = filteredEntries.reduce((sum, entry) => {
    if (entry.isRunning && entry.startTime) {
      const elapsed = Math.floor((currentTime.getTime() - new Date(entry.startTime).getTime()) / (1000 * 60));
      return sum + elapsed;
    }
    return sum + entry.duration;
  }, 0);

  const startTimer = (description: string, taskId?: string, projectId?: string, clientId?: string) => {
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      taskId,
      projectId,
      clientId,
      description,
      startTime: new Date().toISOString(),
      duration: 0,
      isRunning: true,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setTimeEntries([newEntry, ...timeEntries]);
    setActiveTimer(newEntry);
  };

  const stopTimer = (entryId: string) => {
    const now = new Date();
    setTimeEntries(entries => entries.map(entry => {
      if (entry.id === entryId && entry.isRunning) {
        const duration = Math.floor((now.getTime() - new Date(entry.startTime).getTime()) / (1000 * 60));
        return {
          ...entry,
          endTime: now.toISOString(),
          duration,
          isRunning: false,
          updatedAt: now.toISOString(),
        };
      }
      return entry;
    }));
    setActiveTimer(null);
  };

  const createTimeEntry = (entryData: Omit<TimeEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEntry: TimeEntry = {
      ...entryData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTimeEntries([newEntry, ...timeEntries]);
    setSelectedEntry(newEntry);
    setShowCreateForm(false);
  };

  const updateTimeEntry = (id: string, updates: Partial<TimeEntry>) => {
    setTimeEntries(entries => entries.map(entry => 
      entry.id === id 
        ? { ...entry, ...updates, updatedAt: new Date().toISOString() }
        : entry
    ));
    if (selectedEntry?.id === id) {
      setSelectedEntry({ ...selectedEntry, ...updates });
    }
  };

  const deleteTimeEntry = (id: string) => {
    setTimeEntries(entries => entries.filter(entry => entry.id !== id));
    if (selectedEntry?.id === id) {
      setSelectedEntry(null);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getRunningDuration = (entry: TimeEntry) => {
    if (!entry.isRunning) return entry.duration;
    return Math.floor((currentTime.getTime() - new Date(entry.startTime).getTime()) / (1000 * 60));
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-80 border-r border-border bg-muted/30 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <h1 className="text-lg font-semibold">Time Tracking</h1>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Timer */}
          <QuickTimer onStart={startTimer} activeTimer={activeTimer} onStop={stopTimer} />

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="p-2 bg-background rounded border">
              <div className="text-xs text-muted-foreground">Today</div>
              <div className="font-semibold">{formatDuration(totalHours)}</div>
            </div>
            <div className="p-2 bg-background rounded border">
              <div className="text-xs text-muted-foreground">Entries</div>
              <div className="font-semibold">{filteredEntries.length}</div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background"
            />
          </div>

          {/* Date Filter */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background mb-4"
          />
        </div>

        {/* Time Entries List */}
        <div className="flex-1 overflow-y-auto">
          {filteredEntries.map(entry => {
            const task = tasks.find(t => t.id === entry.taskId);
            const project = projects.find(p => p.id === entry.projectId);
            const client = clients.find(c => c.id === entry.clientId);
            const duration = getRunningDuration(entry);

            return (
              <div
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                className={cn(
                  'p-4 border-b border-border cursor-pointer hover:bg-muted/50',
                  selectedEntry?.id === entry.id && 'bg-muted',
                  entry.isRunning && 'border-l-4 border-l-primary'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium line-clamp-1">{entry.description}</h3>
                  <div className="flex items-center space-x-1">
                    {entry.isRunning && <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />}
                    <span className="text-sm font-mono">{formatDuration(duration)}</span>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground space-y-1">
                  {task && <div>Task: {task.title}</div>}
                  {project && <div>Project: {project.title}</div>}
                  {client && <div>Client: {client.name}</div>}
                  <div>
                    {new Date(entry.startTime).toLocaleDateString()} • 
                    {new Date(entry.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {entry.endTime && (
                      <> - {new Date(entry.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {showCreateForm ? (
          <TimeEntryForm
            onSave={createTimeEntry}
            onCancel={() => setShowCreateForm(false)}
            clients={clients}
            projects={projects}
            tasks={tasks}
          />
        ) : selectedEntry ? (
          <TimeEntryViewer
            entry={selectedEntry}
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            onSave={(updates) => {
              updateTimeEntry(selectedEntry.id, updates);
              setIsEditing(false);
            }}
            onDelete={() => deleteTimeEntry(selectedEntry.id)}
            onCancel={() => setIsEditing(false)}
            clients={clients}
            projects={projects}
            tasks={tasks}
            currentTime={currentTime}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Timer className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">No entry selected</h2>
              <p className="text-muted-foreground mb-4">Select a time entry from the sidebar or start a new timer</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Create Time Entry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const QuickTimer: React.FC<{
  onStart: (description: string, taskId?: string, projectId?: string, clientId?: string) => void;
  activeTimer: TimeEntry | null;
  onStop: (entryId: string) => void;
}> = ({ onStart, activeTimer, onStop }) => {
  const [description, setDescription] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStart = () => {
    if (description.trim()) {
      onStart(description.trim());
      setDescription('');
      setIsExpanded(false);
    }
  };

  const handleStop = () => {
    if (activeTimer) {
      onStop(activeTimer.id);
    }
  };

  if (activeTimer) {
    return (
      <div className="p-3 bg-primary/10 border border-primary/20 rounded-md mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-medium">Timer Running</span>
          </div>
          <button
            onClick={handleStop}
            className="p-1 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
          >
            <Square className="h-3 w-3" />
          </button>
        </div>
        <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
          {activeTimer.description}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full p-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center justify-center space-x-2"
        >
          <Play className="h-4 w-4" />
          <span>Start Timer</span>
        </button>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleStart()}
            placeholder="What are you working on?"
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
            autoFocus
          />
          <div className="flex space-x-2">
            <button
              onClick={handleStart}
              disabled={!description.trim()}
              className="flex-1 p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center space-x-1"
            >
              <Play className="h-3 w-3" />
              <span>Start</span>
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const TimeEntryForm: React.FC<{
  entry?: TimeEntry;
  onSave: (entry: Omit<TimeEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  clients: any[];
  projects: any[];
  tasks: any[];
}> = ({ entry, onSave, onCancel, clients, projects, tasks }) => {
  const [formData, setFormData] = useState({
    description: entry?.description || '',
    taskId: entry?.taskId || '',
    projectId: entry?.projectId || '',
    clientId: entry?.clientId || '',
    startTime: entry?.startTime ? entry.startTime.slice(0, 16) : '',
    endTime: entry?.endTime ? entry.endTime.slice(0, 16) : '',
    duration: entry?.duration || 0,
    isRunning: entry?.isRunning || false,
    tags: entry?.tags || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let duration = formData.duration;
    if (formData.startTime && formData.endTime && !formData.isRunning) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      duration = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
    }

    onSave({
      ...formData,
      startTime: formData.startTime ? new Date(formData.startTime).toISOString() : new Date().toISOString(),
      endTime: formData.endTime ? new Date(formData.endTime).toISOString() : undefined,
      duration,
    });
  };

  return (
    <div className="p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">{entry ? 'Edit Time Entry' : 'New Time Entry'}</h2>
        <button onClick={onCancel} className="p-2 hover:bg-muted rounded-md">
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
            placeholder="What did you work on?"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Client</label>
            <select
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="">Select client...</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Project</label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="">Select project...</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Task</label>
            <select
              value={formData.taskId}
              onChange={(e) => setFormData({ ...formData, taskId: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="">Select task...</option>
              {tasks.map(task => (
                <option key={task.id} value={task.id}>{task.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <input
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End Time</label>
            <input
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
              disabled={formData.isRunning}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isRunning"
            checked={formData.isRunning}
            onChange={(e) => setFormData({ ...formData, isRunning: e.target.checked })}
            className="rounded border-border"
          />
          <label htmlFor="isRunning" className="text-sm font-medium">Currently running</label>
        </div>

        <div className="flex space-x-2 pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            <Save className="h-4 w-4 mr-2 inline" />
            Save Entry
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const TimeEntryViewer: React.FC<{
  entry: TimeEntry;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updates: Partial<TimeEntry>) => void;
  onDelete: () => void;
  onCancel: () => void;
  clients: any[];
  projects: any[];
  tasks: any[];
  currentTime: Date;
}> = ({ entry, isEditing, onEdit, onSave, onDelete, onCancel, clients, projects, tasks, currentTime }) => {
  const task = tasks.find(t => t.id === entry.taskId);
  const project = projects.find(p => p.id === entry.projectId);
  const client = clients.find(c => c.id === entry.clientId);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getDisplayDuration = () => {
    if (entry.isRunning) {
      const elapsed = Math.floor((currentTime.getTime() - new Date(entry.startTime).getTime()) / (1000 * 60));
      return formatDuration(elapsed);
    }
    return formatDuration(entry.duration);
  };

  if (isEditing) {
    return (
      <TimeEntryForm
        entry={entry}
        onSave={onSave}
        onCancel={onCancel}
        clients={clients}
        projects={projects}
        tasks={tasks}
      />
    );
  }

  return (
    <div className="p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">{entry.description}</h1>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {entry.isRunning && (
              <span className="flex items-center space-x-1 text-primary">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span>Running</span>
              </span>
            )}
            <span className="font-mono text-lg">{getDisplayDuration()}</span>
            <span>{new Date(entry.startTime).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button onClick={onEdit} className="p-2 hover:bg-muted rounded-md">
            <Edit3 className="h-4 w-4" />
          </button>
          <button onClick={onDelete} className="p-2 hover:bg-destructive/10 text-destructive rounded-md">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Time Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Start:</span>
                <span>{new Date(entry.startTime).toLocaleString()}</span>
              </div>
              {entry.endTime && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End:</span>
                  <span>{new Date(entry.endTime).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-mono">{getDisplayDuration()}</span>
              </div>
            </div>
          </div>

          {(task || project || client) && (
            <div>
              <h3 className="font-medium mb-2">Associated Items</h3>
              <div className="space-y-2">
                {client && (
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{client.name}</span>
                  </div>
                )}
                {project && (
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span>{project.title}</span>
                  </div>
                )}
                {task && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{task.title}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Metadata</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated:</span>
                <span>{new Date(entry.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {entry.tags.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-1">
                {entry.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 bg-muted rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeTracking;

