import React, { useState } from 'react';
import { useAppStore } from '@/store/mock';
import { cn } from '@/lib/utils';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Save,
  X,
  FileText,
  Hash,
  Link,
  ExternalLink,
  Folder,
  Star,
  Eye,
  Building
} from 'lucide-react';

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  type: 'document' | 'link' | 'note' | 'resource';
  category: string;
  tags: string[];
  url?: string;
  filePath?: string;
  clientId?: string;
  projectId?: string;
  isFavorite: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

const Knowledge: React.FC = () => {
  const { clients, projects } = useAppStore();
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([
    {
      id: '1',
      title: 'Security Best Practices Guide',
      content: 'Comprehensive guide covering enterprise security implementation, including firewall configuration, access controls, and monitoring protocols. This document outlines the standard procedures for security audits and compliance requirements.',
      type: 'document',
      category: 'Security',
      tags: ['security', 'best-practices', 'enterprise'],
      clientId: '1',
      projectId: '1',
      isFavorite: true,
      views: 45,
      createdAt: new Date('2023-12-01').toISOString(),
      updatedAt: new Date('2024-01-05').toISOString(),
    },
    {
      id: '2',
      title: 'AI/ML Framework Comparison',
      content: 'Detailed comparison of TensorFlow vs PyTorch for machine learning projects. Includes performance benchmarks, ease of use, community support, and deployment considerations.',
      type: 'document',
      category: 'Development',
      tags: ['ai', 'ml', 'tensorflow', 'pytorch'],
      clientId: '2',
      projectId: '2',
      isFavorite: false,
      views: 23,
      createdAt: new Date('2023-11-20').toISOString(),
      updatedAt: new Date('2024-01-03').toISOString(),
    },
    {
      id: '3',
      title: 'Cloud Architecture Patterns',
      content: 'Collection of proven cloud architecture patterns for scalable applications. Covers microservices, serverless, and hybrid cloud approaches.',
      type: 'resource',
      category: 'Architecture',
      tags: ['cloud', 'architecture', 'patterns'],
      url: 'https://docs.aws.amazon.com/architecture/',
      isFavorite: true,
      views: 67,
      createdAt: new Date('2023-10-15').toISOString(),
      updatedAt: new Date('2023-12-20').toISOString(),
    },
    {
      id: '4',
      title: 'Project Management Templates',
      content: 'Ready-to-use templates for project planning, risk assessment, and stakeholder communication. Includes Gantt chart templates and status report formats.',
      type: 'resource',
      category: 'Management',
      tags: ['templates', 'project-management', 'planning'],
      isFavorite: false,
      views: 34,
      createdAt: new Date('2023-09-10').toISOString(),
      updatedAt: new Date('2023-11-15').toISOString(),
    }
  ]);

  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const categories = Array.from(new Set(knowledgeItems.map(item => item.category)));
  const types = ['document', 'link', 'note', 'resource'];

  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    const matchesType = !typeFilter || item.type === typeFilter;
    const matchesFavorites = !showFavoritesOnly || item.isFavorite;
    return matchesSearch && matchesCategory && matchesType && matchesFavorites;
  });

  const createKnowledgeItem = (itemData: Omit<KnowledgeItem, 'id' | 'views' | 'createdAt' | 'updatedAt'>) => {
    const newItem: KnowledgeItem = {
      ...itemData,
      id: Date.now().toString(),
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setKnowledgeItems([newItem, ...knowledgeItems]);
    setSelectedItem(newItem);
    setShowCreateForm(false);
  };

  const updateKnowledgeItem = (id: string, updates: Partial<KnowledgeItem>) => {
    setKnowledgeItems(items => items.map(item => 
      item.id === id 
        ? { ...item, ...updates, updatedAt: new Date().toISOString() }
        : item
    ));
    if (selectedItem?.id === id) {
      setSelectedItem({ ...selectedItem, ...updates });
    }
  };

  const deleteKnowledgeItem = (id: string) => {
    setKnowledgeItems(items => items.filter(item => item.id !== id));
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  const toggleFavorite = (id: string) => {
    updateKnowledgeItem(id, { 
      isFavorite: !knowledgeItems.find(item => item.id === id)?.isFavorite 
    });
  };

  const incrementViews = (id: string) => {
    const item = knowledgeItems.find(item => item.id === id);
    if (item) {
      updateKnowledgeItem(id, { views: item.views + 1 });
    }
  };

  const handleItemSelect = (item: KnowledgeItem) => {
    setSelectedItem(item);
    incrementViews(item.id);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-80 border-r border-border bg-muted/30 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <h1 className="text-lg font-semibold">Knowledge</h1>
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
              <div className="text-xs text-muted-foreground">Total Items</div>
              <div className="font-semibold">{filteredItems.length}</div>
            </div>
            <div className="p-2 bg-background rounded border">
              <div className="text-xs text-muted-foreground">Favorites</div>
              <div className="font-semibold">{knowledgeItems.filter(item => item.isFavorite).length}</div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search knowledge..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background"
            />
          </div>

          {/* Filters */}
          <div className="space-y-2 mb-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="favorites"
                checked={showFavoritesOnly}
                onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                className="rounded border-border"
              />
              <label htmlFor="favorites" className="text-sm font-medium">Favorites only</label>
            </div>
          </div>
        </div>

        {/* Knowledge Items List */}
        <div className="flex-1 overflow-y-auto">
          {filteredItems.map(item => {
            const client = clients.find(c => c.id === item.clientId);
            const project = projects.find(p => p.id === item.projectId);

            return (
              <div
                key={item.id}
                onClick={() => handleItemSelect(item)}
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
                    {item.isFavorite && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                    <span className="text-xs text-muted-foreground">{item.views}</span>
                    <Eye className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {item.content}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 bg-muted rounded text-xs">
                      {item.category}
                    </span>
                    <span className="px-1.5 py-0.5 bg-muted rounded text-xs">
                      {item.type}
                    </span>
                  </div>
                  <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
                </div>
                
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
          <KnowledgeItemForm
            onSave={createKnowledgeItem}
            onCancel={() => setShowCreateForm(false)}
            clients={clients}
            projects={projects}
            categories={categories}
          />
        ) : selectedItem ? (
          <KnowledgeItemViewer
            item={selectedItem}
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            onSave={(updates) => {
              updateKnowledgeItem(selectedItem.id, updates);
              setIsEditing(false);
            }}
            onDelete={() => deleteKnowledgeItem(selectedItem.id)}
            onCancel={() => setIsEditing(false)}
            onToggleFavorite={() => toggleFavorite(selectedItem.id)}
            clients={clients}
            projects={projects}
            categories={categories}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">No item selected</h2>
              <p className="text-muted-foreground mb-4">Select a knowledge item from the sidebar or create a new one</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Create Knowledge Item
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
    document: FileText,
    link: Link,
    note: Hash,
    resource: Folder,
  };
  const Icon = icons[type as keyof typeof icons] || FileText;
  return <Icon className="h-4 w-4 text-muted-foreground" />;
};

const KnowledgeItemForm: React.FC<{
  item?: KnowledgeItem;
  onSave: (item: Omit<KnowledgeItem, 'id' | 'views' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  clients: any[];
  projects: any[];
  categories: string[];
}> = ({ item, onSave, onCancel, clients, projects, categories }) => {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    content: item?.content || '',
    type: item?.type || 'document' as const,
    category: item?.category || '',
    tags: item?.tags || [],
    url: item?.url || '',
    filePath: item?.filePath || '',
    clientId: item?.clientId || '',
    projectId: item?.projectId || '',
    isFavorite: item?.isFavorite || false,
  });
  const [tagInput, setTagInput] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const category = newCategory.trim() || formData.category;
    onSave({ ...formData, category });
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
        <h2 className="text-xl font-semibold">{item ? 'Edit Knowledge Item' : 'New Knowledge Item'}</h2>
        <button onClick={onCancel} className="p-2 hover:bg-muted rounded-md">
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
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
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-md bg-background h-32"
            placeholder="Enter content or description..."
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="document">Document</option>
              <option value="link">Link</option>
              <option value="note">Note</option>
              <option value="resource">Resource</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <div className="flex space-x-2">
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="flex-1 px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="">Select category...</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category"
                className="flex-1 px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
          </div>
        </div>

        {(formData.type === 'link' || formData.type === 'resource') && (
          <div>
            <label className="block text-sm font-medium mb-1">URL</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
              placeholder="https://example.com"
            />
          </div>
        )}

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

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isFavorite"
            checked={formData.isFavorite}
            onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
            className="rounded border-border"
          />
          <label htmlFor="isFavorite" className="text-sm font-medium">Mark as favorite</label>
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

const KnowledgeItemViewer: React.FC<{
  item: KnowledgeItem;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updates: Partial<KnowledgeItem>) => void;
  onDelete: () => void;
  onCancel: () => void;
  onToggleFavorite: () => void;
  clients: any[];
  projects: any[];
  categories: string[];
}> = ({ item, isEditing, onEdit, onSave, onDelete, onCancel, onToggleFavorite, clients, projects, categories }) => {
  const client = clients.find(c => c.id === item.clientId);
  const project = projects.find(p => p.id === item.projectId);

  if (isEditing) {
    return (
      <KnowledgeItemForm
        item={item}
        onSave={onSave}
        onCancel={onCancel}
        clients={clients}
        projects={projects}
        categories={categories}
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
            <button
              onClick={onToggleFavorite}
              className={cn(
                'p-1 rounded',
                item.isFavorite 
                  ? 'text-yellow-500 hover:text-yellow-600' 
                  : 'text-muted-foreground hover:text-yellow-500'
              )}
            >
              <Star className={cn('h-5 w-5', item.isFavorite && 'fill-current')} />
            </button>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span className="px-2 py-1 bg-muted rounded text-xs">{item.category}</span>
            <span className="px-2 py-1 bg-muted rounded text-xs">{item.type}</span>
            <span>{item.views} views</span>
            {client && <span>{client.name}</span>}
            {project && <span>{project.title}</span>}
          </div>
        </div>
        <div className="flex space-x-2">
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-muted rounded-md"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
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
            <h3 className="font-medium mb-2">Content</h3>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-muted-foreground">{item.content}</div>
            </div>
          </div>

          {item.url && (
            <div>
              <h3 className="font-medium mb-2">Link</h3>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center space-x-1"
              >
                <span>{item.url}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
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
                <span className="text-muted-foreground">Category:</span>
                <span>{item.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Views:</span>
                <span>{item.views}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated:</span>
                <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
              </div>
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
                    <Hash className="h-3 w-3 mr-1" />
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

export default Knowledge;