import React, { useState } from 'react';
import { useAppStore } from '@/store/mock';
import { cn } from '@/lib/utils';
import { 
  Target, 
  Plus, 
  Search, 
  DollarSign, 
  User, 
  TrendingUp,
  Edit3,
  Trash2,
  Save,
  X,
  Phone,
  Mail,
} from 'lucide-react';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  clientId: string;
  value: number;
  stage: 'Lead' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  probability: number;
  expectedCloseDate: string;
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
  source: string;
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const Opportunities: React.FC = () => {
  const { clients } = useAppStore();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: '1',
      title: 'Enterprise Security Upgrade',
      description: 'Complete overhaul of security infrastructure including firewalls, access controls, and monitoring systems.',
      clientId: '1',
      value: 150000,
      stage: 'Proposal',
      probability: 75,
      expectedCloseDate: new Date('2024-02-15').toISOString(),
      contactName: 'John Smith',
      contactEmail: 'john@acme.com',
      contactPhone: '+1-555-0123',
      source: 'Referral',
      tags: ['security', 'enterprise'],
      notes: 'Very interested in our security solutions. Budget approved.',
      createdAt: new Date('2023-12-01').toISOString(),
      updatedAt: new Date('2024-01-05').toISOString(),
    },
    {
      id: '2',
      title: 'AI Analytics Platform',
      description: 'Development of custom AI-powered analytics platform for business intelligence.',
      clientId: '2',
      value: 85000,
      stage: 'Negotiation',
      probability: 60,
      expectedCloseDate: new Date('2024-01-30').toISOString(),
      contactName: 'Sarah Johnson',
      contactEmail: 'sarah@techstart.com',
      contactPhone: '+1-555-0456',
      source: 'Website',
      tags: ['ai', 'analytics', 'custom'],
      notes: 'Discussing timeline and pricing. Need to address integration concerns.',
      createdAt: new Date('2023-11-15').toISOString(),
      updatedAt: new Date('2024-01-03').toISOString(),
    },
    {
      id: '3',
      title: 'Cloud Migration Services',
      description: 'Migration of legacy systems to cloud infrastructure with ongoing support.',
      clientId: '1',
      value: 45000,
      stage: 'Qualified',
      probability: 40,
      expectedCloseDate: new Date('2024-03-01').toISOString(),
      contactName: 'Mike Wilson',
      contactEmail: 'mike@acme.com',
      source: 'Cold Outreach',
      tags: ['cloud', 'migration'],
      notes: 'Initial interest shown. Waiting for technical requirements.',
      createdAt: new Date('2024-01-01').toISOString(),
      updatedAt: new Date('2024-01-02').toISOString(),
    }
  ]);

  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('');

  const stages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
  
  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = !stageFilter || opp.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const totalValue = filteredOpportunities.reduce((sum, opp) => sum + opp.value, 0);
  const weightedValue = filteredOpportunities.reduce((sum, opp) => sum + (opp.value * opp.probability / 100), 0);

  const createOpportunity = (oppData: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOpportunity: Opportunity = {
      ...oppData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOpportunities([newOpportunity, ...opportunities]);
    setSelectedOpportunity(newOpportunity);
    setShowCreateForm(false);
  };

  const updateOpportunity = (id: string, updates: Partial<Opportunity>) => {
    setOpportunities(opportunities.map(opp => 
      opp.id === id 
        ? { ...opp, ...updates, updatedAt: new Date().toISOString() }
        : opp
    ));
    if (selectedOpportunity?.id === id) {
      setSelectedOpportunity({ ...selectedOpportunity, ...updates });
    }
  };

  const deleteOpportunity = (id: string) => {
    setOpportunities(opportunities.filter(opp => opp.id !== id));
    if (selectedOpportunity?.id === id) {
      setSelectedOpportunity(null);
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-80 border-r border-border bg-muted/30 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <h1 className="text-lg font-semibold">Opportunities</h1>
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
              <div className="text-xs text-muted-foreground">Total Value</div>
              <div className="font-semibold">${totalValue.toLocaleString()}</div>
            </div>
            <div className="p-2 bg-background rounded border">
              <div className="text-xs text-muted-foreground">Weighted</div>
              <div className="font-semibold">${Math.round(weightedValue).toLocaleString()}</div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background"
            />
          </div>

          {/* Stage Filter */}
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background mb-4"
          >
            <option value="">All Stages</option>
            {stages.map(stage => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>
        </div>

        {/* Opportunities List */}
        <div className="flex-1 overflow-y-auto">
          {filteredOpportunities.map(opportunity => {
            const client = clients.find(c => c.id === opportunity.clientId);
            return (
              <div
                key={opportunity.id}
                onClick={() => setSelectedOpportunity(opportunity)}
                className={cn(
                  'p-4 border-b border-border cursor-pointer hover:bg-muted/50',
                  selectedOpportunity?.id === opportunity.id && 'bg-muted'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium line-clamp-1">{opportunity.title}</h3>
                  <span className={cn(
                    'px-2 py-1 text-xs rounded-full',
                    getStageColor(opportunity.stage)
                  )}>
                    {opportunity.stage}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {opportunity.description}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-3 w-3" />
                    <span>${opportunity.value.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>{opportunity.probability}%</span>
                    <TrendingUp className="h-3 w-3" />
                  </div>
                </div>
                {client && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {client.name}
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
          <OpportunityForm
            onSave={createOpportunity}
            onCancel={() => setShowCreateForm(false)}
            clients={clients}
          />
        ) : selectedOpportunity ? (
          <OpportunityViewer
            opportunity={selectedOpportunity}
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            onSave={(updates) => {
              updateOpportunity(selectedOpportunity.id, updates);
              setIsEditing(false);
            }}
            onDelete={() => deleteOpportunity(selectedOpportunity.id)}
            onCancel={() => setIsEditing(false)}
            clients={clients}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">No opportunity selected</h2>
              <p className="text-muted-foreground mb-4">Select an opportunity from the sidebar or create a new one</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Create New Opportunity
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const OpportunityForm: React.FC<{
  opportunity?: Opportunity;
  onSave: (opportunity: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  clients: any[];
}> = ({ opportunity, onSave, onCancel, clients }) => {
  const [formData, setFormData] = useState({
    title: opportunity?.title || '',
    description: opportunity?.description || '',
    clientId: opportunity?.clientId || '',
    value: opportunity?.value || 0,
    stage: opportunity?.stage || 'Lead' as const,
    probability: opportunity?.probability || 25,
    expectedCloseDate: opportunity?.expectedCloseDate ? opportunity.expectedCloseDate.split('T')[0] : '',
    contactName: opportunity?.contactName || '',
    contactEmail: opportunity?.contactEmail || '',
    contactPhone: opportunity?.contactPhone || '',
    source: opportunity?.source || '',
    tags: opportunity?.tags || [],
    notes: opportunity?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      expectedCloseDate: formData.expectedCloseDate ? new Date(formData.expectedCloseDate).toISOString() : new Date().toISOString(),
    });
  };

  return (
    <div className="p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">{opportunity ? 'Edit Opportunity' : 'New Opportunity'}</h2>
        <button onClick={onCancel} className="p-2 hover:bg-muted rounded-md">
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
              placeholder="Enter opportunity title..."
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background h-20"
              placeholder="Describe the opportunity..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Client</label>
            <select
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
              required
            >
              <option value="">Select client...</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Value ($)</label>
            <input
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
              placeholder="0"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Stage</label>
            <select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value as any })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="Lead">Lead</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal">Proposal</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed Won">Closed Won</option>
              <option value="Closed Lost">Closed Lost</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Probability (%)</label>
            <input
              type="number"
              value={formData.probability}
              onChange={(e) => setFormData({ ...formData, probability: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
              min="0"
              max="100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Expected Close Date</label>
            <input
              type="date"
              value={formData.expectedCloseDate}
              onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Source</label>
            <select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="">Select source...</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Cold Outreach">Cold Outreach</option>
              <option value="Social Media">Social Media</option>
              <option value="Event">Event</option>
              <option value="Partner">Partner</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contact Name</label>
            <input
              type="text"
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
              placeholder="Primary contact name..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contact Email</label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
              placeholder="contact@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contact Phone</label>
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
              placeholder="+1-555-0123"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background h-20"
              placeholder="Additional notes about this opportunity..."
            />
          </div>
        </div>

        <div className="flex space-x-2 pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            <Save className="h-4 w-4 mr-2 inline" />
            Save Opportunity
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

const OpportunityViewer: React.FC<{
  opportunity: Opportunity;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updates: Partial<Opportunity>) => void;
  onDelete: () => void;
  onCancel: () => void;
  clients: any[];
}> = ({ opportunity, isEditing, onEdit, onSave, onDelete, onCancel, clients }) => {
  const client = clients.find(c => c.id === opportunity.clientId);

  if (isEditing) {
    return (
      <OpportunityForm
        opportunity={opportunity}
        onSave={onSave}
        onCancel={onCancel}
        clients={clients}
      />
    );
  }

  return (
    <div className="p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">{opportunity.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStageColor(opportunity.stage))}>
              {opportunity.stage}
            </span>
            <span>${opportunity.value.toLocaleString()}</span>
            <span>{opportunity.probability}% probability</span>
            {client && <span>{client.name}</span>}
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
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-muted-foreground">{opportunity.description}</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{opportunity.contactName}</span>
              </div>
              {opportunity.contactEmail && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${opportunity.contactEmail}`} className="text-primary hover:underline">
                    {opportunity.contactEmail}
                  </a>
                </div>
              )}
              {opportunity.contactPhone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${opportunity.contactPhone}`} className="text-primary hover:underline">
                    {opportunity.contactPhone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {opportunity.notes && (
            <div>
              <h3 className="font-medium mb-2">Notes</h3>
              <div className="p-3 bg-muted/50 rounded-md">
                <p className="text-sm whitespace-pre-wrap">{opportunity.notes}</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expected Close:</span>
                <span>{new Date(opportunity.expectedCloseDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Source:</span>
                <span>{opportunity.source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>{new Date(opportunity.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated:</span>
                <span>{new Date(opportunity.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Weighted Value</h3>
            <div className="p-4 bg-primary/10 rounded-md">
              <div className="text-2xl font-bold text-primary">
                ${Math.round(opportunity.value * opportunity.probability / 100).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                ${opportunity.value.toLocaleString()} × {opportunity.probability}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function getStageColor(stage: string): string {
  const colors: Record<string, string> = {
    'Lead': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    'Qualified': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Proposal': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Negotiation': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'Closed Won': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Closed Lost': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };
  return colors[stage] || colors['Lead'];
}

export default Opportunities;

