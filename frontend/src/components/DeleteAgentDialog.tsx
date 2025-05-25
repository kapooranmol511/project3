import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { Agent } from '../types';
import { api } from '../api';
import { useToast } from './Toast';

interface DeleteAgentDialogProps {
  agent: Agent;
  onAgentDeleted: (id: number) => void;
}

export default function DeleteAgentDialog({ agent, onAgentDeleted }: DeleteAgentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await api.deleteAgent(agent.id);
      onAgentDeleted(agent.id);
      showToast('Agent deleted successfully', 'success');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to delete agent:', error);
      showToast('Failed to delete agent', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button 
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition duration-200"
        >
          Delete
        </button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Delete Agent
          </Dialog.Title>
          
          <Dialog.Description className="text-gray-300 mb-6">
            Are you sure you want to delete <span className="font-semibold">{agent.name}</span>? 
            This action cannot be undone.
          </Dialog.Description>
          
          <div className="flex justify-end gap-3">
            <Dialog.Close asChild>
              <button 
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition duration-200"
                disabled={isDeleting}
              >
                Cancel
              </button>
            </Dialog.Close>
            
            <button 
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-200 disabled:opacity-50"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
