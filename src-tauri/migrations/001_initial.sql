-- Desktop Planner Database Schema
-- Initial migration with all tables, indexes, and FTS5 setup

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tags TEXT DEFAULT '[]', -- JSON array
    contacts TEXT DEFAULT '[]', -- JSON array
    links TEXT DEFAULT '[]', -- JSON array
    next_step TEXT,
    next_step_due TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
    id TEXT PRIMARY KEY,
    client_id TEXT,
    name TEXT NOT NULL,
    stage TEXT NOT NULL CHECK (stage IN ('Discovery', 'Scoping', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost')),
    amount REAL,
    probability REAL,
    next_step TEXT,
    next_step_due TEXT,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    client_id TEXT,
    kind TEXT NOT NULL CHECK (kind IN ('Active', 'Planned')),
    type TEXT,
    status TEXT,
    title TEXT NOT NULL,
    description TEXT,
    tags TEXT DEFAULT '[]', -- JSON array
    next_step TEXT,
    next_step_due TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
);

-- Milestones table
CREATE TABLE IF NOT EXISTS milestones (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    title TEXT NOT NULL,
    due TEXT,
    status TEXT NOT NULL CHECK (status IN ('Planned', 'In Progress', 'Done', 'At Risk')),
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    client_id TEXT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL CHECK (status IN ('Inbox', 'Todo', 'Doing', 'Blocked', 'Done')),
    due TEXT,
    priority INTEGER,
    effort REAL,
    impact INTEGER,
    confidence REAL,
    rrule TEXT, -- Recurrence rule
    is_next_step BOOLEAN DEFAULT FALSE,
    tags TEXT DEFAULT '[]', -- JSON array
    links TEXT DEFAULT '[]', -- JSON array
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    score REAL, -- Calculated ICE score
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    body_markdown_path TEXT, -- Path to markdown file
    client_id TEXT,
    project_id TEXT,
    tags TEXT DEFAULT '[]', -- JSON array
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

-- Stakeholders table
CREATE TABLE IF NOT EXISTS stakeholders (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT,
    email TEXT,
    phone TEXT,
    timezone TEXT,
    influence INTEGER CHECK (influence BETWEEN 1 AND 5),
    preferred_comms TEXT CHECK (preferred_comms IN ('email', 'phone', 'teams', 'other')),
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Risks table (part of RAID)
CREATE TABLE IF NOT EXISTS risks (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    client_id TEXT,
    title TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('Low', 'Medium', 'High')),
    likelihood TEXT NOT NULL CHECK (likelihood IN ('Low', 'Medium', 'High')),
    mitigation TEXT,
    owner TEXT,
    due TEXT,
    status TEXT NOT NULL CHECK (status IN ('Open', 'Monitoring', 'Closed')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Assumptions table (part of RAID)
CREATE TABLE IF NOT EXISTS assumptions (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    client_id TEXT,
    title TEXT NOT NULL,
    description TEXT,
    validated BOOLEAN DEFAULT FALSE,
    validation_date TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Issues table (part of RAID)
CREATE TABLE IF NOT EXISTS issues (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    client_id TEXT,
    title TEXT NOT NULL,
    description TEXT,
    severity TEXT NOT NULL CHECK (severity IN ('Low', 'Medium', 'High')),
    status TEXT NOT NULL CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed')),
    owner TEXT,
    due TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Decisions table (part of RAID)
CREATE TABLE IF NOT EXISTS decisions (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    client_id TEXT,
    title TEXT NOT NULL,
    decision_text TEXT NOT NULL,
    decided_on TEXT,
    owner TEXT,
    impact TEXT,
    links TEXT DEFAULT '[]', -- JSON array
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Time Entries table
CREATE TABLE IF NOT EXISTS time_entries (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    hours REAL NOT NULL,
    billable BOOLEAN DEFAULT FALSE,
    client_id TEXT,
    project_id TEXT,
    task_id TEXT,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL
);

-- Knowledge Items table
CREATE TABLE IF NOT EXISTS knowledge_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT,
    description TEXT,
    tags TEXT DEFAULT '[]', -- JSON array
    source_type TEXT CHECK (source_type IN ('howto', 'article', 'docs', 'github', 'video', 'other')),
    created_at TEXT NOT NULL,
    last_accessed_at TEXT,
    updated_at TEXT NOT NULL
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due ON tasks(due);
CREATE INDEX IF NOT EXISTS idx_tasks_client_id ON tasks(client_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_is_next_step ON tasks(is_next_step);

CREATE INDEX IF NOT EXISTS idx_projects_kind ON projects(kind);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

CREATE INDEX IF NOT EXISTS idx_opportunities_stage ON opportunities(stage);
CREATE INDEX IF NOT EXISTS idx_opportunities_client_id ON opportunities(client_id);

CREATE INDEX IF NOT EXISTS idx_milestones_project_id ON milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_milestones_due ON milestones(due);
CREATE INDEX IF NOT EXISTS idx_milestones_status ON milestones(status);

CREATE INDEX IF NOT EXISTS idx_notes_client_id ON notes(client_id);
CREATE INDEX IF NOT EXISTS idx_notes_project_id ON notes(project_id);

CREATE INDEX IF NOT EXISTS idx_stakeholders_client_id ON stakeholders(client_id);

CREATE INDEX IF NOT EXISTS idx_time_entries_date ON time_entries(date);
CREATE INDEX IF NOT EXISTS idx_time_entries_client_id ON time_entries(client_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_project_id ON time_entries(project_id);

-- Create FTS5 virtual tables for full-text search
CREATE VIRTUAL TABLE IF NOT EXISTS tasks_fts USING fts5(
    id UNINDEXED,
    title,
    description,
    content='tasks',
    content_rowid='rowid'
);

CREATE VIRTUAL TABLE IF NOT EXISTS notes_fts USING fts5(
    id UNINDEXED,
    title,
    body,
    content='notes',
    content_rowid='rowid'
);

CREATE VIRTUAL TABLE IF NOT EXISTS knowledge_items_fts USING fts5(
    id UNINDEXED,
    title,
    description,
    content='knowledge_items',
    content_rowid='rowid'
);

-- Triggers to keep FTS5 tables in sync
CREATE TRIGGER IF NOT EXISTS tasks_fts_insert AFTER INSERT ON tasks BEGIN
    INSERT INTO tasks_fts(id, title, description) VALUES (new.id, new.title, new.description);
END;

CREATE TRIGGER IF NOT EXISTS tasks_fts_delete AFTER DELETE ON tasks BEGIN
    DELETE FROM tasks_fts WHERE id = old.id;
END;

CREATE TRIGGER IF NOT EXISTS tasks_fts_update AFTER UPDATE ON tasks BEGIN
    DELETE FROM tasks_fts WHERE id = old.id;
    INSERT INTO tasks_fts(id, title, description) VALUES (new.id, new.title, new.description);
END;

CREATE TRIGGER IF NOT EXISTS notes_fts_insert AFTER INSERT ON notes BEGIN
    INSERT INTO notes_fts(id, title, body) VALUES (new.id, new.title, '');
END;

CREATE TRIGGER IF NOT EXISTS notes_fts_delete AFTER DELETE ON notes BEGIN
    DELETE FROM notes_fts WHERE id = old.id;
END;

CREATE TRIGGER IF NOT EXISTS notes_fts_update AFTER UPDATE ON notes BEGIN
    DELETE FROM notes_fts WHERE id = old.id;
    INSERT INTO notes_fts(id, title, body) VALUES (new.id, new.title, '');
END;

CREATE TRIGGER IF NOT EXISTS knowledge_items_fts_insert AFTER INSERT ON knowledge_items BEGIN
    INSERT INTO knowledge_items_fts(id, title, description) VALUES (new.id, new.title, new.description);
END;

CREATE TRIGGER IF NOT EXISTS knowledge_items_fts_delete AFTER DELETE ON knowledge_items BEGIN
    DELETE FROM knowledge_items_fts WHERE id = old.id;
END;

CREATE TRIGGER IF NOT EXISTS knowledge_items_fts_update AFTER UPDATE ON knowledge_items BEGIN
    DELETE FROM knowledge_items_fts WHERE id = old.id;
    INSERT INTO knowledge_items_fts(id, title, description) VALUES (new.id, new.title, new.description);
END;