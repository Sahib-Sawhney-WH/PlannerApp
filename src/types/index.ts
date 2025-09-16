// Core data types matching the database schema

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  isPrimary: boolean;
}

export interface Client {
  id: string;
  name: string;
  tags: string[];
  contacts: Contact[];
  links: string[];  // Add this line
  nextStep?: string;
  nextStepDue?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Opportunity {
  id: string;
  clientId?: string;
  name: string;
  stage: 'Discovery' | 'Scoping' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  amount?: number;
  probability?: number;
  nextStep?: string;
  nextStepDue?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  clientId?: string;
  kind: 'Active' | 'Planned';
  type?: string;
  status?: string;
  title: string;
  description?: string;
  tags: string[];
  nextStep?: string;
  nextStepDue?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  due?: string;
  status: 'Planned' | 'In Progress' | 'Done' | 'At Risk';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  projectId?: string;
  clientId?: string;
  title: string;
  description?: string;
  status: 'Inbox' | 'Todo' | 'Doing' | 'Blocked' | 'Done';
  due?: string;
  priority?: number;
  effort?: number;
  impact?: number;
  confidence?: number;
  rrule?: string;
  isNextStep: boolean;
  tags: string[];
  links: string[];
  createdAt: string;
  updatedAt: string;
  score?: number;
}

export interface Note {
  id: string;
  title: string;
  bodyMarkdownPath?: string;
  clientId?: string;
  projectId?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Stakeholder {
  id: string;
  clientId: string;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  timezone?: string;
  influence?: number; // 1-5
  preferredComms?: 'email' | 'phone' | 'teams' | 'other';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Risk {
  id: string;
  projectId?: string;
  clientId?: string;
  title: string;
  severity: 'Low' | 'Medium' | 'High';
  likelihood: 'Low' | 'Medium' | 'High';
  mitigation?: string;
  owner?: string;
  due?: string;
  status: 'Open' | 'Monitoring' | 'Closed';
  createdAt: string;
  updatedAt: string;
}

export interface Assumption {
  id: string;
  projectId?: string;
  clientId?: string;
  title: string;
  description?: string;
  validated: boolean;
  validationDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Issue {
  id: string;
  projectId?: string;
  clientId?: string;
  title: string;
  description?: string;
  severity: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  owner?: string;
  due?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Decision {
  id: string;
  projectId?: string;
  clientId?: string;
  title: string;
  decisionText: string;
  decidedOn?: string;
  owner?: string;
  impact?: string;
  links: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TimeEntry {
  id: string;
  date: string;
  hours: number;
  billable: boolean;
  clientId?: string;
  projectId?: string;
  taskId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  url?: string;
  description?: string;
  tags: string[];
  sourceType?: 'howto' | 'article' | 'docs' | 'github' | 'video' | 'other';
  createdAt: string;
  lastAccessedAt?: string;
  updatedAt: string;
}

export interface Settings {
  key: string;
  value: string;
  updatedAt: string;
}

// UI-specific types
export interface Theme {
  mode: 'dark' | 'light';
  accentColor: string;
  density: 'comfortable' | 'compact';
}

export interface ViewState {
  currentView: string;
  sidebarExpanded: boolean;
  drawerOpen: boolean;
  drawerContent?: any;
  selectedItems: string[];
}

export interface SearchResult {
  id: string;
  type: 'task' | 'note' | 'knowledge' | 'client' | 'project';
  title: string;
  description?: string;
  highlight?: string;
  relevance?: number;
}

export interface Dashboard {
  id: string;
  name: string;
  filters: Record<string, any>;
  layout: string;
}

// ICE Score calculation
export interface ICEScore {
  impact: number; // 1-5
  confidence: number; // 0.5-1.0
  effort: number; // 0.5-5
  score: number; // (impact * confidence) / effort
}

// Eisenhower Matrix
export interface EisenhowerQuadrant {
  urgent: boolean;
  important: boolean;
  quadrant: 'do' | 'schedule' | 'delegate' | 'eliminate';
}

// Keyboard shortcuts
export interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
  global?: boolean;
}