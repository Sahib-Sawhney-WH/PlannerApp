import React, { useState } from 'react';
import { useAppStore } from '@/store/mock';
import { cn } from '@/lib/utils';
import { X, Edit3, Trash2, Save, Calendar, User, Building, Folder, Plus } from 'lucide-react';

const Drawer: React.FC = () => {
  const { drawerOpen, drawerContent, closeDrawer } = useAppStore();

  if (!drawerOpen || !drawerContent) {
    return null;
  }

  const renderContent = () => {
    if (!drawerContent) return null;
    
    switch (drawerContent.type) {
      case 'task-form':
      case 'create-task':
        return <TaskForm />;
      case 'task-details':
        return <TaskDetails task={drawerContent.data} />;
      case 'project-details':
        return <ProjectDetails project={drawerContent.data} />;
      case 'client-details':
        return <ClientDetails client={drawerContent.data} />;
      case 'quick-add':
        return <QuickAdd />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <div className="p-6">Unknown content type: {drawerContent.type}</div>;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-card border-l border-border shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">
          {getDrawerTitle(drawerContent.type)}
        </h2>
        <button
          onClick={closeDrawer}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

// Helper function to get drawer title
function getDrawerTitle(type: string): string {
  switch (type) {
    case 'task-form':
    case 'create-task':
      return 'New Task';
    case 'task-details':
      return 'Task Details';
    case 'project-details':
      return 'Project Details';
    case 'client-details':
      return 'Client Details';
    case 'quick-add':
      return 'Quick Add';
    case 'settings':
      return 'Settings';
    default:
      return 'Details';
  }
}

// Task Form Component
const TaskForm: React.FC = () => {
  const { clients, projects, createTask, closeDrawer } = useAppStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Inbox' as 'Inbox' | 'Todo' | 'Doing' | 'Done' | 'Blocked',
    priority: 3,
    due: '',
    clientId: '',
    projectId: '',
    tags: [],
    links: [],
    isNextStep: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask(formData);
      closeDrawer();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
            placeholder="Enter task title..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-md bg-background h-20"
            placeholder="Enter task description..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="Inbox">Inbox</option>
              <option value="Todo">Todo</option>
              <option value="Doing">Doing</option>
              <option value="Done">Done</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value={1}>1 - Low</option>
              <option value={2}>2 - Medium</option>
              <option value={3}>3 - Normal</option>
              <option value={4}>4 - High</option>
              <option value={5}>5 - Critical</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Due Date</label>
          <input
            type="date"
            value={formData.due ? formData.due.split('T')[0] : ''}
            onChange={(e) => setFormData({ ...formData, due: e.target.value ? new Date(e.target.value).toISOString() : '' })}
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
          />
        </div>

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

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isNextStep"
            checked={formData.isNextStep}
            onChange={(e) => setFormData({ ...formData, isNextStep: e.target.checked })}
            className="rounded border-border"
          />
          <label htmlFor="isNextStep" className="text-sm font-medium">Mark as next step</label>
        </div>

        <div className="flex space-x-2 pt-4">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Create Task
          </button>
          <button
            type="button"
            onClick={closeDrawer}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// Task Details Component
const TaskDetails: React.FC<{ task: any }> = ({ task }) => {
  const { clients, projects, updateTask, deleteTask, closeDrawer } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(task || {});

  if (!task) {
    return (
      <div className="p-6">
        <div className="text-center text-muted-foreground">
          No task selected
        </div>
      </div>
    );
  }

  const client = clients.find(c => c.id === task.clientId);
  const project = projects.find(p => p.id === task.projectId);

  const handleSave = async () => {
    try {
      await updateTask(task.id, editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(task.id);
        closeDrawer();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  if (isEditing) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={editData.title || ''}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={editData.description || ''}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={editData.status || 'Inbox'}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="Inbox">Inbox</option>
                <option value="Todo">Todo</option>
                <option value="Doing">Doing</option>
                <option value="Done">Done</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                value={editData.priority || 3}
                onChange={(e) => setEditData({ ...editData, priority: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value={1}>1 - Low</option>
                <option value={2}>2 - Medium</option>
                <option value={3}>3 - Normal</option>
                <option value={4}>4 - High</option>
                <option value={5}>5 - Critical</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              <Save className="w-4 h-4 mr-2 inline" />
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{task.title}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 hover:bg-muted rounded-md"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-destructive/10 text-destructive rounded-md"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground">Description</label>
          <div className="mt-1 text-sm">{task.description || 'No description provided'}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <div className="mt-1">
              <span className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                task.status === 'Done' && 'bg-green-100 text-green-800',
                task.status === 'Doing' && 'bg-blue-100 text-blue-800',
                task.status === 'Todo' && 'bg-yellow-100 text-yellow-800',
                task.status === 'Inbox' && 'bg-gray-100 text-gray-800',
                task.status === 'Blocked' && 'bg-red-100 text-red-800'
              )}>
                {task.status}
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Priority</label>
            <div className="mt-1 text-sm">{task.priority || 'Not set'}</div>
          </div>
        </div>

        {task.due && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Due Date</label>
            <div className="mt-1 text-sm flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(task.due).toLocaleDateString()}
            </div>
          </div>
        )}

        {(client || project) && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Associated</label>
            <div className="mt-1 space-y-1">
              {client && (
                <div className="text-sm flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  {client.name}
                </div>
              )}
              {project && (
                <div className="text-sm flex items-center">
                  <Folder className="w-4 h-4 mr-2" />
                  {project.title}
                </div>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-muted-foreground">Created</label>
          <div className="mt-1 text-sm">{new Date(task.createdAt).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
};

// Project Details Component
const ProjectDetails: React.FC<{ project: any }> = ({ project }) => {
  const { clients, updateProject, deleteProject, closeDrawer } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(project || {});

  if (!project) {
    return (
      <div className="p-6">
        <div className="text-center text-muted-foreground">
          No project selected
        </div>
      </div>
    );
  }

  const client = clients.find(c => c.id === project.clientId);

  const handleSave = async () => {
    try {
      await updateProject(project.id, editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(project.id);
        closeDrawer();
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  if (isEditing) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={editData.title || ''}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={editData.description || ''}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background h-20"
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              <Save className="w-4 h-4 mr-2 inline" />
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{project.title}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 hover:bg-muted rounded-md"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-destructive/10 text-destructive rounded-md"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground">Description</label>
          <div className="mt-1 text-sm">{project.description || 'No description provided'}</div>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground">Status</label>
          <div className="mt-1">
            <span className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              project.status === 'Active' && 'bg-green-100 text-green-800',
              project.status === 'Planning' && 'bg-blue-100 text-blue-800',
              project.status === 'On Hold' && 'bg-yellow-100 text-yellow-800',
              project.status === 'Completed' && 'bg-gray-100 text-gray-800'
            )}>
              {project.status}
            </span>
          </div>
        </div>

        {client && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Client</label>
            <div className="mt-1 text-sm flex items-center">
              <Building className="w-4 h-4 mr-2" />
              {client.name}
            </div>
          </div>
        )}

        {project.tags && project.tags.length > 0 && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Tags</label>
            <div className="mt-1 flex flex-wrap gap-1">
              {project.tags.map((tag: string) => (
                <span key={tag} className="px-2 py-1 bg-muted rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-muted-foreground">Created</label>
          <div className="mt-1 text-sm">{new Date(project.createdAt).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
};

// Client Details Component
const ClientDetails: React.FC<{ client: any }> = ({ client }) => {
  const { updateClient, deleteClient, closeDrawer } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(client || {});

  if (!client) {
    return (
      <div className="p-6">
        <div className="text-center text-muted-foreground">
          No client selected
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      await updateClient(client.id, editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update client:', error);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this client?')) {
      try {
        await deleteClient(client.id);
        closeDrawer();
      } catch (error) {
        console.error('Failed to delete client:', error);
      }
    }
  };

  if (isEditing) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={editData.name || ''}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              <Save className="w-4 h-4 mr-2 inline" />
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{client.name}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 hover:bg-muted rounded-md"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-destructive/10 text-destructive rounded-md"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {client.tags && client.tags.length > 0 && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Tags</label>
            <div className="mt-1 flex flex-wrap gap-1">
              {client.tags.map((tag: string) => (
                <span key={tag} className="px-2 py-1 bg-muted rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {client.contacts && client.contacts.length > 0 && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Contacts</label>
            <div className="mt-1 space-y-2">
              {client.contacts.map((contact: any) => (
                <div key={contact.id} className="p-3 bg-muted rounded-md">
                  <div className="font-medium">{contact.name}</div>
                  {contact.role && <div className="text-sm text-muted-foreground">{contact.role}</div>}
                  {contact.email && (
                    <div className="text-sm flex items-center mt-1">
                      <User className="w-3 h-3 mr-1" />
                      {contact.email}
                    </div>
                  )}
                  {contact.phone && (
                    <div className="text-sm flex items-center mt-1">
                      <User className="w-3 h-3 mr-1" />
                      {contact.phone}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {client.nextStep && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Next Step</label>
            <div className="mt-1 text-sm">{client.nextStep}</div>
            {client.nextStepDue && (
              <div className="text-xs text-muted-foreground mt-1">
                Due: {new Date(client.nextStepDue).toLocaleDateString()}
              </div>
            )}
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-muted-foreground">Created</label>
          <div className="mt-1 text-sm">{new Date(client.createdAt).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
};

// Quick Add Component
const QuickAdd: React.FC = () => {
  const { openDrawer } = useAppStore();

  return (
    <div className="p-6">
      <div className="space-y-4">
        <button 
          onClick={() => openDrawer('create-task')}
          className="w-full p-4 text-left rounded-lg border border-border hover:bg-muted transition-colors"
        >
          <div className="flex items-center">
            <Plus className="w-5 h-5 mr-3" />
            <div>
              <div className="font-medium">New Task</div>
              <div className="text-sm text-muted-foreground">Create a new task</div>
            </div>
          </div>
        </button>
        
        <button 
          onClick={() => openDrawer('create-project')}
          className="w-full p-4 text-left rounded-lg border border-border hover:bg-muted transition-colors"
        >
          <div className="flex items-center">
            <Folder className="w-5 h-5 mr-3" />
            <div>
              <div className="font-medium">New Project</div>
              <div className="text-sm text-muted-foreground">Create a new project</div>
            </div>
          </div>
        </button>
        
        <button 
          onClick={() => openDrawer('create-client')}
          className="w-full p-4 text-left rounded-lg border border-border hover:bg-muted transition-colors"
        >
          <div className="flex items-center">
            <Building className="w-5 h-5 mr-3" />
            <div>
              <div className="font-medium">New Client</div>
              <div className="text-sm text-muted-foreground">Add a new client</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

// Settings Panel Component
const SettingsPanel: React.FC = () => {
  const { theme, setTheme } = useAppStore();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Appearance</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTheme({ ...theme, mode: 'light' })}
                className={cn(
                  'p-3 rounded-lg border text-left transition-colors',
                  theme.mode === 'light' 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:bg-muted'
                )}
              >
                <div className="font-medium">Light</div>
                <div className="text-sm text-muted-foreground">Light theme</div>
              </button>
              <button
                onClick={() => setTheme({ ...theme, mode: 'dark' })}
                className={cn(
                  'p-3 rounded-lg border text-left transition-colors',
                  theme.mode === 'dark' 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:bg-muted'
                )}
              >
                <div className="font-medium">Dark</div>
                <div className="text-sm text-muted-foreground">Dark theme</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Density</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTheme({ ...theme, density: 'comfortable' })}
                className={cn(
                  'p-3 rounded-lg border text-left transition-colors',
                  theme.density === 'comfortable' 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:bg-muted'
                )}
              >
                <div className="font-medium">Comfortable</div>
                <div className="text-sm text-muted-foreground">More spacing</div>
              </button>
              <button
                onClick={() => setTheme({ ...theme, density: 'compact' })}
                className={cn(
                  'p-3 rounded-lg border text-left transition-colors',
                  theme.density === 'compact' 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:bg-muted'
                )}
              >
                <div className="font-medium">Compact</div>
                <div className="text-sm text-muted-foreground">Less spacing</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;

