import { Agent } from '../types';
import DeleteAgentDialog from './DeleteAgentDialog';

interface AgentListProps {
  agents: Agent[];
  onAgentDeleted: (id: number) => void;
}

export default function AgentList({ agents, onAgentDeleted }: AgentListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {agents.map((agent) => (
        <div key={agent.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">{agent.name}</h3>
          {agent.description && (
            <p className="text-gray-300 mb-4">{agent.description}</p>
          )}
          <div className="flex justify-end">
            <DeleteAgentDialog 
              agent={agent} 
              onAgentDeleted={onAgentDeleted} 
            />
          </div>
        </div>
      ))}
    </div>
  );
}
