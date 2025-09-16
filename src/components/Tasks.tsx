import React, { useState, useMemo } from 'react';
import { useAppStore } from '@/store/mock';
import { cn, formatDate, isOverdue, isDueSoon, getStatusColor } from '@/lib/utils';
import {
  CheckSquare,
  Plus,
  Search,
  Calendar,
  User,
  FolderOpen,
  AlertCircle,
  Clock,
  MoreHorizontal,
  Kanban,
  List,
} from 'lucide-react';

const Tasks: React.FC = () => {
  const { tasks, clients, projects, openDrawer } = useAppStore();
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');

  // Filter tasks based on current filters
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = !searchQuery || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesClient = clientFilter === 'all' || task.clientId === clientFilter;
      const matchesProject = projectFilter === 'all' || task.projectId === projectFilter;
      
      return matchesSearch && matchesStatus && matchesClient && matchesProject;
    });
  }, [tasks, searchQuery, statusFilter, clientFilter, projectFilter]);

  // Group tasks by status for Kanban view
  const tasksByStatus = useMemo(() => {
    const statuses = ['Inbox', 'Todo', 'Doing', 'Blocked', 'Done'];
    return statuses.reduce((acc, status) => {
      acc[status] = filteredTasks.filter(task => task.status === status);
      return acc;
    }, {} as Record<string, typeof tasks>);
  }, [filteredTasks]);

  const handleCreateTask = () => {
    openDrawer('create-task');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text">Tasks</h1>
          <p className="text-muted mt-1">
            {filteredTasks.length} of {tasks.length} tasks
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-bg-elev1 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'list' ? 'bg-accent text-white' : 'text-muted hover:text-text'
              )}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'kanban' ? 'bg-accent text-white' : 'text-muted hover:text-text'
              )}
              title="Kanban View"
            >
              <Kanban className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={handleCreateTask}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input w-auto"
        >
          <option value="all">All Status</option>
          <option value="Inbox">Inbox</option>
          <option value="Todo">Todo</option>
          <option value="Doing">Doing</option>
          <option value="Blocked">Blocked</option>
          <option value="Done">Done</option>
        </select>

        {/* Client Filter */}
        <select
          value={clientFilter}
          onChange={(e) => setClientFilter(e.target.value)}
          className="input w-auto"
        >
          <option value="all">All Clients</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </select>

        {/* Project Filter */}
        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="input w-auto"
        >
          <option value="all">All Projects</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.title}</option>
          ))}
        </select>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'list' ? (
          <TaskListView tasks={filteredTasks} />
        ) : (
          <TaskKanbanView tasksByStatus={tasksByStatus} />
        )}
      </div>
    </div>
  );
};

// Task List View Component
interface TaskListViewProps {
  tasks: any[];
}

const TaskListView: React.FC<TaskListViewProps> = ({ tasks }) => {
  const { theme, openDrawer } = useAppStore();
  const { density } = theme;

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-center">
        <div>
          <CheckSquare className="w-16 h-16 mx-auto mb-4 text-muted opacity-50" />
          <h3 className="text-lg font-medium text-text mb-2">No tasks found</h3>
          <p className="text-muted mb-4">Create your first task to get started</p>
          <button
            onClick={() => openDrawer('create-task')}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full">
      <div className="space-y-1">
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} density={density} />
        ))}
      </div>
    </div>
  );
};

// Task Kanban View Component
interface TaskKanbanViewProps {
  tasksByStatus: Record<string, any[]>;
}

const TaskKanbanView: React.FC<TaskKanbanViewProps> = ({ tasksByStatus }) => {
  const statuses = ['Inbox', 'Todo', 'Doing', 'Blocked', 'Done'];

  return (
    <div className="flex gap-6 h-full overflow-x-auto pb-4">
      {statuses.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={tasksByStatus[status] || []}
        />
      ))}
    </div>
  );
};

// Task Row Component
interface TaskRowProps {
  task: any;
  density: 'comfortable' | 'compact';
}

const TaskRow: React.FC<TaskRowProps> = ({ task, density }) => {
  const { openDrawer, clients, projects } = useAppStore();

  const client = clients.find(c => c.id === task.clientId);
  const project = projects.find(p => p.id === task.projectId);

  const handleTaskClick = () => {
    openDrawer({ type: 'task-details', data: task });
  };

  const getDueStatus = () => {
    if (!task.due) return null;
    if (isOverdue(task.due)) return 'overdue';
    if (isDueSoon(task.due)) return 'due-soon';
    return 'normal';
  };

  const dueStatus = getDueStatus();

  return (
    <div
      onClick={handleTaskClick}
      className={cn(
        'task-row',
        density === 'compact' ? 'compact' : 'comfortable'
      )}
    >
      {/* Status indicator */}
      <div className={cn('status-dot', getStatusColor(task.status))} />

      {/* Task content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate">{task.title}</span>
          {task.isNextStep && (
            <span className="text-xs bg-accent/20 text-accent px-1.5 py-0.5 rounded">
              Next Step
            </span>
          )}
        </div>
        
        {density === 'comfortable' && task.description && (
          <div className="text-xs text-muted truncate mt-1">
            {task.description}
          </div>
        )}
        
        <div className="flex items-center gap-3 mt-1">
          {client && (
            <div className="flex items-center gap-1 text-xs text-muted">
              <User className="w-3 h-3" />
              <span>{client.name}</span>
            </div>
          )}
          {project && (
            <div className="flex items-center gap-1 text-xs text-muted">
              <FolderOpen className="w-3 h-3" />
              <span>{project.title}</span>
            </div>
          )}
        </div>
      </div>

      {/* Due date */}
      {task.due && (
        <div className={cn(
          'text-xs px-2 py-1 rounded-md flex items-center gap-1',
          dueStatus === 'overdue' && 'bg-danger/20 text-danger',
          dueStatus === 'due-soon' && 'bg-warn/20 text-warn',
          dueStatus === 'normal' && 'bg-ring/20 text-muted'
        )}>
          <Calendar className="w-3 h-3" />
          <span>{formatDate(task.due, 'MMM D')}</span>
        </div>
      )}

      {/* Priority indicator */}
      {task.priority && task.priority >= 4 && (
        <AlertCircle className="w-4 h-4 text-danger" />
      )}

      {/* ICE Score */}
      {task.score && (
        <div className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-md">
          {task.score.toFixed(1)}
        </div>
      )}

      {/* Actions */}
      <button className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-bg-elev2 transition-all">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
};

// Kanban Column Component
interface KanbanColumnProps {
  status: string;
  tasks: any[];
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, tasks }) => {
  return (
    <div className="flex-shrink-0 w-80">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn('w-3 h-3 rounded-full', getStatusColor(status))} />
          <h3 className="font-medium text-text">{status}</h3>
          <span className="text-xs text-muted bg-bg-elev1 px-2 py-1 rounded-pill">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-3 max-h-full overflow-y-auto">
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

// Kanban Card Component
interface KanbanCardProps {
  task: any;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ task }) => {
  const { openDrawer, clients, projects } = useAppStore();

  const client = clients.find(c => c.id === task.clientId);
  const project = projects.find(p => p.id === task.projectId);

  const handleCardClick = () => {
    openDrawer({ type: 'task-details', data: task });
  };

  return (
    <div
      onClick={handleCardClick}
      className="card p-4 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-sm text-text line-clamp-2">
          {task.title}
        </h4>
        {task.priority && task.priority >= 4 && (
          <AlertCircle className="w-4 h-4 text-danger flex-shrink-0 ml-2" />
        )}
      </div>

      {task.description && (
        <p className="text-xs text-muted line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {client && (
            <span className="text-xs bg-tag-signed/20 text-tag-signed px-2 py-1 rounded-pill">
              {client.name}
            </span>
          )}
          {project && (
            <span className="text-xs bg-tag-impl/20 text-tag-impl px-2 py-1 rounded-pill">
              {project.title}
            </span>
          )}
        </div>

        {task.due && (
          <div className="flex items-center gap-1 text-xs text-muted">
            <Clock className="w-3 h-3" />
            <span>{formatDate(task.due, 'MMM D')}</span>
          </div>
        )}
      </div>

      {task.score && (
        <div className="mt-2 text-xs text-accent">
          ICE Score: {task.score.toFixed(1)}
        </div>
      )}
    </div>
  );
};

export default Tasks;