import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    // Auto-dismiss logic handled in individual Toast component or via effect
    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback(({ title, message, type = 'info', duration = 3000 }) => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, title, message, type, duration }]);
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            {createPortal(
                <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
                    {toasts.map((toast) => (
                        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
                    ))}
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    );
};

const ToastItem = ({ toast, onRemove }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => onRemove(toast.id), 300); // Wait for exit animation
        }, toast.duration);

        return () => clearTimeout(timer);
    }, [toast.duration, toast.id, onRemove]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => onRemove(toast.id), 300);
    };

    const icons = {
        success: <CheckCircle className="h-5 w-5 text-green-500" />,
        error: <AlertCircle className="h-5 w-5 text-red-500" />,
        info: <Info className="h-5 w-5 text-blue-500" />,
    };

    const statusStyles = {
        success: "border-l-4 border-green-500 bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-100",
        error: "border-l-4 border-red-500 bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-100",
        info: "border-l-4 border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100",
    };

    return (
        <div
            className={cn(
                "pointer-events-auto relative flex items-start gap-3 rounded-lg bg-background p-4 shadow-lg ring-1 ring-black/5 transition-all duration-300 ease-in-out dark:ring-white/10 input-border",
                statusStyles[toast.type],
                isExiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
            )}
            role="alert"
        >
            <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
            <div className="flex-1">
                {toast.title && <h3 className="text-sm font-medium">{toast.title}</h3>}
                {toast.message && <div className="mt-1 text-sm opacity-90">{toast.message}</div>}
            </div>
            <button
                onClick={handleClose}
                className="ml-4 inline-flex flex-shrink-0 rounded-md p-1 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:hover:bg-white/10"
            >
                <span className="sr-only">Close</span>
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
