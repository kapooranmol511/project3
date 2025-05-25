import { useState, useEffect } from 'react';
import { Agent } from './types';
import { api } from './api';
import AgentList from './components/AgentList';
import AgentForm from './components/AgentForm';
import { ToastProvider } from './components/Toast';

function App() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Agent Manager</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Agent</h2>
          <AgentForm onAgentCreated={handleAgentCreated} />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Agent List</h2>
          {loading ? (
            <p className="text-center">Loading agents...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : agents.length === 0 ? (
            <p className="text-center">No agents found. Create one above!</p>
          ) : (
            <AgentList agents={agents} onAgentDeleted={handleAgentDeleted} />
          )}
        </div>
      </div>
    </ToastProvider>
  );
}

export default App;
