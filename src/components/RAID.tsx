import React, { useState } from 'react';
import { useAppStore } from '@/store/mock';
import { cn } from '@/lib/utils';
import { 
  AlertTriangle, 
  Plus, 
  Search, 
  Calendar, 
  Edit3, 
  Trash2, 
  Save,
  X,
  Flag,
  Clock,
  Building,
  Folder,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface RAIDItem {
  id: string;
  type: 'risk' | 'assumption' | 'issue' | 'dependency';
  title: string;
  description: string;
  status: 'open' | 'closed' | 'monitoring' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  impact: 'low' | 'medium' | 'high';
  probability?: 'low' | 'medium' | 'high'; // For risks
  owner: string;
  dueDate?: string;
  clientId?: string;
  projectId?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

const RAID: React.FC = () => {
  const { clients, projects } = useAppStore();
  const [raidItems, setRaidItems] = useState<RAIDItem[]>([
    {
      id: '1',
      type: 'risk',
      title: 'Security Vulnerability in Legacy System',
      description: 'Potential security breach due to outdated authentication system. Could expose sensitive client data if not addressed promptly.',
      status: 'open',
      priority: 'high',
      impact: 'high',
      probability: 'medium',
      owner: 'Security Team',
      dueDate: new Date('2024-02-15').toISOString(),
      clientId: '1',
      projectId: '1',
      tags: ['security', 'legacy', 'urgent'],
      createdAt: new Date('2024-01-01').toISOString(),
      updatedAt: new Date('2024-01-05').toISOString(),
    },
    {
      id: '2',
      type: 'assumption',
      title: 'Client Will Provide API Access',
      description: 'Assuming the client will grant necessary API access for data integration by the specified deadline.',
      status: 'monitoring',
      priority: 'medium',
      impact: 'medium',
      owner: 'Project Manager',
      dueDate: new Date('2024-01-20').toISOString(),
      clientId: '2',
      projectId: '2',
      tags: ['api', 'integration', 'client-dependency'],
      createdAt: new Date('2023-12-15').toISOString(),
      updatedAt: new Date('2024-01-03').toISOString(),
    },
    {
      id: '3',
      type: 'issue',
      title: 'Performance Bottleneck in Data Processing',
      description: 'Current data processing pipeline is experiencing significant delays, affecting overall system performance.',
      status: 'open',
      priority: 'critical',
      impact: 'high',
      owner: 'Development Team',
      dueDate: new Date('2024-01-12').toISOString(),
      projectId: '2',
      tags: ['performance', 'data', 'critical'],
      createdAt: new Date('2024-01-08').toISOString(),
      updatedAt: new Date('2024-01-10').toISOString(),
    },
    {
      id: '4',
      type: 'dependency',
      title: 'Third-party Library Update',
      description: 'Project depends on updated version of analytics library. Vendor has confirmed delivery by end of month.',
      status: 'monitoring',
      priority: 'medium',
      impact: 'medium',
      owner: 'Technical Lead',
      dueDate: new Date('2024-01-31').toISOString(),
      projectId: '1',
      tags: ['vendor', 'library', 'external'],
      createdAt: new Date('2023-12-20').toISOString(),
      updatedAt: new Date('2024-01-02').toISOString(),
    }
  ]);

  const [selectedItem, setSelectedItem] = useState<RAIDItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const filteredItems = raidItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = !typeFilter || item.type === typeFilter;
    const matchesStatus = !statusFilter || item.status === statusFilter;
    const matchesPriority = !priorityFilter || item.priority === priorityFilter;
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  const createRAIDItem = (itemData: Omit<RAIDItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: RAIDItem = {
      ...itemData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRaidItems([newItem, ...raidItems]);
    setSelectedItem(newItem);
    setShowCreateForm(false);
  };

  const updateRAIDItem = (id: string, updates: Partial<RAIDItem>) => {
    setRaidItems(items => items.map(item => 
      item.id === id 
        ? { 
            ...item, 
            ...updates, 
            updatedAt: new Date().toISOString(),
            resolvedAt: updates.status === 'resolved' || updates.status === 'closed' 
              ? new Date().toISOString() 
              : item.resolvedAt
          }
        : item
    ));
    if (selectedItem?.id === id) {
      setSelectedItem({ ...selectedItem, ...updates });
    }
  };

  const deleteRAIDItem = (id: string) => {
    setRaidItems(items => items.filter(item => item.id !== id));
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  const getTypeStats = () => {
    const stats = {
      risk: { total: 0, open: 0 },
      assumption: { total: 0, open: 0 },
      issue: { total: 0, open: 0 },
      dependency: { total: 0, open: 0 },
    };

    raidItems.forEach(item => {
      stats[item.type].total++;
      if (item.status === 'open') {
        stats[item.type].open++;
      }
    });

    return stats;
  };

  const stats = getTypeStats();

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-80 border-r border-border bg-muted/30 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <h1 className="text-lg font-semibold">RAID Log</h1>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="p-2 bg-background rounded border">
              <div className="text-xs text-muted-foreground">Risks</div>
              <div className="font-semibold text-red-600">{stats.risk.open}/{stats.risk.total}</div>
            </div>
            <div className="p-2 bg-background rounded border">
              <div className="text-xs text-muted-foreground">Assumptions</div>
              <div className="font-semibold text-blue-600">{stats.assumption.open}/{stats.assumption.total}</div>
            </div>
            <div className="p-2 bg-background rounded border">
              <div className="text-xs text-muted-foreground">Issues</div>
              <div className="font-semibold text-orange-600">{stats.issue.open}/{stats.issue.total}</div>
            </div>
            <div className="p-2 bg-background rounded border">
              <div className="text-xs text-muted-foreground">Dependencies</div>
              <div className="font-semibold text-purple-600">{stats.dependency.open}/{stats.dependency.total}</div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search RAID items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background"
            />
          </div>

          {/* Filters */}
          <div className="space-y-2 mb-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="">All Types</option>
              <option value="risk">Risks</option>
              <option value="assumption">Assumptions</option>
              <option value="issue">Issues</option>
              <option value="dependency">Dependencies</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="monitoring">Monitoring</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        {/* RAID Items List */}
        <div className="flex-1 overflow-y-auto">
          {filteredItems.map(item => {
            const client = clients.find(c => c.id === item.clientId);
            const project = projects.find(p => p.id === item.projectId);

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={cn(
                  'p-4 border-b border-border cursor-pointer hover:bg-muted/50',
                  selectedItem?.id === item.id && 'bg-muted'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <TypeIcon type={item.type} />
                    <h3 className="font-medium line-clamp-1">{item.title}</h3>
                  </div>
                  <div className="flex items-center space-x-1">
                    <StatusIcon status={item.status} />
                    <PriorityIcon priority={item.priority} />
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 bg-muted rounded text-xs capitalize">
                      {item.type}
                    </span>
                    <span className="px-1.5 py-0.5 bg-muted rounded text-xs capitalize">
                      {item.status}
                    </span>
                  </div>
                  <span>{item.owner}</span>
                </div>
                
                {item.dueDate && (
                  <div className="text-xs text-muted-foreground mt-1 flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
                
                {(client || project) && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {client && <span>{client.name}</span>}
                    {client && project && <span> • </span>}
                    {project && <span>{project.title}</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {showCreateForm ? (
          <RAIDItemForm
            onSave={createRAIDItem}
            onCancel={() => setShowCreateForm(false)}
            clients={clients}
            projects={projects}
          />
        ) : selectedItem ? (
          <RAIDItemViewer
            item={selectedItem}
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            onSave={(updates) => {
              updateRAIDItem(selectedItem.id, updates);
              setIsEditing(false);
            }}
            onDelete={() => deleteRAIDItem(selectedItem.id)}
            onCancel={() => setIsEditing(false)}
            clients={clients}
            projects={projects}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">No item selected</h2>
              <p className="text-muted-foreground mb-4">Select a RAID item from the sidebar or create a new one</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Create RAID Item
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TypeIcon: React.FC<{ type: string }> = ({ type }) => {
  const icons = {
    risk: AlertTriangle,
    assumption: Info,
    issue: XCircle,
    dependency: Clock,
  };
  const colors = {
    risk: 'text-red-500',
    assumption: 'text-blue-500',
    issue: 'text-orange-500',
    dependency: 'text-purple-500',
  };
  const Icon = icons[type as keyof typeof icons] || AlertTriangle;
  const color = colors[type as keyof typeof colors] || 'text-muted-foreground';
  return <Icon className={cn('h-4 w-4', color)} />;
};

const StatusIcon: React.FC<{ status: string }> = ({ status }) => {
  const icons = {
    open: AlertCircle,
    monitoring: Clock,
    resolved: CheckCircle,
    closed: XCircle,
  };
  const colors = {
    open: 'text-red-500',
    monitoring: 'text-yellow-500',
    resolved: 'text-green-500',
    closed: 'text-gray-500',
  };
  const Icon = icons[status as keyof typeof icons] || AlertCircle;
  const color = colors[status as keyof typeof colors] || 'text-muted-foreground';
  return <Icon className={cn('h-3 w-3', color)} />;
};

const PriorityIcon: React.FC<{ priority: string }> = ({ priority }) => {
  const colors = {
    low: 'text-green-500',
    medium: 'text-yellow-500',
    high: 'text-orange-500',
    critical: 'text-red-500',
  };
  const color = colors[priority as keyof typeof colors] || 'text-muted-foreground';
  return <Flag className={cn('h-3 w-3', color)} />;
};

const RAIDItemForm: React.FC<{
  item?: RAIDItem;
  onSave: (item: Omit<RAIDItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  clients: any[];
  projects: any[];
}> = ({ item, onSave, onCancel, clients, projects }) => {
  const [formData, setFormData] = useState({
    type: item?.type || 'risk' as const,
    title: item?.title || '',
    description: item?.description || '',
    status: item?.status || 'open' as const,
    priority: item?.priority || 'medium' as const,
    impact: item?.impact || 'medium' as const,
    probability: item?.probability || 'medium' as const,
    owner: item?.owner || '',
    dueDate: item?.dueDate ? item.dueDate.split('T')[0] : '',
    clientId: item?.clientId || '',
    projectId: item?.projectId || '',
    tags: item?.tags || [],
  });
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
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
    <div className="p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">{item ? 'Edit RAID Item' : 'New RAID Item'}</h2>
        <button onClick={onCancel} className="p-2 hover:bg-muted rounded-md">
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="risk">Risk</option>
              <option value="assumption">Assumption</option>
              <option value="issue">Issue</option>
              <option value="dependency">Dependency</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="open">Open</option>
              <option value="monitoring">Monitoring</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
            placeholder="Enter title..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-md bg-background h-32"
            placeholder="Enter description..."
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Impact</label>
            <select
              value={formData.impact}
              onChange={(e) => setFormData({ ...formData, impact: e.target.value as any })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {formData.type === 'risk' && (
            <div>
              <label className="block text-sm font-medium mb-1">Probability</label>
              <select
                value={formData.probability}
                onChange={(e) => setFormData({ ...formData, probability: e.target.value as any })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Owner</label>
            <input
              type="text"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
              placeholder="Enter owner..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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

        <div className="flex space-x-2 pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            <Save className="h-4 w-4 mr-2 inline" />
            Save Item
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

const RAIDItemViewer: React.FC<{
  item: RAIDItem;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updates: Partial<RAIDItem>) => void;
  onDelete: () => void;
  onCancel: () => void;
  clients: any[];
  projects: any[];
}> = ({ item, isEditing, onEdit, onSave, onDelete, onCancel, clients, projects }) => {
  const client = clients.find(c => c.id === item.clientId);
  const project = projects.find(p => p.id === item.projectId);

  if (isEditing) {
    return (
      <RAIDItemForm
        item={item}
        onSave={onSave}
        onCancel={onCancel}
        clients={clients}
        projects={projects}
      />
    );
  }

  return (
    <div className="p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <TypeIcon type={item.type} />
            <h1 className="text-2xl font-bold">{item.title}</h1>
            <StatusIcon status={item.status} />
            <PriorityIcon priority={item.priority} />
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span className="px-2 py-1 bg-muted rounded text-xs capitalize">{item.type}</span>
            <span className="px-2 py-1 bg-muted rounded text-xs capitalize">{item.status}</span>
            <span>Owner: {item.owner}</span>
            {client && <span>{client.name}</span>}
            {project && <span>{project.title}</span>}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-muted-foreground">{item.description}</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="capitalize">{item.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="capitalize">{item.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Priority:</span>
                <span className="capitalize">{item.priority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Impact:</span>
                <span className="capitalize">{item.impact}</span>
              </div>
              {item.probability && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Probability:</span>
                  <span className="capitalize">{item.probability}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Owner:</span>
                <span>{item.owner}</span>
              </div>
              {item.dueDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due Date:</span>
                  <span>{new Date(item.dueDate).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated:</span>
                <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
              </div>
              {item.resolvedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Resolved:</span>
                  <span>{new Date(item.resolvedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {item.tags.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-1">
                {item.tags.map(tag => (
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

          {(client || project) && (
            <div>
              <h3 className="font-medium mb-2">Associated</h3>
              <div className="space-y-2">
                {client && (
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{client.name}</span>
                  </div>
                )}
                {project && (
                  <div className="flex items-center space-x-2">
                    <Folder className="h-4 w-4 text-muted-foreground" />
                    <span>{project.title}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RAID;

