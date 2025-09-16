import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Client,
  Project,
  Task,
  Note,
  Opportunity,
  Stakeholder,
  TimeEntry,
  KnowledgeItem,
  Theme,
  ViewState,
  SearchResult,
} from '@/types';

// Mock data - only used for initial setup if no data exists
const mockClients: Client[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    tags: ['Enterprise', 'Technology'],
    contacts: [
      {
        id: '1',
        name: 'John Smith',
        email: 'john@acme.com',
        phone: '+1-555-0123',
        role: 'CTO',
        isPrimary: true,
      }
    ],
    links: [],
    nextStep: 'Schedule quarterly review meeting',
    nextStepDue: new Date('2024-01-15').toISOString(),
    createdAt: new Date('2023-12-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: '2',
    name: 'TechStart Inc',
    tags: ['Startup', 'SaaS'],
    contacts: [
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@techstart.com',
        phone: '+1-555-0456',
        role: 'CEO',
        isPrimary: true,
      }
    ],
    links: [],
    nextStep: 'Follow up on proposal',
    nextStepDue: new Date('2024-01-10').toISOString(),
    createdAt: new Date('2023-11-15').toISOString(),
    updatedAt: new Date('2023-12-20').toISOString(),
  }
];

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Security Infrastructure Upgrade',
    description: 'Comprehensive security overhaul for enterprise network',
    clientId: '1',
    kind: 'Active',
    status: 'In Progress',
    tags: ['Security', 'Infrastructure', 'Enterprise'],
    nextStep: 'Complete firewall configuration',
    nextStepDue: new Date('2024-01-12').toISOString(),
    createdAt: new Date('2023-11-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: '2',
    title: 'AI-Powered Analytics Demo',
    description: 'Prototype machine learning analytics platform',
    clientId: '2',
    kind: 'Active',
    status: 'Planning',
    tags: ['AI', 'Analytics', 'Demo', 'Machine Learning'],
    nextStep: 'Prepare demo environment',
    nextStepDue: new Date('2024-01-08').toISOString(),
    createdAt: new Date('2023-12-15').toISOString(),
    updatedAt: new Date('2023-12-28').toISOString(),
  }
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Configure firewall rules',
    description: 'Set up network security policies for the new infrastructure',
    status: 'Doing',
    priority: 4,
    due: new Date('2024-01-12').toISOString(),
    clientId: '1',
    projectId: '1',
    isNextStep: true,
    tags: ['Security', 'Infrastructure'],
    links: [],
    score: 8.5,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-02').toISOString(),
  },
  {
    id: '2',
    title: 'Prepare client presentation',
    description: 'Create slides for the quarterly business review',
    status: 'Todo',
    priority: 3,
    due: new Date('2024-01-15').toISOString(),
    clientId: '1',
    isNextStep: false,
    tags: ['Presentation', 'Business'],
    links: [],
    score: 7.2,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: '3',
    title: 'Research ML frameworks',
    description: 'Evaluate TensorFlow vs PyTorch for the analytics platform',
    status: 'Inbox',
    priority: 2,
    clientId: '2',
    projectId: '2',
    isNextStep: false,
    tags: ['Research', 'AI'],
    links: [],
    score: 6.8,
    createdAt: new Date('2023-12-28').toISOString(),
    updatedAt: new Date('2023-12-28').toISOString(),
  }
];

const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    name: 'Enterprise Security Consulting',
    clientId: '1',
    amount: 150000,
    stage: 'Proposal',
    probability: 75,
    createdAt: new Date('2023-12-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  }
];

// Main application store interface
interface AppStore {
  // Data
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  notes: Note[];
  opportunities: Opportunity[];
  stakeholders: Stakeholder[];
  timeEntries: TimeEntry[];
  knowledgeItems: KnowledgeItem[];
  
  // UI State
  theme: Theme;
  viewState: ViewState;
  searchResults: SearchResult[];
  loading: boolean;
  error: string | null;
  
  // Drawer state
  drawerOpen: boolean;
  drawerContent: { type: string; data?: any } | null;
  
  // Actions
  initializeApp: () => Promise<void>;
  openDrawer: (content: string | { type: string; data?: any }) => void;
  closeDrawer: () => void;
  
  // Client actions
  loadClients: () => Promise<void>;
  createClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateClient: (id: string, updates: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  
  // Project actions
  loadProjects: () => Promise<void>;
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  
  // Task actions
  loadTasks: () => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  
  // Note actions
  loadNotes: () => Promise<void>;
  createNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  
  // Theme actions
  setTheme: (theme: Partial<Theme>) => void;
  toggleTheme: () => void;
  
  // Search actions
  search: (query: string) => Promise<void>;
  clearSearch: () => void;
  
  // Data management
  exportData: () => void;
  importData: (data: any) => void;
  resetData: () => void;
}

// Helper function to generate unique IDs
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      clients: [],
      projects: [],
      tasks: [],
      notes: [],
      opportunities: [],
      stakeholders: [],
      timeEntries: [],
      knowledgeItems: [],
      
      theme: {
        mode: 'dark',
        accentColor: '#3b82f6',
        density: 'comfortable',
      },
      viewState: {
        currentView: 'dashboard',
        sidebarExpanded: true,
        drawerOpen: false,
        selectedItems: [],
      },
      
      searchResults: [],
      loading: false,
      error: null,
      
      drawerOpen: false,
      drawerContent: null,
      
      // Actions
      initializeApp: async () => {
        set({ loading: true, error: null });
        
        try {
          // Simulate loading delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const state = get();
          
          // If no data exists (first run), load mock data
          if (state.clients.length === 0 && state.projects.length === 0 && state.tasks.length === 0) {
            set({
              clients: mockClients,
              projects: mockProjects,
              tasks: mockTasks,
              opportunities: mockOpportunities,
            });
          }
          
          set({ loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to initialize app',
            loading: false 
          });
        }
      },
      
      openDrawer: (content) => {
        const drawerContent = typeof content === 'string' 
          ? { type: content } 
          : content;
        set({ drawerOpen: true, drawerContent });
      },
      
      closeDrawer: () => {
        set({ drawerOpen: false, drawerContent: null });
      },
      
      // Client actions
      loadClients: async () => {
        // Data is already loaded from localStorage via persist middleware
      },
      
      createClient: async (clientData) => {
        const newClient: Client = {
          ...clientData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set(state => ({
          clients: [...state.clients, newClient]
        }));
      },
      
      updateClient: async (id, updates) => {
        set(state => ({
          clients: state.clients.map(client =>
            client.id === id
              ? { ...client, ...updates, updatedAt: new Date().toISOString() }
              : client
          )
        }));
      },
      
      deleteClient: async (id) => {
        set(state => ({
          clients: state.clients.filter(client => client.id !== id)
        }));
      },
      
      // Project actions
      loadProjects: async () => {
        // Data is already loaded from localStorage via persist middleware
      },
      
      createProject: async (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set(state => ({
          projects: [...state.projects, newProject]
        }));
      },
      
      updateProject: async (id, updates) => {
        set(state => ({
          projects: state.projects.map(project =>
            project.id === id
              ? { ...project, ...updates, updatedAt: new Date().toISOString() }
              : project
          )
        }));
      },
      
      deleteProject: async (id) => {
        set(state => ({
          projects: state.projects.filter(project => project.id !== id)
        }));
      },
      
      // Task actions
      loadTasks: async () => {
        // Data is already loaded from localStorage via persist middleware
      },
      
      createTask: async (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set(state => ({
          tasks: [...state.tasks, newTask]
        }));
      },
      
      updateTask: async (id, updates) => {
        set(state => ({
          tasks: state.tasks.map(task =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date().toISOString() }
              : task
          )
        }));
      },
      
      deleteTask: async (id) => {
        set(state => ({
          tasks: state.tasks.filter(task => task.id !== id)
        }));
      },
      
      // Note actions
      loadNotes: async () => {
        // Data is already loaded from localStorage via persist middleware
      },
      
      createNote: async (noteData) => {
        const newNote: Note = {
          ...noteData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set(state => ({
          notes: [...state.notes, newNote]
        }));
      },
      
      updateNote: async (id, updates) => {
        set(state => ({
          notes: state.notes.map(note =>
            note.id === id
              ? { ...note, ...updates, updatedAt: new Date().toISOString() }
              : note
          )
        }));
      },
      
      deleteNote: async (id) => {
        set(state => ({
          notes: state.notes.filter(note => note.id !== id)
        }));
      },
      
      // Theme actions
      setTheme: (themeUpdates) => {
        set(state => ({
          theme: { ...state.theme, ...themeUpdates }
        }));
        
        // Apply theme to document
        const theme = { ...get().theme, ...themeUpdates };
        document.documentElement.setAttribute('data-theme', theme.mode);
      },
      
      toggleTheme: () => {
        const currentMode = get().theme.mode;
        const newMode = currentMode === 'light' ? 'dark' : 'light';
        
        set(state => ({
          theme: {
            ...state.theme,
            mode: newMode
          }
        }));
        
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', newMode);
      },
      
      // Search actions
      search: async (query) => {
        if (!query.trim()) {
          set({ searchResults: [] });
          return;
        }
        
        const state = get();
        const results: SearchResult[] = [];
        const lowerQuery = query.toLowerCase();
        
        // Search tasks
        state.tasks.forEach(task => {
          if (task.title.toLowerCase().includes(lowerQuery) ||
              task.description?.toLowerCase().includes(lowerQuery) ||
              task.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) {
            results.push({
              id: task.id,
              type: 'task',
              title: task.title,
              description: task.description,
              relevance: 0.8,
            });
          }
        });
        
        // Search projects
        state.projects.forEach(project => {
          if (project.title.toLowerCase().includes(lowerQuery) ||
              project.description?.toLowerCase().includes(lowerQuery) ||
              project.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) {
            results.push({
              id: project.id,
              type: 'project',
              title: project.title,
              description: project.description,
              relevance: 0.7,
            });
          }
        });
        
        // Search clients
        state.clients.forEach(client => {
          if (client.name.toLowerCase().includes(lowerQuery) ||
              client.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) {
            results.push({
              id: client.id,
              type: 'client',
              title: client.name,
              description: client.nextStep,
              relevance: 0.6,
            });
          }
        });
        
        // Search notes
        state.notes.forEach(note => {
          if (note.title.toLowerCase().includes(lowerQuery) ||
              note.content?.toLowerCase().includes(lowerQuery) ||
              note.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))) {
            results.push({
              id: note.id,
              type: 'note',
              title: note.title,
              description: note.content?.substring(0, 100),
              relevance: 0.5,
            });
          }
        });
        
        // Sort by relevance
        results.sort((a, b) => b.relevance - a.relevance);
        
        set({ searchResults: results });
      },
      
      clearSearch: () => {
        set({ searchResults: [] });
      },
      
      // Data management
      exportData: () => {
        const state = get();
        const data = {
          clients: state.clients,
          projects: state.projects,
          tasks: state.tasks,
          notes: state.notes,
          opportunities: state.opportunities,
          stakeholders: state.stakeholders,
          timeEntries: state.timeEntries,
          knowledgeItems: state.knowledgeItems,
          theme: state.theme,
          exportedAt: new Date().toISOString(),
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `desktop-planner-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
      
      importData: (data) => {
        try {
          set({
            clients: data.clients || [],
            projects: data.projects || [],
            tasks: data.tasks || [],
            notes: data.notes || [],
            opportunities: data.opportunities || [],
            stakeholders: data.stakeholders || [],
            timeEntries: data.timeEntries || [],
            knowledgeItems: data.knowledgeItems || [],
            theme: data.theme || get().theme,
          });
        } catch (error) {
          set({ error: 'Failed to import data. Please check the file format.' });
        }
      },
      
      resetData: () => {
        set({
          clients: [],
          projects: [],
          tasks: [],
          notes: [],
          opportunities: [],
          stakeholders: [],
          timeEntries: [],
          knowledgeItems: [],
          searchResults: [],
        });
      },
    }),
    {
      name: 'desktop-planner-storage',
      // Only persist data, not UI state
      partialize: (state) => ({
        clients: state.clients,
        projects: state.projects,
        tasks: state.tasks,
        notes: state.notes,
        opportunities: state.opportunities,
        stakeholders: state.stakeholders,
        timeEntries: state.timeEntries,
        knowledgeItems: state.knowledgeItems,
        theme: state.theme,
      }),
    }
  )
);

