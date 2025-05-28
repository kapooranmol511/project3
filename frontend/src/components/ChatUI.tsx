import { useState, useEffect, useRef } from 'react';
import { ChatAgent, ChatMessage, AgentType } from '../types';
import { api } from '../api';
import { useToast } from './Toast';

// Shadcn UI inspired components
const Button = ({ 
  children, 
  onClick, 
  className = '', 
  disabled = false 
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  className?: string; 
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 
    ${disabled 
      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
      : 'bg-blue-600 text-white hover:bg-blue-700'} 
    ${className}`}
  >
    {children}
  </button>
);

const Avatar = ({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string;
}) => (
  <div className={`flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 text-lg ${className}`}>
    {children}
  </div>
);

const Card = ({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string;
}) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${className}`}>
    {children}
  </div>
);

const Select = ({ 
  options, 
  value, 
  onChange, 
  className = '' 
}: { 
  options: { value: string; label: string; }[]; 
  value: string; 
  onChange: (value: string) => void; 
  className?: string;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
    rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

export function ChatUI() {
  const [agents, setAgents] = useState<ChatAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<ChatAgent | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await api.getChatAgents();
        setAgents(data);
        if (data.length > 0) {
          setSelectedAgent(data[0]);
        }
      } catch (error) {
        showToast('Failed to load chat agents', 'error');
      }
    };

    fetchAgents();
  }, [showToast]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedAgent) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      // Pass the current conversation history to maintain context
      const response = await api.sendMessage(
        inputMessage, 
        selectedAgent.type as AgentType,
        messages // Pass previous messages for context
      );
      setMessages((prev) => [...prev, response]);
    } catch (error) {
      showToast('Failed to get response from agent', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAgentChange = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      setSelectedAgent(agent);
      // Clear messages when changing agents
      setMessages([]);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Chat Assistant</h2>
          <Select
            options={agents.map(agent => ({ value: agent.id, label: agent.name }))}
            value={selectedAgent?.id || ''}
            onChange={handleAgentChange}
            className="w-48"
          />
        </div>
        {selectedAgent && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {selectedAgent.description}
          </p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100 dark:bg-gray-900">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p className="text-center mb-2">No messages yet</p>
            <p className="text-center text-sm">
              Start a conversation with {selectedAgent?.name || 'the assistant'}
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex mb-4 ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`flex max-w-[80%] ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {message.sender === 'agent' && selectedAgent && (
                  <div className="mr-2 flex-shrink-0">
                    <Avatar>{selectedAgent.avatar}</Avatar>
                  </div>
                )}
                <Card
                  className={`${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-black'
                      : 'bg-white dark:bg-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user'
                        ? 'text-blue-200'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </Card>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask ${selectedAgent?.name || 'the assistant'} something...`}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={1}
            disabled={loading}
          />
          <Button
            onClick={handleSendMessage}
            className="rounded-l-none"
            disabled={loading || !inputMessage.trim()}
          >
            {loading ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </div>
    </div>
  );
}
