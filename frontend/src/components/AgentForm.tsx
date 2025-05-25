import { useState } from 'react';
import { CreateAgentDto, Agent } from '../types';
import { api } from '../api';
import { useToast } from './Toast';

interface AgentFormProps {
  onAgentCreated: (agent: Agent) => void;
}

export default function AgentForm({ onAgentCreated }: AgentFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      showToast('Name is required', 'error');
      return;
    }
    
    const newAgent: CreateAgentDto = {
      name: name.trim(),
      ...(description.trim() && { description: description.trim() })
    };
    
    try {
      setIsSubmitting(true);
      const createdAgent = await api.createAgent(newAgent);
      onAgentCreated(createdAgent);
      showToast('Agent created successfully!', 'success');
      
      // Reset form
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Failed to create agent:', error);
      showToast('Failed to create agent', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name *
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter agent name"
          disabled={isSubmitting}
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter agent description"
          rows={3}
          disabled={isSubmitting}
        />
      </div>
      
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating...' : 'Create Agent'}
      </button>
    </form>
  );
}
