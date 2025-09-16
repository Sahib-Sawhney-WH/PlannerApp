import React from 'react';
import { useAppStore } from '@/store/mock';
import { cn, formatDate, isOverdue, isDueSoon } from '@/lib/utils';
import {
  CheckSquare,
  Clock,
  FolderOpen,
  AlertCircle,
  TrendingUp,
  Calendar,
  Target,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { tasks, projects, clients, opportunities } = useAppStore();

  // Calculate dashboard metrics
  const metrics = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'Done').length,
    overdueTasks: tasks.filter(t => t.due && isOverdue(t.due)).length,
    dueSoonTasks: tasks.filter(t => t.due && isDueSoon(t.due)).length,
    activeProjects: projects.filter(p => p.kind === 'Active').length,
    totalClients: clients.length,
    openOpportunities: opportunities?.filter(o => !['Closed Won', 'Closed Lost'].includes(o.stage)).length || 0,
  };

  const todayTasks = tasks.filter(t => 
    t.due && formatDate(t.due, 'YYYY-MM-DD') === formatDate(new Date(), 'YYYY-MM-DD')
  );

  const nextStepItems = [
    ...tasks.filter(t => t.isNextStep),
    ...projects.filter(p => p.nextStep),
    ...clients.filter(c => c.nextStep),
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's what's happening today.
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            {formatDate(new Date(), 'dddd, MMMM D, YYYY')}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Tasks"
            value={metrics.totalTasks}
            subtitle={`${metrics.completedTasks} completed`}
            icon={CheckSquare}
            color="accent"
          />
          <MetricCard
            title="Overdue"
            value={metrics.overdueTasks}
            subtitle="Need attention"
            icon={AlertCircle}
            color="danger"
          />
          <MetricCard
            title="Active Projects"
            value={metrics.activeProjects}
            subtitle="In progress"
            icon={FolderOpen}
            color="success"
          />
          <MetricCard
            title="Opportunities"
            value={metrics.openOpportunities}
            subtitle="Open pipeline"
            icon={Target}
            color="warn"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Tasks */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-accent" />
                  Today's Tasks
                </h2>
                <span className="text-sm text-muted">
                  {todayTasks.length} tasks
                </span>
              </div>
              
              <div className="space-y-2">
                {todayTasks.length > 0 ? (
                  todayTasks.slice(0, 5).map((task) => (
                    <TaskRow key={task.id} task={task} />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No tasks due today</p>
                    <p className="text-sm">Great job staying on top of things!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div>
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Next Steps
                </h2>
                <span className="text-sm text-muted">
                  {nextStepItems.length} items
                </span>
              </div>
              
              <div className="space-y-3">
                {nextStepItems.length > 0 ? (
                  nextStepItems.slice(0, 6).map((item, index) => (
                    <NextStepItem key={index} item={item} />
                  ))
                ) : (
                  <div className="text-center py-6 text-muted">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No next steps defined</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            Recent Activity
          </h2>
          
          <div className="space-y-3">
            {/* Placeholder for recent activity */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-elev1">
              <div className="w-2 h-2 rounded-full bg-success"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">Task completed</div>
                <div className="text-xs text-muted">Configure firewall rules - 2 hours ago</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-elev1">
              <div className="w-2 h-2 rounded-full bg-accent"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">New project created</div>
                <div className="text-xs text-muted">AI-Powered Analytics Demo - 4 hours ago</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-elev1">
              <div className="w-2 h-2 rounded-full bg-warn"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">Client meeting scheduled</div>
                <div className="text-xs text-muted">Acme Corporation - 6 hours ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'accent' | 'success' | 'warn' | 'danger';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, icon: Icon, color }) => {
  const colorClasses = {
    accent: 'text-primary bg-primary/10',
    success: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20',
    warn: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20',
    danger: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20',
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <div className={cn('p-3 rounded-lg', colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// Task Row Component
interface TaskRowProps {
  task: any;
}

const TaskRow: React.FC<TaskRowProps> = ({ task }) => {
  const { openDrawer } = useAppStore();

  const handleTaskClick = () => {
    openDrawer({ type: 'task-details', data: task });
  };

  return (
    <div
      onClick={handleTaskClick}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
    >
      <div className={cn('w-2 h-2 rounded-full', getStatusColor(task.status))} />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate text-foreground">{task.title}</div>
        <div className="text-xs text-muted-foreground">
          {task.due && formatDate(task.due, 'h:mm A')}
        </div>
      </div>
      {task.priority && task.priority >= 4 && (
        <AlertCircle className="w-4 h-4 text-destructive" />
      )}
    </div>
  );
};

// Next Step Item Component
interface NextStepItemProps {
  item: any;
}

const NextStepItem: React.FC<NextStepItemProps> = ({ item }) => {
  const isTask = 'status' in item;
  const isProject = 'kind' in item;

  const getItemType = () => {
    if (isTask) return 'Task';
    if (isProject) return 'Project';
    return 'Client';
  };

  const getNextStep = () => {
    if (isTask && item.isNextStep) return item.title;
    return item.nextStep;
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted">
      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate text-foreground">{getNextStep()}</div>
        <div className="text-xs text-muted-foreground">
          {getItemType()} • {item.nextStepDue && formatDate(item.nextStepDue, 'MMM D')}
        </div>
      </div>
    </div>
  );
};

// Helper function to get status color
const getStatusColor = (status: string) => {
  const colors = {
    'Inbox': 'bg-muted-foreground',
    'Todo': 'bg-blue-500',
    'Doing': 'bg-yellow-500',
    'Blocked': 'bg-red-500',
    'Done': 'bg-green-500',
  };
  return colors[status as keyof typeof colors] || 'bg-muted-foreground';
};

export default Dashboard;