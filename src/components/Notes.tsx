import React, { useState } from 'react';
import { useAppStore } from '@/store/mock';
import { cn } from '@/lib/utils';
import { 
  StickyNote, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Save,
  X,
  FileText,
  Hash
} from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  clientId?: string;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}

const Notes: React.FC = () => {
  const { clients, projects } = useAppStore();
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Meeting Notes - Security Review',
      content: 'Discussed the current security infrastructure and identified key areas for improvement. Need to focus on firewall configuration and access controls.',
      tags: ['meeting', 'security'],
      clientId: '1',
      projectId: '1',
      createdAt: new Date('2024-01-02').toISOString(),
      updatedAt: new Date('2024-01-02').toISOString(),
    },
    {
      id: '2',
      title: 'Research Notes - ML Frameworks',
      content: 'Comparing TensorFlow vs PyTorch for the analytics platform. TensorFlow has better production support, but PyTorch is more intuitive for research.',
      tags: ['research', 'ai', 'ml'],
      clientId: '2',
      projectId: '2',
      createdAt: new Date('2024-01-01').toISOString(),
      updatedAt: new Date('2024-01-01').toISOString(),
    },
    {
      id: '3',
      title: 'Ideas for Q2 Planning',
      content: 'Brainstorming session ideas:\n- Expand client base in healthcare sector\n- Develop new AI-powered features\n- Improve onboarding process',
      tags: ['planning', 'ideas'],
      createdAt: new Date('2023-12-30').toISOString(),
      updatedAt: new Date('2023-12-30').toISOString(),
    }
  ]);

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || note.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

  const createNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setShowCreateForm(false);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date().toISOString() }
        : note
    ));
    if (selectedNote?.id === id) {
      setSelectedNote({ ...selectedNote, ...updates });
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-80 border-r border-border bg-muted/30 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <StickyNote className="h-5 w-5" />
              <h1 className="text-lg font-semibold">Notes</h1>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background"
            />
          </div>

          {/* Tag Filter */}
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setSelectedTag('')}
              className={cn(
                'px-2 py-1 text-xs rounded-full border',
                !selectedTag 
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-border hover:bg-muted'
              )}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
                className={cn(
                  'px-2 py-1 text-xs rounded-full border',
                  selectedTag === tag
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border hover:bg-muted'
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className={cn(
                'p-4 border-b border-border cursor-pointer hover:bg-muted/50',
                selectedNote?.id === note.id && 'bg-muted'
              )}
            >
              <h3 className="font-medium mb-1 line-clamp-1">{note.title}</h3>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{note.content}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex flex-wrap gap-1">
                  {note.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-1.5 py-0.5 bg-muted rounded text-xs">
                      {tag}
                    </span>
                  ))}
                  {note.tags.length > 2 && (
                    <span className="px-1.5 py-0.5 bg-muted rounded text-xs">
                      +{note.tags.length - 2}
                    </span>
                  )}
                </div>
                <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {showCreateForm ? (
          <NoteForm
            onSave={createNote}
            onCancel={() => setShowCreateForm(false)}
            clients={clients}
            projects={projects}
          />
        ) : selectedNote ? (
          <NoteViewer
            note={selectedNote}
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            onSave={(updates) => {
              updateNote(selectedNote.id, updates);
              setIsEditing(false);
            }}
            onDelete={() => deleteNote(selectedNote.id)}
            onCancel={() => setIsEditing(false)}
            clients={clients}
            projects={projects}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">No note selected</h2>
              <p className="text-muted-foreground mb-4">Select a note from the sidebar or create a new one</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Create New Note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const NoteForm: React.FC<{
  note?: Note;
  onSave: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  clients: any[];
  projects: any[];
}> = ({ note, onSave, onCancel, clients, projects }) => {
  const [formData, setFormData] = useState({
    title: note?.title || '',
    content: note?.content || '',
    tags: note?.tags || [],
    clientId: note?.clientId || '',
    projectId: note?.projectId || '',
  });
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">{note ? 'Edit Note' : 'New Note'}</h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-muted rounded-md"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
            placeholder="Enter note title..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-md bg-background h-40"
            placeholder="Write your note content..."
            required
          />
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

        <div className="flex space-x-2">
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            <Save className="h-4 w-4 mr-2 inline" />
            Save Note
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

const NoteViewer: React.FC<{
  note: Note;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updates: Partial<Note>) => void;
  onDelete: () => void;
  onCancel: () => void;
  clients: any[];
  projects: any[];
}> = ({ note, isEditing, onEdit, onSave, onDelete, onCancel, clients, projects }) => {
  const client = clients.find(c => c.id === note.clientId);
  const project = projects.find(p => p.id === note.projectId);

  if (isEditing) {
    return (
      <NoteForm
        note={note}
        onSave={onSave}
        onCancel={onCancel}
        clients={clients}
        projects={projects}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">{note.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>Created: {new Date(note.createdAt).toLocaleDateString()}</span>
            <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
            {client && <span>Client: {client.name}</span>}
            {project && <span>Project: {project.title}</span>}
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-2 hover:bg-muted rounded-md"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-destructive/10 text-destructive rounded-md"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          {note.tags.map(tag => (
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

      <div className="prose max-w-none">
        <div className="whitespace-pre-wrap">{note.content}</div>
      </div>
    </div>
  );
};

export default Notes;

