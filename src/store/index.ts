import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { invoke } from '@tauri-apps/api/tauri';
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

// Main application store
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
  
  // Actions
  initializeApp: () => Promise<void>;
  
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
  calculateICEScore: (impact: number, confidence: number, effort: number) => number;
  
  // Search actions
  search: (query: string) => Promise<void>;
  clearSearch: () => void;
  
  // UI actions
  setTheme: (theme: Partial<Theme>) => void;
  setViewState: (viewState: Partial<ViewState>) => void;
  toggleSidebar: () => void;
  openDrawer: (content: any) => void;
  closeDrawer: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppStore>()(
  devtools(
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
        accentColor: '#4DA3FF',
        density: 'comfortable',
      },
      
      viewState: {
        currentView: 'dashboard',
        sidebarExpanded: true,
        drawerOpen: false,
        drawerContent: null,
        selectedItems: [],
      },
      
      searchResults: [],
      loading: false,
      error: null,
      
      // Initialize the application
      initializeApp: async () => {
        try {
          set({ loading: true, error: null });
          
          // Initialize database
          await invoke('init_database');
          
          // Load initial data
          await Promise.all([
            get().loadClients(),
            get().loadProjects(),
            get().loadTasks(),
          ]);
          
          set({ loading: false });
        } catch (error) {
          console.error('Failed to initialize app:', error);
          set({ error: error as string, loading: false });
        }
      },
      
      // Client actions
      loadClients: async () => {
        try {
          const clients = await invoke<Client[]>('get_clients');
          set({ clients });
        } catch (error) {
          console.error('Failed to load clients:', error);
          set({ error: error as string });
        }
      },
      
      createClient: async (clientData) => {
        try {
          const client = await invoke<Client>('create_client', { client: clientData });
          set((state) => ({ clients: [...state.clients, client] }));
        } catch (error) {
          console.error('Failed to create client:', error);
          set({ error: error as string });
        }
      },
      
      updateClient: async (id, updates) => {
        try {
          const client = await invoke<Client>('update_client', { id, updates });
          set((state) => ({
            clients: state.clients.map((c) => (c.id === id ? client : c)),
          }));
        } catch (error) {
          console.error('Failed to update client:', error);
          set({ error: error as string });
        }
      },
      
      deleteClient: async (id) => {
        try {
          await invoke('delete_client', { id });
          set((state) => ({
            clients: state.clients.filter((c) => c.id !== id),
          }));
        } catch (error) {
          console.error('Failed to delete client:', error);
          set({ error: error as string });
        }
      },
      
      // Project actions
      loadProjects: async () => {
        try {
          const projects = await invoke<Project[]>('get_projects');
          set({ projects });
        } catch (error) {
          console.error('Failed to load projects:', error);
          set({ error: error as string });
        }
      },
      
      createProject: async (projectData) => {
        try {
          const project = await invoke<Project>('create_project', { project: projectData });
          set((state) => ({ projects: [...state.projects, project] }));
        } catch (error) {
          console.error('Failed to create project:', error);
          set({ error: error as string });
        }
      },
      
      updateProject: async (id, updates) => {
        try {
          const project = await invoke<Project>('update_project', { id, updates });
          set((state) => ({
            projects: state.projects.map((p) => (p.id === id ? project : p)),
          }));
        } catch (error) {
          console.error('Failed to update project:', error);
          set({ error: error as string });
        }
      },
      
      deleteProject: async (id) => {
        try {
          await invoke('delete_project', { id });
          set((state) => ({
            projects: state.projects.filter((p) => p.id !== id),
          }));
        } catch (error) {
          console.error('Failed to delete project:', error);
          set({ error: error as string });
        }
      },
      
      // Task actions
      loadTasks: async () => {
        try {
          const tasks = await invoke<Task[]>('get_tasks');
          set({ tasks });
        } catch (error) {
          console.error('Failed to load tasks:', error);
          set({ error: error as string });
        }
      },
      
      createTask: async (taskData) => {
        try {
          const task = await invoke<Task>('create_task', { task: taskData });
          set((state) => ({ tasks: [...state.tasks, task] }));
        } catch (error) {
          console.error('Failed to create task:', error);
          set({ error: error as string });
        }
      },
      
      updateTask: async (id, updates) => {
        try {
          const task = await invoke<Task>('update_task', { id, updates });
          set((state) => ({
            tasks: state.tasks.map((t) => (t.id === id ? task : t)),
          }));
        } catch (error) {
          console.error('Failed to update task:', error);
          set({ error: error as string });
        }
      },
      
      deleteTask: async (id) => {
        try {
          await invoke('delete_task', { id });
          set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== id),
          }));
        } catch (error) {
          console.error('Failed to delete task:', error);
          set({ error: error as string });
        }
      },
      
      calculateICEScore: (impact, confidence, effort) => {
        return (impact * confidence) / effort;
      },
      
      // Search actions
      search: async (query) => {
        try {
          const results = await invoke<SearchResult[]>('search', { query });
          set({ searchResults: results });
        } catch (error) {
          console.error('Failed to search:', error);
          set({ error: error as string });
        }
      },
      
      clearSearch: () => {
        set({ searchResults: [] });
      },
      
      // UI actions
      setTheme: (themeUpdates) => {
        set((state) => ({
          theme: { ...state.theme, ...themeUpdates },
        }));
      },
      
      setViewState: (viewStateUpdates) => {
        set((state) => ({
          viewState: { ...state.viewState, ...viewStateUpdates },
        }));
      },
      
      toggleSidebar: () => {
        set((state) => ({
          viewState: {
            ...state.viewState,
            sidebarExpanded: !state.viewState.sidebarExpanded,
          },
        }));
      },
      
      openDrawer: (content) => {
        set((state) => ({
          viewState: {
            ...state.viewState,
            drawerOpen: true,
            drawerContent: content,
          },
        }));
      },
      
      closeDrawer: () => {
        set((state) => ({
          viewState: {
            ...state.viewState,
            drawerOpen: false,
            drawerContent: null,
          },
        }));
      },
      
      setError: (error) => {
        set({ error });
      },
      
      setLoading: (loading) => {
        set({ loading });
      },
    }),
    {
      name: 'desktop-planner-store',
    }
  )
);

