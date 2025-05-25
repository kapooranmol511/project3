export interface Agent {
  id: number;
  name: string;
  description: string | null;
}

export interface CreateAgentDto {
  name: string;
  description?: string;
}
