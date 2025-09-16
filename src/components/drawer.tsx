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
      case 'create-client':
        return <ClientForm />;
      case 'create-project':
        return <ProjectForm />;
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
    <>
      {/* Modal overlay with proper styling */}
      <div 
        className="fixed inset-0 z-40 modal-overlay"
        onClick={closeDrawer}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(2px)'
        }}
      />
      
      {/* Drawer with fixed styling */}
      <div 
        className="fixed inset-y-0 right-0 w-96 z-50 flex flex-col drawer-content"
        style={{
          backgroundColor: 'hsl(var(--bg-elev1))',
          borderLeft: '1px solid hsl(var(--border))',
          boxShadow: '0 8px 24px rgba(0,0,0,.25)'
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4"
          style={{
            borderBottom: '1px solid hsl(var(--border))',
            backgroundColor: 'hsl(var(--bg-elev1))'
          }}
        >
          <h2 className="text-lg font-semibold text-text">
            {getDrawerTitle(drawerContent.type)}
          </h2>
          <button
            onClick={closeDrawer}
            className="p-1.5 rounded-lg hover:bg-bg-elev2 transition-colors text-text"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div 
          className="flex-1 overflow-y-auto scrollbar-thin"
          style={{
            backgroundColor: 'hsl(var(--bg-elev1))'
          }}
        >
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
    case 'create-client':
      return 'New Client';
    case 'create-project':
      return 'New Project';
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
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="form-input"
            placeholder="Enter task title..."
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="form-textarea"
            placeholder="Enter task description..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="form-select"
            >
              <option value="Inbox">Inbox</option>
              <option value="Todo">Todo</option>
              <option value="Doing">Doing</option>
              <option value="Done">Done</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
              className="form-select"
            >
              <option value={1}>1 - Low</option>
              <option value={2}>2 - Medium</option>
              <option value={3}>3 - Normal</option>
              <option value={4}>4 - High</option>
              <option value={5}>5 - Critical</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Due Date</label>
          <input
            type="date"
            value={formData.due ? formData.due.split('T')[0] : ''}
            onChange={(e) => setFormData({ ...formData, due: e.target.value ? new Date(e.target.value).toISOString() : '' })}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Client</label>
          <select
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
            className="form-select"
          >
            <option value="">Select client...</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Project</label>
          <select
            value={formData.projectId}
            onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
            className="form-select"
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
            className="w-4 h-4 text-accent bg-bg-elev1 border-border rounded focus:ring-accent focus:ring-2"
          />
          <label htmlFor="isNextStep" className="text-sm font-medium text-text">
            Mark as next step
          </label>
        </div>

        <div className="flex space-x-2 pt-4">
          <button
            type="submit"
            className="btn btn-primary flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            Create Task
          </button>
          <button
            type="button"
            onClick={closeDrawer}
            className="btn btn-secondary"
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

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    isPrimary: false,
  });

  const [tagInput, setTagInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createClient({
        ...formData,
        nextStepDue: formData.nextStepDue ? new Date(formData.nextStepDue).toISOString() : undefined,
      });
      closeDrawer();
    } catch (error) {
      console.error('Failed to create client:', error);
    }
  };

  const addContact = () => {
    if (contactForm.name.trim()) {
      setFormData({
        ...formData,
        contacts: [...formData.contacts, { ...contactForm, id: Date.now().toString() }]
      });
      setContactForm({
        name: '',
        email: '',
        phone: '',
        role: '',
        isPrimary: false,
      });
    }
  };

  const removeContact = (index: number) => {
    setFormData({
      ...formData,
      contacts: formData.contacts.filter((_, i) => i !== index)
    });
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
        <div className="form-group">
          <label className="form-label">Client Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="form-input"
            placeholder="Enter client name..."
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tags</label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="form-input flex-1"
              placeholder="Add a tag..."
            />
            <button
              type="button"
              onClick={addTag}
              className="btn btn-secondary"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {formData.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 bg-bg-elev2 rounded-pill text-xs text-text"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-danger"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Next Step</label>
          <input
            type="text"
            value={formData.nextStep}
            onChange={(e) => setFormData({ ...formData, nextStep: e.target.value })}
            className="form-input"
            placeholder="What's the next step with this client?"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Next Step Due Date</label>
          <input
            type="date"
            value={formData.nextStepDue ? formData.nextStepDue.split('T')[0] : ''}
            onChange={(e) => setFormData({ ...formData, nextStepDue: e.target.value })}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Contacts</label>
          <div className="space-y-2 mb-3">
            <input
              type="text"
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              className="form-input"
              placeholder="Contact name..."
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                className="form-input"
                placeholder="Email..."
              />
              <input
                type="tel"
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                className="form-input"
                placeholder="Phone..."
              />
            </div>
            <input
              type="text"
              value={contactForm.role}
              onChange={(e) => setContactForm({ ...contactForm, role: e.target.value })}
              className="form-input"
              placeholder="Role/Title..."
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPrimary"
                  checked={contactForm.isPrimary}
                  onChange={(e) => setContactForm({ ...contactForm, isPrimary: e.target.checked })}
                  className="w-4 h-4 text-accent bg-bg-elev1 border-border rounded focus:ring-accent focus:ring-2"
                />
                <label htmlFor="isPrimary" className="text-sm text-text">
                  Primary contact
                </label>
              </div>
              <button
                type="button"
                onClick={addContact}
                className="btn btn-secondary"
              >
                Add Contact
              </button>
            </div>
          </div>
          
          {formData.contacts.length > 0 && (
            <div className="space-y-2">
              {formData.contacts.map((contact, index) => (
                <div key={index} className="p-3 bg-bg-elev2 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-text">{contact.name}</div>
                      {contact.role && <div className="text-sm text-muted">{contact.role}</div>}
                      {contact.email && <div className="text-sm text-muted">{contact.email}</div>}
                      {contact.phone && <div className="text-sm text-muted">{contact.phone}</div>}
                      {contact.isPrimary && (
                        <div className="text-xs text-accent">Primary Contact</div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeContact(index)}
                      className="text-danger hover:text-danger/80"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex space-x-2 pt-4">
          <button
            type="submit"
            className="btn btn-primary flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            Create Client
          </button>
          <button
            type="button"
            onClick={closeDrawer}
            className="btn btn-secondary"
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
      await createProject({
        ...formData,
        nextStepDue: formData.nextStepDue ? new Date(formData.nextStepDue).toISOString() : undefined,
      });
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
        <div className="form-group">
          <label className="form-label">Project Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="form-input"
            placeholder="Enter project title..."
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="form-textarea"
            placeholder="Enter project description..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Client</label>
          <select
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
            className="form-select"
          >
            <option value="">Select client...</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Kind</label>
            <select
              value={formData.kind}
              onChange={(e) => setFormData({ ...formData, kind: e.target.value as any })}
              className="form-select"
            >
              <option value="Active">Active</option>
              <option value="Planned">Planned</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <input
              type="text"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="form-input"
              placeholder="e.g., Planning, In Progress, On Hold"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Tags</label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="form-input flex-1"
              placeholder="Add a tag..."
            />
            <button
              type="button"
              onClick={addTag}
              className="btn btn-secondary"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {formData.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 bg-bg-elev2 rounded-pill text-xs text-text"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-danger"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Next Step</label>
          <input
            type="text"
            value={formData.nextStep}
            onChange={(e) => setFormData({ ...formData, nextStep: e.target.value })}
            className="form-input"
            placeholder="What's the next step for this project?"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Next Step Due Date</label>
          <input
            type="date"
            value={formData.nextStepDue ? formData.nextStepDue.split('T')[0] : ''}
            onChange={(e) => setFormData({ ...formData, nextStepDue: e.target.value })}
            className="form-input"
          />
        </div>

        <div className="flex space-x-2 pt-4">
          <button
            type="submit"
            className="btn btn-primary flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            Create Project
          </button>
          <button
            type="button"
            onClick={closeDrawer}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// Task Details Component (simplified version)
const TaskDetails: React.FC<{ task: any }> = ({ task }) => {
  const { clients, projects, updateTask, deleteTask, closeDrawer } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(task || {});

  if (!task) {
    return (
      <div className="p-6">
        <div className="text-center text-muted">
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
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              value={editData.title || ''}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              value={editData.description || ''}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              className="form-textarea"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                value={editData.status || 'Inbox'}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                className="form-select"
              >
                <option value="Inbox">Inbox</option>
                <option value="Todo">Todo</option>
                <option value="Doing">Doing</option>
                <option value="Done">Done</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                value={editData.priority || 3}
                onChange={(e) => setEditData({ ...editData, priority: parseInt(e.target.value) })}
                className="form-select"
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
              className="btn btn-primary flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary"
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
          <h3 className="text-lg font-medium text-text">{task.title}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 hover:bg-bg-elev2 rounded-md text-text"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-danger/10 text-danger rounded-md"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-muted">Description</label>
          <div className="mt-1 text-sm text-text">{task.description || 'No description provided'}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted">Status</label>
            <div className="mt-1">
              <span className={cn(
                'px-2 py-1 rounded-pill text-xs font-medium',
                task.status === 'Done' && 'bg-success/20 text-success',
                task.status === 'Doing' && 'bg-doing/20 text-doing',
                task.status === 'Todo' && 'bg-todo/20 text-todo',
                task.status === 'Inbox' && 'bg-muted/20 text-muted',
                task.status === 'Blocked' && 'bg-blocked/20 text-blocked'
              )}>
                {task.status}
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted">Priority</label>
            <div className="mt-1 text-sm text-text">{task.priority || 'Not set'}</div>
          </div>
        </div>

        {task.due && (
          <div>
            <label className="text-sm font-medium text-muted">Due Date</label>
            <div className="mt-1 text-sm flex items-center text-text">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(task.due).toLocaleDateString()}
            </div>
          </div>
        )}

        {(client || project) && (
          <div>
            <label className="text-sm font-medium text-muted">Associated</label>
            <div className="mt-1 space-y-1">
              {client && (
                <div className="text-sm flex items-center text-text">
                  <Building className="w-4 h-4 mr-2" />
                  {client.name}
                </div>
              )}
              {project && (
                <div className="text-sm flex items-center text-text">
                  <Folder className="w-4 h-4 mr-2" />
                  {project.title}
                </div>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-muted">Created</label>
          <div className="mt-1 text-sm text-text">{new Date(task.createdAt).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
};

// Placeholder components for other drawer content
const ProjectDetails: React.FC<{ project: any }> = ({ project }) => (
  <div className="p-6">
    <div className="text-center text-muted">
      Project details component - to be implemented
    </div>
  </div>
);

const ClientDetails: React.FC<{ client: any }> = ({ client }) => (
  <div className="p-6">
    <div className="text-center text-muted">
      Client details component - to be implemented
    </div>
  </div>
);

const QuickAdd: React.FC = () => (
  <div className="p-6">
    <div className="text-center text-muted">
      Quick add component - to be implemented
    </div>
  </div>
);

const SettingsPanel: React.FC = () => (
  <div className="p-6">
    <div className="text-center text-muted">
      Settings panel - to be implemented
    </div>
  </div>
);

export default Drawer;