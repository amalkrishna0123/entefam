"use client"

import { useEffect, useRef } from 'react';
import { useNotification } from './notification-manager';
import { useNotificationStore } from '@/store/notification-store';

export function NotificationChecker() {
  const { notify } = useNotification();
  const { notifications } = useNotificationStore();
  const checkedRef = useRef(false);

  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;

    const checkDues = async () => {
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        
        const isAlreadyNotified = (title: string) => {
          return notifications.some(n => 
            n.title === title && 
            n.date.startsWith(todayStr)
          );
        };

        // Check EMIs
        const emiRes = await fetch('/api/emi');
        const emis = await emiRes.json();
        
        if (Array.isArray(emis)) {
          const today = new Date().getDate();
          emis.forEach((emi) => {
            const dueDate = parseInt(emi.dueDate);
            const emiTitle = `EMI: ${emi.emiName}`;
            
            if (dueDate === today) {
              const title = `EMI Due Today: ${emi.emiName}`;
              if (!isAlreadyNotified(title)) {
                notify({
                  title,
                  message: `Your EMI for "${emi.emiName}" (₹${emi.amount}) is due today!`,
                  type: 'warning'
                });
              }
            } else if (dueDate < today) {
              const title = `EMI Overdue: ${emi.emiName}`;
              if (!isAlreadyNotified(title)) {
                notify({
                  title,
                  message: `Your EMI for "${emi.emiName}" (₹${emi.amount}) was due on day ${dueDate}.`,
                  type: 'danger'
                });
              }
            }
          });
        }

        // Check Events
        const eventRes = await fetch('/api/events');
        const events = await eventRes.json();

        if (Array.isArray(events)) {
          const now = new Date();
          const tomorrow = new Date(now);
          tomorrow.setDate(now.getDate() + 1);
          
          const tomorrowStr = tomorrow.toISOString().split('T')[0];
          const todayStrReal = now.toISOString().split('T')[0];

          events.forEach((event) => {
            if (event.date === tomorrowStr) {
              const title = `Upcoming Event: ${event.title}`;
              if (!isAlreadyNotified(title)) {
                notify({
                  title,
                  message: `Reminder: "${event.title}" is happening tomorrow!`,
                  type: 'info'
                });
              }
            } else if (event.date === todayStrReal) {
              const title = `Event Today: ${event.title}`;
              if (!isAlreadyNotified(title)) {
                notify({
                  title,
                  message: `"${event.title}" is happening today!`,
                  type: 'success'
                });
              }
            }
          });
        }
      } catch (error) {
        console.error('Failed to check dues:', error);
      }
    };

    // Delay checking slightly to allow initial render to settle
    const timer = setTimeout(checkDues, 2000);
    return () => clearTimeout(timer);
  }, [notify]);

  return null;
}
