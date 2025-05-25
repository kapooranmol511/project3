import * as RadixToast from '@radix-ui/react-toast';
import { createContext, useContext, useState, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');

  const showToast = (message: string, type: ToastType = 'info') => {
    setMessage(message);
    setType(type);
    setOpen(true);
  };

  const getToastClassName = () => {
    const baseClasses = 'rounded-lg shadow-lg p-4 flex items-center justify-between';
    
    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-600`;
      case 'error':
        return `${baseClasses} bg-red-600`;
      default:
        return `${baseClasses} bg-blue-600`;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <RadixToast.Provider swipeDirection="right">
        {children}
        
        <RadixToast.Root
          className={getToastClassName()}
          open={open}
          onOpenChange={setOpen}
          duration={3000}
        >
          <RadixToast.Title>{message}</RadixToast.Title>
          <RadixToast.Close className="ml-4 text-white hover:text-gray-200">
            ✕
          </RadixToast.Close>
        </RadixToast.Root>
        
        <RadixToast.Viewport className="fixed bottom-4 right-4 flex flex-col gap-2 w-80 max-w-[100vw] m-0 list-none z-50" />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}
