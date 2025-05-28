export interface Agent {
  id: number;
  name: string;
  description: string | null;
}

export interface CreateAgentDto {
  name: string;
  description?: string;
}

export type AgentType = 'weather' | 'doctor';

export interface ChatAgent {
  id: string;
  name: string;
  type: AgentType;
  avatar: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  agentId?: string;
}
