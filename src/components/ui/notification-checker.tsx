"use client"

import { useEffect, useRef } from 'react';
import { useNotification } from './notification-manager';

export function NotificationChecker() {
  const { notify } = useNotification();
  const checkedRef = useRef(false);

  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;

    const checkDues = async () => {
      try {
        // Check EMIs
        const emiRes = await fetch('/api/emi');
        const emis = await emiRes.json();
        
        if (Array.isArray(emis)) {
          const today = new Date().getDate();
          emis.forEach((emi) => {
            const dueDate = parseInt(emi.dueDate);
            if (dueDate === today) {
              notify({
                title: 'EMI Due Today',
                message: `Your EMI for "${emi.emiName}" (₹${emi.amount}) is due today!`,
                type: 'warning'
              });
            } else if (dueDate < today) {
              notify({
                title: 'EMI Overdue',
                message: `Your EMI for "${emi.emiName}" (₹${emi.amount}) was due on day ${dueDate}.`,
                type: 'danger'
              });
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
          const todayStr = now.toISOString().split('T')[0];

          events.forEach((event) => {
            if (event.date === tomorrowStr) {
              notify({
                title: 'Upcoming Event Tomorrow',
                message: `Reminder: "${event.title}" is happening tomorrow!`,
                type: 'info'
              });
            } else if (event.date === todayStr) {
               notify({
                title: 'Event Today',
                message: `"${event.title}" is happening today!`,
                type: 'success'
              });
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
