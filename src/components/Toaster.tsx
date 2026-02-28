import { useState, createContext, useContext, useCallback } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toaster toasts={toasts} setToasts={setToasts} />
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

interface ToasterProps {
  toasts: Toast[];
  setToasts: React.Dispatch<React.SetStateAction<Toast[]>>;
}

function Toaster({ toasts, setToasts }: ToasterProps) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info
  };

  const colors = {
    success: 'text-green-500 border-green-500/30 bg-green-500/10',
    error: 'text-red-500 border-red-500/30 bg-red-500/10',
    info: 'text-primary border-primary/30 bg-primary/10'
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => {
        const Icon = icons[toast.type];
        return (
          <div 
            key={toast.id} 
            className={`flex items-center gap-3 border px-4 py-3 rounded-xl shadow-2xl min-w-[300px] animate-in slide-in-from-right ${colors[toast.type]}`}
          >
            <Icon className="w-5 h-5" />
            <span className="flex-1 text-sm font-medium">{toast.message}</span>
            <button 
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export { Toaster };
