import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ open, onClose, title, subtitle, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const sizeClass = size === 'sm' ? 'max-w-md' : size === 'lg' ? 'max-w-3xl' : 'max-w-xl';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white w-full ${sizeClass} max-h-[92vh] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-navy-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-navy-900">{title}</h2>
            {subtitle && <p className="text-xs text-navy-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-navy-100 rounded-lg text-navy-400 hover:text-navy-600 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}

// Reusable form field components
export function FormField({ label, required, children, hint }: { label: string; required?: boolean; children: ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-700 mb-1.5">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-navy-400 mt-1">{hint}</p>}
    </div>
  );
}

export function FormRow({ children, cols = 2 }: { children: ReactNode; cols?: number }) {
  const colsClass = cols === 1 ? 'grid-cols-1' : cols === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2';
  return <div className={`grid ${colsClass} gap-4`}>{children}</div>;
}

export const inputClass = "w-full px-3 py-2.5 border border-navy-200 rounded-lg text-sm text-navy-800 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all placeholder:text-navy-300";
export const selectClass = "w-full px-3 py-2.5 border border-navy-200 rounded-lg text-sm text-navy-800 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all bg-white";
export const textareaClass = "w-full px-3 py-2.5 border border-navy-200 rounded-lg text-sm text-navy-800 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all placeholder:text-navy-300 resize-none";

export function SubmitButton({ children, onClick, variant = 'primary' }: { children: ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' }) {
  const cls = variant === 'primary'
    ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-sm'
    : 'bg-navy-100 text-navy-700 hover:bg-navy-200';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${cls}`}
    >
      {children}
    </button>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors ${checked ? 'bg-primary-500' : 'bg-navy-200'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
      {label && <span className="ml-2 text-sm text-navy-700">{label}</span>}
    </button>
  );
}
