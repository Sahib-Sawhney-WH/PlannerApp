import React from 'react';
import { useAppStore } from '@/store';
import { Users, Plus } from 'lucide-react';

const Clients: React.FC = () => {
  const { clients, openDrawer } = useAppStore();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text">Clients</h1>
          <p className="text-muted mt-1">
            {clients.length} clients
          </p>
        </div>
        <button
          onClick={() => openDrawer({ type: 'create-client' })}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Client
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {clients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clients.map((client) => (
              <div
                key={client.id}
                onClick={() => openDrawer({ type: 'client-details', data: client })}
                className="card cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-text">{client.name}</h3>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {client.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 rounded-pill bg-ring/20 text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {client.nextStep && (
                  <div className="text-sm text-muted">
                    <strong>Next:</strong> {client.nextStep}
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs text-muted mt-3">
                  <span>{client.contacts.length} contacts</span>
                  <span>{new Date(client.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <Users className="w-16 h-16 mx-auto mb-4 text-muted opacity-50" />
              <h3 className="text-lg font-medium text-text mb-2">No clients yet</h3>
              <p className="text-muted mb-4">Add your first client to get started</p>
              <button
                onClick={() => openDrawer({ type: 'create-client' })}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Client
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;

