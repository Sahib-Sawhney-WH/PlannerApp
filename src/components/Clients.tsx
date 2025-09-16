import React, { useState } from 'react';
import { useAppStore } from '@/store/mock';
import { cn } from '@/lib/utils';
import { 
  Users, 
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
  Mail,
  Phone,
  Globe,
} from 'lucide-react';

const Clients: React.FC = () => {
  const { clients, projects, openDrawer } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);

  // Get unique tags from all clients
  const allTags = Array.from(new Set(clients.flatMap(client => client.tags || [])));
  
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !tagFilter || (client.tags && client.tags.includes(tagFilter));
    return matchesSearch && matchesTag;
  });

  const handleClientSelect = (client: any) => {
    setSelectedClient(client);
  };

  const handleNewClient = () => {
    openDrawer({ type: 'client-form' });
  };

  // Get client projects
  const getClientProjects = (clientId: string) => {
    return projects.filter(project => project.clientId === clientId);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-80 border-r border-border bg-muted/30 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <h1 className="text-lg font-semibold">Clients</h1>
            </div>
            <button
              onClick={handleNewClient}
              className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="p-2 bg-background rounded border">
              <div className="text-xs text-muted-foreground">Total</div>
              <div className="font-semibold">{clients.length}</div>
            </div>
            <div className="p-2 bg-background rounded border">
              <div className="text-xs text-muted-foreground">Active</div>
              <div className="font-semibold">{clients.filter(c => getClientProjects(c.id).length > 0).length}</div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background"
            />
          </div>

          {/* Tag Filter */}
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background mb-4"
          >
            <option value="">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        {/* Clients List */}
        <div className="flex-1 overflow-y-auto">
          {filteredClients.length > 0 ? (
            filteredClients.map(client => {
              const clientProjects = getClientProjects(client.id);
              return (
                <div
                  key={client.id}
                  onClick={() => handleClientSelect(client)}
                  className={cn(
                    'p-4 border-b border-border cursor-pointer hover:bg-muted/50',
                    selectedClient?.id === client.id && 'bg-muted'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium line-clamp-1">{client.name}</h3>
                    <span className="text-xs text-muted-foreground">
                      {clientProjects.length} project{clientProjects.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  {client.tags && client.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {client.tags.slice(0, 2).map((tag: string) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-1.5 py-0.5 bg-muted rounded text-xs"
                        >
                          <Tag className="h-2 w-2 mr-1" />
                          {tag}
                        </span>
                      ))}
                      {client.tags.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{client.tags.length - 2} more
                        </span>
                      )}
                    </div>
                  )}

                  {client.nextStep && (
                    <div className="text-xs text-muted-foreground">
                      Next: {client.nextStep}
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground mt-1">
                    Updated {new Date(client.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              {searchQuery || tagFilter ? 'No clients match your filters' : 'No clients yet'}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedClient ? (
          <ClientDetails client={selectedClient} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">No client selected</h2>
              <p className="text-muted-foreground mb-4">Select a client from the sidebar or create a new one</p>
              <button
                onClick={handleNewClient}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Create New Client
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Client Details Component
const ClientDetails: React.FC<{ client: any }> = ({ client }) => {
  const { projects, updateClient, deleteClient, closeDrawer } = useAppStore();
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

  const clientProjects = projects.filter(p => p.clientId === client.id);

  const handleSave = async () => {
    try {
      await updateClient(client.id, editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update client:', error);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this client? This will also affect related projects.')) {
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
            <label className="block text-sm font-medium mb-1">Client Name</label>
            <input
              type="text"
              value={editData.name || ''}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Next Step</label>
            <input
              type="text"
              value={editData.nextStep || ''}
              onChange={(e) => setEditData({ ...editData, nextStep: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
              placeholder="What's the next step with this client?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Next Step Due Date</label>
            <input
              type="date"
              value={editData.nextStepDue ? new Date(editData.nextStepDue).toISOString().split('T')[0] : ''}
              onChange={(e) => setEditData({ ...editData, nextStepDue: e.target.value ? new Date(e.target.value).toISOString() : null })}
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">{client.name}</h3>
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

        {/* Contact Information */}
        {client.contacts && client.contacts.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-3">Contact Information</h4>
            <div className="space-y-2">
              {client.contacts.map((contact: any, index: number) => (
                <div key={index} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{contact.name}</span>
                    {contact.role && (
                      <span className="text-sm text-muted-foreground">({contact.role})</span>
                    )}
                  </div>
                  {contact.email && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      <span>{contact.email}</span>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {client.tags && client.tags.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-3">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {client.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-muted rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Next Step */}
        {client.nextStep && (
          <div>
            <h4 className="text-lg font-semibold mb-3">Next Step</h4>
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="text-sm">{client.nextStep}</div>
              {client.nextStepDue && (
                <div className="text-xs text-muted-foreground mt-1 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  Due: {new Date(client.nextStepDue).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Projects */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Projects ({clientProjects.length})</h4>
          {clientProjects.length > 0 ? (
            <div className="space-y-2">
              {clientProjects.map(project => (
                <div key={project.id} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{project.title}</div>
                      <div className="text-sm text-muted-foreground">{project.description}</div>
                    </div>
                    <span className={cn(
                      'px-2 py-1 text-xs rounded-full',
                      getStatusColor(project.status)
                    )}>
                      {project.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              No projects for this client yet
            </div>
          )}
        </div>

        {/* Links */}
        {client.links && client.links.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-3">Links</h4>
            <div className="space-y-2">
              {client.links.map((link: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {link.title || link.url}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          Created: {new Date(client.createdAt).toLocaleDateString()}
          {client.updatedAt !== client.createdAt && (
            <span> • Updated: {new Date(client.updatedAt).toLocaleDateString()}</span>
          )}
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

export default Clients;

