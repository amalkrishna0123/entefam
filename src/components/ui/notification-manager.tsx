"use client"

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNotificationStore } from '@/store/notification-store';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'danger' | 'success';
}

interface NotificationContextType {
  notify: (notification: Omit<Notification, 'id'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { addNotification } = useNotificationStore();

  const notify = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { ...notification, id }]);

    // Also add to persistent store
    addNotification({
      title: notification.title,
      message: notification.message,
      type: notification.type,
    });

    // Auto remove toast after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, [addNotification]);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 w-full max-w-[400px] px-4 pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="pointer-events-auto"
            >
              <div className={`
                relative overflow-hidden
                bg-[rgba(255,255,255,0.8)] dark:bg-[rgba(20,20,20,0.8)]
                backdrop-blur-xl border border-[var(--border)]
                rounded-3xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.1)]
                flex items-center gap-4
              `}>
                <div className={`
                  w-12 h-12 rounded-2xl flex items-center justify-center shrink-0
                  ${n.type === 'danger' ? 'bg-red-500/10 text-red-500' : 
                    n.type === 'warning' ? 'bg-amber-500/10 text-amber-500' : 
                    n.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 
                    'bg-blue-500/10 text-blue-500'}
                `}>
                  {n.type === 'danger' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  )}
                  {n.type === 'warning' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  )}
                  {(n.type === 'info' || n.type === 'success') && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[var(--text-primary)] text-[15px] leading-tight truncate">
                    {n.title}
                  </div>
                  <div className="text-[13px] text-[var(--text-secondary)] mt-0.5 line-clamp-2">
                    {n.message}
                  </div>
                </div>
                <button 
                  onClick={() => setNotifications((prev) => prev.filter((item) => item.id !== n.id))}
                  style={{marginRight:"10px"}}
                  className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
