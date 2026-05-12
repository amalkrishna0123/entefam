"use client"

import { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, X, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore, Notification } from '@/store/notification-store';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markAsRead, markAllAsRead, clearAll, getUnreadCount } = useNotificationStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = getUnreadCount();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'danger': return <AlertCircle className="text-red-500" size={18} />;
      case 'warning': return <AlertTriangle className="text-amber-500" size={18} />;
      case 'success': return <CheckCircle className="text-emerald-500" size={18} />;
      default: return <Info className="text-blue-500" size={18} />;
    }
  };

  if (!isMounted) {
    return (
      <div className="relative" ref={dropdownRef} style={{padding:"10px"}}>
        <button
          className="relative p-2 rounded-full hover:bg-[var(--bg-elevated)] transition-all duration-300 group"
          aria-label="Notifications"
          style={{background:"#000",padding:"5px",borderRadius:"50%"}}
        >
          <Bell 
            size={10} 
            className="transition-colors text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]"
          />
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef} style={{padding:"10px"}}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-[var(--bg-elevated)] transition-all duration-300 group"
        aria-label="Notifications"
      >
        <Bell 
          size={22} 
          className={`transition-colors ${unreadCount > 0 ? 'text-[#f6ca5f]' : 'text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]'}`}
        />
        
        {unreadCount > 0 && (
          <>
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[var(--bg-surface)]"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
            
            {/* Pulse Animation */}
            <motion.span
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full"
            />
          </>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-80 sm:w-96 bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden z-[100] backdrop-blur-xl"
            style={{ backgroundColor: 'rgba(var(--bg-surface-rgb), 0.8)', padding: "20px" }}
          >
            {/* Header */}
            <div className="p-4 border-bottom border-[var(--border)] flex items-center justify-between" style={{marginBottom:"10px"}}>
              <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <span className="text-[11px] px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded-full font-medium">
                    {unreadCount} New
                  </span>
                )}
              </h3>
              <div className="flex gap-1">
                {notifications.length > 0 && (
                  <button 
                    onClick={() => markAllAsRead()}
                    className="p-1.5 text-[var(--text-tertiary)] hover:text-blue-500 transition-colors"
                    title="Mark all as read"
                  >
                    <Check size={16} />
                  </button>
                )}
                <button 
                  onClick={() => clearAll()}
                  className="p-1.5 text-[var(--text-tertiary)] hover:text-red-500 transition-colors"
                  title="Clear all"
                >
                  <Trash2 size={16} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
              {notifications.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="w-16 h-16 bg-[#f6ca5f] rounded-full flex items-center justify-center mx-auto mb-4 text-[#000]">
                    <Bell size={24} opacity={0.3} />
                  </div>
                  <p className="text-[var(--text-secondary)] font-medium">No notifications yet</p>
                  <p className="text-[var(--text-tertiary)] text-xs mt-1">We'll notify you when something important happens.</p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--border)]">
                  {notifications.map((n) => (
                    <div 
                      key={n.id}
                      style={{marginBottom:"10px"}}
                      className={`p-4 flex gap-4 transition-colors hover:bg-[var(--bg-elevated)]/50 relative group ${!n.isRead ? 'bg-blue-500/[0.02]' : ''}`}
                    >
                      {!n.isRead && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                      )}
                      
                      <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center ${
                        n.type === 'danger' ? 'bg-red-500/10' : 
                        n.type === 'warning' ? 'bg-amber-500/10' : 
                        n.type === 'success' ? 'bg-emerald-500/10' : 
                        'bg-blue-500/10'
                      }`}>
                        {getIcon(n.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className={`text-sm font-bold truncate ${!n.isRead ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                            {n.title}
                          </h4>
                          <span className="text-[10px] text-[var(--text-tertiary)] whitespace-nowrap pt-0.5">
                            {formatDistanceToNow(new Date(n.date), { addSuffix: true })}
                          </span>
                        </div>
                        <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${!n.isRead ? 'text-[var(--text-secondary)] font-medium' : 'text-[var(--text-tertiary)]'}`}>
                          {n.message}
                        </p>
                        
                        {!n.isRead && (
                          <button 
                            onClick={() => markAsRead(n.id)}
                            className="mt-2 text-[10px] font-bold text-blue-500 hover:underline"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 text-center border-t border-[var(--border)]" style={{marginTop:"10px"}}>
                <button 
                  className="text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Close Panel
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
