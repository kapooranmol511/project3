import axios from 'axios';
import { Agent, CreateAgentDto, ChatAgent, ChatMessage, AgentType } from './types';

const API_URL = 'http://localhost:3000';

// Mock data for chat agents
const chatAgents: ChatAgent[] = [
  {
    id: 'weather',
    name: 'Weather Forecaster',
    type: 'weather',
    avatar: '🌤️',
    description: 'Gives live weather via API'
  },
  {
    id: 'doctor',
    name: 'Doctor',
    type: 'doctor',
    avatar: '👨‍⚕️',
    description: 'Offers symptom-based advice'
  }
];

export const api = {
  getAgents: async (): Promise<Agent[]> => {
    const response = await axios.get(`${API_URL}/agents`);
    return response.data;
  },

  createAgent: async (agent: CreateAgentDto): Promise<Agent> => {
    const response = await axios.post(`${API_URL}/agents`, agent);
    return response.data;
  },

  deleteAgent: async (id: number): Promise<Agent> => {
    const response = await axios.delete(`${API_URL}/agents/${id}`);
    return response.data;
  },

  // Chat related API functions
  getChatAgents: async (): Promise<ChatAgent[]> => {
    // In a real app, this would be an API call
    return Promise.resolve(chatAgents);
  },

  sendMessage: async (message: string, agentType: AgentType, previousMessages: ChatMessage[] = []): Promise<ChatMessage> => {
    try {
      // Convert our chat messages to OpenAI format
      const formattedMessages = previousMessages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
      
      // Add the new message
      formattedMessages.push({
        role: 'user',
        content: message
      });
      
      // Send to our backend
      const response = await axios.post(`${API_URL}/openai/chat`, {
        messages: formattedMessages,
        agentType
      });
      
      return {
        id: Date.now().toString(),
        content: response.data.content,
        sender: 'agent',
        timestamp: new Date(),
        agentId: agentType
      };
    } catch (error) {
      console.error('Error sending message to OpenAI:', error);
      throw new Error('Failed to get response from AI assistant');
    }
  }
};
