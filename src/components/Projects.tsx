import React from 'react';
import { useAppStore } from '@/store';
import { FolderOpen, Plus } from 'lucide-react';

const Projects: React.FC = () => {
  const { projects, openDrawer } = useAppStore();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text">Projects</h1>
          <p className="text-muted mt-1">
            {projects.length} projects
          </p>
        </div>
        <button
          onClick={() => openDrawer({ type: 'create-project' })}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => openDrawer({ type: 'project-details', data: project })}
                className="card cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-text">{project.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-pill ${
                    project.kind === 'Active' ? 'bg-success/20 text-success' : 'bg-muted/20 text-muted'
                  }`}>
                    {project.kind}
                  </span>
                </div>
                
                {project.description && (
                  <p className="text-sm text-muted mb-3 line-clamp-2">
                    {project.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>{project.status || 'No status'}</span>
                  <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <FolderOpen className="w-16 h-16 mx-auto mb-4 text-muted opacity-50" />
              <h3 className="text-lg font-medium text-text mb-2">No projects yet</h3>
              <p className="text-muted mb-4">Create your first project to get started</p>
              <button
                onClick={() => openDrawer({ type: 'create-project' })}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;

