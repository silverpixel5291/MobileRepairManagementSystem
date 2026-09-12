import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

export function Toast({ message, type }: ToastProps) {
  const config = {
    success: { bg: 'bg-mint-500', icon: CheckCircle },
    error: { bg: 'bg-rose-500', icon: AlertCircle },
    info: { bg: 'bg-primary-500', icon: Info },
  };
  const { bg, icon: Icon } = config[type];

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-[60] animate-fade-in">
      <div className={`${bg} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 min-w-[280px] max-w-md`}>
        <Icon size={18} />
        <span className="text-sm font-medium flex-1">{message}</span>
      </div>
    </div>
  );
}
