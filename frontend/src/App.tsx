import { useState, useEffect } from 'react';
import { Agent } from './types';
import { api } from './api';
import AgentList from './components/AgentList';
import AgentForm from './components/AgentForm';
import { ChatUI } from './components/ChatUI';
import { ToastProvider } from './components/Toast';

function App() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'manage' | 'chat'>('chat');

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const data = await api.getAgents();
      setAgents(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch agents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleAgentCreated = (agent: Agent) => {
    setAgents((prev) => [...prev, agent]);
  };

  const handleAgentDeleted = (id: number) => {
    setAgents((prev) => prev.filter((agent) => agent.id !== id));
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center">AI Assistant Platform</h1>
          
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`px-5 py-2.5 text-sm font-medium rounded-l-lg ${
                  activeTab === 'chat'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Chat Assistant
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('manage')}
                className={`px-5 py-2.5 text-sm font-medium rounded-r-lg ${
                  activeTab === 'manage'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Manage Agents
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'chat' ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Chat with AI Assistants</h2>
                <ChatUI />
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Agent Management</h2>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Create New Agent</h3>
                  <AgentForm onAgentCreated={handleAgentCreated} />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Agent List</h3>
                  {loading ? (
                    <p className="text-center py-4">Loading agents...</p>
                  ) : error ? (
                    <p className="text-red-500 text-center py-4">{error}</p>
                  ) : agents.length === 0 ? (
                    <p className="text-center py-4">No agents found. Create one above!</p>
                  ) : (
                    <AgentList agents={agents} onAgentDeleted={handleAgentDeleted} />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}

export default App;
