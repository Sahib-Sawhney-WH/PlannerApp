import React, { useState } from 'react';
import { useAppStore } from '@/store/mock';
import { cn } from '@/lib/utils';
import { X, Edit3, Trash2, Save, Calendar, User, Building, Folder, Plus, Tag } from 'lucide-react';

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
      case 'project-form':
      case 'create-project':
        return <ProjectForm />;
      case 'project-details':
        return <ProjectDetails project={drawerContent.data} />;
      case 'client-form':
      case 'create-client':
        return <ClientForm />;
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
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={closeDrawer}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-600 shadow-lg z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {getDrawerTitle(drawerContent.type)}
          </h2>
          <button
            onClick={closeDrawer}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800">
          {renderContent()}
        </div>
      </div>
    </>
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
    case 'project-form':
    case 'create-project':
      return 'New Project';
    case 'project-details':
      return 'Project Details';
    case 'client-form':
    case 'create-client':
      return 'New Client';
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
      const taskData = {
        ...formData,
        due: formData.due ? new Date(formData.due).toISOString() : undefined,
      };
      await createTask(taskData);
      closeDrawer();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Enter task title..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 h-20"
            placeholder="Enter task description..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Inbox">Inbox</option>
              <option value="Todo">Todo</option>
              <option value="Doing">Doing</option>
              <option value="Done">Done</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
          <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Due Date</label>
          <input
            type="datetime-local"
            value={formData.due}
            onChange={(e) => setFormData({ ...formData, due: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Client</label>
          <select
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Select client...</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Project</label>
          <select
            value={formData.projectId}
            onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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

// Project Form Component
const ProjectForm: React.FC = () => {
  const { clients, createProject, closeDrawer } = useAppStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientId: '',
    kind: 'Active' as 'Active' | 'Planned',
    status: 'Planning',
    tags: [],
    nextStep: '',
    nextStepDue: '',
  });

  const [tagInput, setTagInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const projectData = {
        ...formData,
        nextStepDue: formData.nextStepDue ? new Date(formData.nextStepDue).toISOString() : undefined,
      };
      await createProject(projectData);
      closeDrawer();
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Project Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
            placeholder="Enter project title..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-md bg-background h-20"
            placeholder="Enter project description..."
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Kind</label>
            <select
              value={formData.kind}
              onChange={(e) => setFormData({ ...formData, kind: e.target.value as any })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="Active">Active</option>
              <option value="Planned">Planned</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tags</label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 px-3 py-2 border border-border rounded-md bg-background"
              placeholder="Add a tag..."
            />
            <button
              type="button"
              onClick={addTag}
              className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {formData.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 bg-muted rounded-full text-xs"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Next Step</label>
          <input
            type="text"
            value={formData.nextStep}
            onChange={(e) => setFormData({ ...formData, nextStep: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
            placeholder="What's the next step for this project?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Next Step Due Date</label>
          <input
            type="date"
            value={formData.nextStepDue}
            onChange={(e) => setFormData({ ...formData, nextStepDue: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
          />
        </div>

        <div className="flex space-x-2 pt-4">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            <Save className="w-4 h-4 mr-2 inline" />
            Create Project
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

// Client Form Component
const ClientForm: React.FC = () => {
  const { createClient, closeDrawer } = useAppStore();
  const [formData, setFormData] = useState({
    name: '',
    tags: [],
    contacts: [],
    links: [],
    nextStep: '',
    nextStepDue: '',
  });

  const [tagInput, setTagInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const clientData = {
        ...formData,
        nextStepDue: formData.nextStepDue ? new Date(formData.nextStepDue).toISOString() : undefined,
      };
      await createClient(clientData);
      closeDrawer();
    } catch (error) {
      console.error('Failed to create client:', error);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Client Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
            placeholder="Enter client name..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tags</label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 px-3 py-2 border border-border rounded-md bg-background"
              placeholder="Add a tag..."
            />
            <button
              type="button"
              onClick={addTag}
              className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {formData.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 bg-muted rounded-full text-xs"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Next Step</label>
          <input
            type="text"
            value={formData.nextStep}
            onChange={(e) => setFormData({ ...formData, nextStep: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
            placeholder="What's the next step with this client?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Next Step Due Date</label>
          <input
            type="date"
            value={formData.nextStepDue}
            onChange={(e) => setFormData({ ...formData, nextStepDue: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
          />
        </div>

        <div className="flex space-x-2 pt-4">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            <Save className="w-4 h-4 mr-2 inline" />
            Create Client
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
            <label className="block text-sm font-medium mb-1 text-foreground">Title</label>
            <input
              type="text"
              value={editData.title || ''}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Description</label>
            <textarea
              value={editData.description || ''}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Status</label>
              <select
                value={editData.status || 'Inbox'}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="Inbox">Inbox</option>
                <option value="Todo">Todo</option>
                <option value="Doing">Doing</option>
                <option value="Done">Done</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Priority</label>
              <select
                value={editData.priority || 3}
                onChange={(e) => setEditData({ ...editData, priority: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
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
            <label className="block text-sm font-medium mb-1 text-foreground">Due Date</label>
            <input
              type="datetime-local"
              value={editData.due ? new Date(editData.due).toISOString().slice(0, 16) : ''}
              onChange={(e) => setEditData({ ...editData, due: e.target.value ? new Date(e.target.value).toISOString() : null })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
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
          <h3 className="text-lg font-medium text-foreground">{task.title}</h3>
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
          <div className="mt-1 text-sm text-foreground">{task.description || 'No description provided'}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <div className="mt-1">
              <span className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                getStatusColor(task.status)
              )}>
                {task.status}
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Priority</label>
            <div className="mt-1 text-sm text-foreground">{task.priority}/5</div>
          </div>
        </div>

        {task.due && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Due Date</label>
            <div className="mt-1 text-sm text-foreground flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(task.due).toLocaleString()}
            </div>
          </div>
        )}

        {client && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Client</label>
            <div className="mt-1 text-sm text-foreground flex items-center">
              <Building className="w-4 h-4 mr-2" />
              {client.name}
            </div>
          </div>
        )}

        {project && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Project</label>
            <div className="mt-1 text-sm text-foreground flex items-center">
              <Folder className="w-4 h-4 mr-2" />
              {project.title}
            </div>
          </div>
        )}

        {task.tags && task.tags.length > 0 && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Tags</label>
            <div className="mt-1 flex flex-wrap gap-1">
              {task.tags.map((tag: string) => (
                <span key={tag} className="px-2 py-1 bg-muted rounded-full text-xs text-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-muted-foreground">Created</label>
          <div className="mt-1 text-sm text-foreground">{new Date(task.createdAt).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get status color
const getStatusColor = (status: string) => {
  const colors = {
    'Inbox': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    'Todo': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Doing': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Done': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Blocked': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
};

const ProjectDetails: React.FC<{ project: any }> = ({ project }) => (
  <div className="p-6">Project details for: {project?.title}</div>
);

const ClientDetails: React.FC<{ client: any }> = ({ client }) => (
  <div className="p-6">Client details for: {client?.name}</div>
);

const QuickAdd: React.FC = () => (
  <div className="p-6">Quick add functionality</div>
);

const SettingsPanel: React.FC = () => (
  <div className="p-6">Settings panel</div>
);

export default Drawer;

