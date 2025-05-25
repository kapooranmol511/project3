import axios from 'axios';
import { Agent, CreateAgentDto } from './types';

const API_URL = 'http://localhost:3000';

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
  }
};
