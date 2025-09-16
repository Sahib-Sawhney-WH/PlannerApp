-- Seed data for Desktop Planner
-- Example clients, projects, tasks, and other entities

-- Insert example clients
INSERT OR IGNORE INTO clients (id, name, tags, contacts, links, next_step, next_step_due, created_at, updated_at) VALUES
('client-1', 'Acme Corporation', '["Signed", "Enterprise"]', '["john.doe@acme.com", "jane.smith@acme.com"]', '["https://acme.com"]', 'Schedule quarterly review', '2024-01-15T10:00:00Z', '2024-01-01T09:00:00Z', '2024-01-01T09:00:00Z'),
('client-2', 'TechStart Inc', '["Pre-sales", "Startup"]', '["founder@techstart.io"]', '["https://techstart.io"]', 'Send proposal', '2024-01-10T14:00:00Z', '2024-01-02T10:00:00Z', '2024-01-02T10:00:00Z'),
('client-3', 'Global Solutions Ltd', '["Sales pursuit", "Fortune 500"]', '["cto@globalsolutions.com"]', '["https://globalsolutions.com"]', 'Follow up on RFP', '2024-01-12T16:00:00Z', '2024-01-03T11:00:00Z', '2024-01-03T11:00:00Z');

-- Insert example opportunities
INSERT OR IGNORE INTO opportunities (id, client_id, name, stage, amount, probability, next_step, next_step_due, notes, created_at, updated_at) VALUES
('opp-1', 'client-2', 'Digital Transformation Project', 'Proposal', 150000, 0.7, 'Present proposal to board', '2024-01-15T09:00:00Z', 'High-value opportunity with strong technical fit', '2024-01-02T10:00:00Z', '2024-01-05T14:00:00Z'),
('opp-2', 'client-3', 'Cloud Migration Initiative', 'Discovery', 250000, 0.4, 'Technical deep-dive session', '2024-01-18T13:00:00Z', 'Complex migration with multiple stakeholders', '2024-01-03T11:00:00Z', '2024-01-03T11:00:00Z'),
('opp-3', 'client-1', 'Security Audit Expansion', 'Negotiation', 75000, 0.9, 'Finalize contract terms', '2024-01-20T11:00:00Z', 'Follow-on work from successful initial audit', '2024-01-04T15:00:00Z', '2024-01-08T10:00:00Z');

-- Insert example projects
INSERT OR IGNORE INTO projects (id, client_id, kind, type, status, title, description, tags, next_step, next_step_due, created_at, updated_at) VALUES
('proj-1', 'client-1', 'Active', 'Implementation', 'In Progress', 'Security Infrastructure Upgrade', 'Comprehensive security audit and infrastructure modernization', '["Security", "Infrastructure"]', 'Deploy new firewall rules', '2024-01-16T09:00:00Z', '2023-12-01T09:00:00Z', '2024-01-05T14:00:00Z'),
('proj-2', NULL, 'Planned', 'R&D', 'Planning', 'AI-Powered Analytics Demo', 'Build demo showcasing AI capabilities for sales presentations', '["AI", "Demo", "Sales"]', 'Research ML frameworks', '2024-01-14T10:00:00Z', '2024-01-01T08:00:00Z', '2024-01-01T08:00:00Z'),
('proj-3', 'client-2', 'Active', 'Consulting', 'In Progress', 'API Integration Project', 'Integrate third-party APIs for customer data synchronization', '["Integration", "API"]', 'Complete authentication setup', '2024-01-17T15:00:00Z', '2023-11-15T10:00:00Z', '2024-01-06T11:00:00Z');

-- Insert example milestones
INSERT OR IGNORE INTO milestones (id, project_id, title, due, status, notes, created_at, updated_at) VALUES
('mile-1', 'proj-1', 'Security Assessment Complete', '2024-01-20T17:00:00Z', 'Done', 'All systems assessed and vulnerabilities documented', '2023-12-01T09:00:00Z', '2024-01-10T16:00:00Z'),
('mile-2', 'proj-1', 'Infrastructure Deployment', '2024-02-15T17:00:00Z', 'In Progress', 'Deploy new security infrastructure components', '2023-12-01T09:00:00Z', '2024-01-05T14:00:00Z'),
('mile-3', 'proj-2', 'Demo MVP Ready', '2024-01-25T17:00:00Z', 'Planned', 'Basic AI demo functionality complete', '2024-01-01T08:00:00Z', '2024-01-01T08:00:00Z'),
('mile-4', 'proj-3', 'API Integration Complete', '2024-01-30T17:00:00Z', 'In Progress', 'All required APIs integrated and tested', '2023-11-15T10:00:00Z', '2024-01-06T11:00:00Z');

-- Insert example tasks
INSERT OR IGNORE INTO tasks (id, project_id, client_id, title, description, status, due, priority, effort, impact, confidence, is_next_step, tags, links, created_at, updated_at, score) VALUES
('task-1', 'proj-1', 'client-1', 'Configure firewall rules', 'Set up new firewall rules based on security assessment findings', 'Doing', '2024-01-16T17:00:00Z', 4, 2.0, 5, 0.9, true, '["Security", "Infrastructure"]', '[]', '2024-01-05T09:00:00Z', '2024-01-08T14:00:00Z', 2.25),
('task-2', 'proj-2', NULL, 'Research TensorFlow integration', 'Investigate TensorFlow.js for client-side AI processing', 'Todo', '2024-01-18T17:00:00Z', 3, 3.0, 4, 0.7, false, '["AI", "Research"]', '["https://tensorflow.org/js"]', '2024-01-01T08:00:00Z', '2024-01-01T08:00:00Z', 0.93),
('task-3', 'proj-3', 'client-2', 'Implement OAuth flow', 'Set up OAuth 2.0 authentication for third-party API access', 'Todo', '2024-01-17T17:00:00Z', 5, 1.5, 5, 0.8, true, '["Integration", "Security"]', '[]', '2024-01-06T10:00:00Z', '2024-01-06T10:00:00Z', 2.67),
('task-4', NULL, NULL, 'Prepare quarterly client review', 'Compile performance metrics and prepare presentation materials', 'Inbox', '2024-01-22T17:00:00Z', 3, 2.0, 3, 0.9, false, '["Admin", "Client Management"]', '[]', '2024-01-08T11:00:00Z', '2024-01-08T11:00:00Z', 1.35),
('task-5', 'proj-1', 'client-1', 'Update security documentation', 'Document new security procedures and update runbooks', 'Blocked', '2024-01-19T17:00:00Z', 2, 1.0, 2, 0.8, false, '["Documentation", "Security"]', '[]', '2024-01-07T13:00:00Z', '2024-01-09T09:00:00Z', 1.6);

-- Insert example notes
INSERT OR IGNORE INTO notes (id, title, body_markdown_path, client_id, project_id, tags, created_at, updated_at) VALUES
('note-1', 'Acme Security Meeting Notes', NULL, 'client-1', 'proj-1', '["Meeting", "Security"]', '2024-01-08T14:30:00Z', '2024-01-08T14:30:00Z'),
('note-2', 'AI Demo Ideas Brainstorm', NULL, NULL, 'proj-2', '["Brainstorm", "AI", "Demo"]', '2024-01-02T16:00:00Z', '2024-01-05T10:00:00Z'),
('note-3', 'TechStart Discovery Call', NULL, 'client-2', NULL, '["Discovery", "Sales"]', '2024-01-03T15:00:00Z', '2024-01-03T15:00:00Z');

-- Insert example stakeholders
INSERT OR IGNORE INTO stakeholders (id, client_id, name, role, email, phone, timezone, influence, preferred_comms, notes, created_at, updated_at) VALUES
('stake-1', 'client-1', 'John Doe', 'CTO', 'john.doe@acme.com', '+1-555-0101', 'America/New_York', 5, 'email', 'Primary technical decision maker', '2024-01-01T09:00:00Z', '2024-01-01T09:00:00Z'),
('stake-2', 'client-1', 'Jane Smith', 'CISO', 'jane.smith@acme.com', '+1-555-0102', 'America/New_York', 4, 'email', 'Security lead, very detail-oriented', '2024-01-01T09:00:00Z', '2024-01-01T09:00:00Z'),
('stake-3', 'client-2', 'Mike Johnson', 'Founder & CEO', 'founder@techstart.io', '+1-555-0201', 'America/Los_Angeles', 5, 'phone', 'Startup founder, prefers quick calls', '2024-01-02T10:00:00Z', '2024-01-02T10:00:00Z'),
('stake-4', 'client-3', 'Sarah Wilson', 'CTO', 'cto@globalsolutions.com', '+1-555-0301', 'Europe/London', 5, 'teams', 'Technical leader, uses Teams for all meetings', '2024-01-03T11:00:00Z', '2024-01-03T11:00:00Z');

-- Insert example risks
INSERT OR IGNORE INTO risks (id, project_id, client_id, title, severity, likelihood, mitigation, owner, due, status, created_at, updated_at) VALUES
('risk-1', 'proj-1', 'client-1', 'Legacy system compatibility issues', 'High', 'Medium', 'Conduct thorough compatibility testing before deployment', 'John Doe', '2024-01-20T17:00:00Z', 'Open', '2024-01-05T09:00:00Z', '2024-01-05T09:00:00Z'),
('risk-2', 'proj-3', 'client-2', 'Third-party API rate limiting', 'Medium', 'High', 'Implement caching and request queuing mechanisms', 'Mike Johnson', '2024-01-25T17:00:00Z', 'Monitoring', '2024-01-06T10:00:00Z', '2024-01-10T14:00:00Z');

-- Insert example decisions
INSERT OR IGNORE INTO decisions (id, project_id, client_id, title, decision_text, decided_on, owner, impact, links, created_at, updated_at) VALUES
('dec-1', 'proj-1', 'client-1', 'Firewall vendor selection', 'Selected Palo Alto Networks for next-generation firewall solution based on feature set and integration capabilities', '2024-01-05T14:00:00Z', 'Jane Smith', 'High - affects entire security infrastructure', '["https://paloaltonetworks.com"]', '2024-01-05T14:00:00Z', '2024-01-05T14:00:00Z'),
('dec-2', 'proj-2', NULL, 'AI framework choice', 'Decided to use TensorFlow.js for client-side processing to maintain data privacy', '2024-01-03T10:00:00Z', 'Self', 'Medium - affects demo architecture', '["https://tensorflow.org/js"]', '2024-01-03T10:00:00Z', '2024-01-03T10:00:00Z');

-- Insert example time entries
INSERT OR IGNORE INTO time_entries (id, date, hours, billable, client_id, project_id, task_id, notes, created_at, updated_at) VALUES
('time-1', '2024-01-08', 4.5, true, 'client-1', 'proj-1', 'task-1', 'Firewall configuration and testing', '2024-01-08T18:00:00Z', '2024-01-08T18:00:00Z'),
('time-2', '2024-01-08', 2.0, false, NULL, 'proj-2', 'task-2', 'TensorFlow research and documentation review', '2024-01-08T18:00:00Z', '2024-01-08T18:00:00Z'),
('time-3', '2024-01-09', 3.0, true, 'client-2', 'proj-3', 'task-3', 'OAuth implementation planning', '2024-01-09T18:00:00Z', '2024-01-09T18:00:00Z'),
('time-4', '2024-01-09', 1.5, false, NULL, NULL, 'task-4', 'Client review preparation', '2024-01-09T18:00:00Z', '2024-01-09T18:00:00Z');

-- Insert example knowledge items
INSERT OR IGNORE INTO knowledge_items (id, title, url, description, tags, source_type, created_at, last_accessed_at, updated_at) VALUES
('know-1', 'Palo Alto Networks Configuration Guide', 'https://docs.paloaltonetworks.com/pan-os', 'Comprehensive guide for configuring PAN-OS firewalls', '["Security", "Firewall", "Documentation"]', 'docs', '2024-01-05T15:00:00Z', '2024-01-08T10:00:00Z', '2024-01-05T15:00:00Z'),
('know-2', 'TensorFlow.js Getting Started', 'https://tensorflow.org/js/guide', 'Official guide for getting started with TensorFlow.js', '["AI", "JavaScript", "Tutorial"]', 'docs', '2024-01-02T09:00:00Z', '2024-01-08T14:00:00Z', '2024-01-02T09:00:00Z'),
('know-3', 'OAuth 2.0 Security Best Practices', 'https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics', 'IETF draft on OAuth 2.0 security considerations', '["Security", "OAuth", "Best Practices"]', 'article', '2024-01-06T11:00:00Z', '2024-01-06T16:00:00Z', '2024-01-06T11:00:00Z'),
('know-4', 'React State Management Patterns', 'https://github.com/pmndrs/zustand', 'Zustand - lightweight state management for React', '["React", "State Management", "JavaScript"]', 'github', '2024-01-01T12:00:00Z', '2024-01-07T09:00:00Z', '2024-01-01T12:00:00Z'),
('know-5', 'Tauri Desktop App Development', 'https://tauri.app/v1/guides/', 'Official Tauri development guides and tutorials', '["Desktop", "Rust", "Development"]', 'docs', '2024-01-01T08:00:00Z', '2024-01-05T13:00:00Z', '2024-01-01T08:00:00Z');

-- Insert default settings
INSERT OR IGNORE INTO settings (key, value, updated_at) VALUES
('theme_mode', 'dark', '2024-01-01T00:00:00Z'),
('accent_color', '#4DA3FF', '2024-01-01T00:00:00Z'),
('density', 'comfortable', '2024-01-01T00:00:00Z'),
('sidebar_expanded', 'true', '2024-01-01T00:00:00Z'),
('notifications_enabled', 'true', '2024-01-01T00:00:00Z'),
('start_on_boot', 'false', '2024-01-01T00:00:00Z'),
('minimize_to_tray', 'true', '2024-01-01T00:00:00Z');