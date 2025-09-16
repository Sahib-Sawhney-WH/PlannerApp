import React, { useState } from 'react';
import { useAppStore } from '@/store/mock';
import { cn } from '@/lib/utils';
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Building, 
  Calendar, 
  Tag,
  Edit3,
  Trash2,
  Save,
  X,
  User,
} from 'lucide-react';

const Projects: React.FC = () => {
  const { projects, clients, openDrawer } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const statuses = ['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'];
  
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleProjectSelect = (project: any) => {
    setSelectedProject(project);
    // Don't open drawer, just show details in main area
  };

  const handleNewProject = () => {
    setShowCreateForm(true);
    openDrawer({ type: 'project-form' });
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-80 border-r border-border bg-muted/30 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5" />
              <h1 className="text-lg font-semibold">Projects</h1>
            </div>
            <button
              onClick={handleNewProject}
              className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="p-2 bg-background rounded border">
              <div className="text-xs text-muted-foreground">Total</div>
              <div className="font-semibold">{projects.length}</div>
            </div>
            <div className="p-2 bg-background rounded border">
              <div className="text-xs text-muted-foreground">Active</div>
              <div className="font-semibold">{projects.filter(p => p.kind === 'Active').length}</div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background mb-4"
          >
            <option value="">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto">
          {filteredProjects.map(project => {
            const client = clients.find(c => c.id === project.clientId);
            return (
              <div
                key={project.id}
                onClick={() => handleProjectSelect(project)}
                className={cn(
                  'p-4 border-b border-border cursor-pointer hover:bg-muted/50',
                  selectedProject?.id === project.id && 'bg-muted'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium line-clamp-1">{project.title}</h3>
                  <span className={cn(
                    'px-2 py-1 text-xs rounded-full',
                    getStatusColor(project.status)
                  )}>
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <span className={cn(
                      'px-1.5 py-0.5 rounded text-xs',
                      project.kind === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    )}>
                      {project.kind}
                    </span>
                  </div>
                  <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>
                {client && (
                  <div className="text-xs text-muted-foreground mt-1">
                    <Building className="h-3 w-3 inline mr-1" />
                    {client.name}
                  </div>
                )}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.tags.slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-1.5 py-0.5 bg-muted rounded text-xs"
                      >
                        <Tag className="h-2 w-2 mr-1" />
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{project.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedProject ? (
          <ProjectDetails project={selectedProject} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FolderOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">No project selected</h2>
              <p className="text-muted-foreground mb-4">Select a project from the sidebar or create a new one</p>
              <button
                onClick={handleNewProject}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Create New Project
              </button>
            </div>
          </div>
        )}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={editData.status || 'Planning'}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Kind</label>
              <select
                value={editData.kind || 'Active'}
                onChange={(e) => setEditData({ ...editData, kind: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="Active">Active</option>
                <option value="Planned">Planned</option>
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <div className="mt-1">
              <span className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                getStatusColor(project.status)
              )}>
                {project.status}
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Kind</label>
            <div className="mt-1 text-sm">{project.kind}</div>
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

        {project.nextStep && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Next Step</label>
            <div className="mt-1 text-sm">{project.nextStep}</div>
            {project.nextStepDue && (
              <div className="text-xs text-muted-foreground mt-1 flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                Due: {new Date(project.nextStepDue).toLocaleDateString()}
              </div>
            )}
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

// Helper function to get status color
const getStatusColor = (status: string) => {
  const colors = {
    'Planning': 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'On Hold': 'bg-orange-100 text-orange-800',
    'Completed': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

export default Projects;