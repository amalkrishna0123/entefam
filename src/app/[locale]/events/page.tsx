"use client"

import { useState } from 'react';
import EventForm from '@/components/forms/event-form';
import EventList from '@/components/events/event-list';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import NotificationBanner, { NotificationGrantedPill, NotificationDeniedPill } from '@/components/ui/notification-banner';
import { useNotifications } from '@/hooks/use-notifications';
import { useEffect } from 'react';

export default function EventsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { checkAndNotifyEvents } = useNotifications();

  useEffect(() => {
    checkAndNotifyEvents();
  }, [checkAndNotifyEvents]);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-12 animate-fade-in py-4">
        <div className="flex items-center justify-between" style={{marginBottom:"20px"}}>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-5xl tracking-tight text-[var(--text-primary)]" style={{ fontWeight: 500 }}>
              Events
            </h1>
            <p className="hidden md:block text-[var(--text-secondary)] text-lg font-medium">
              Keep track of important family dates and gatherings.
            </p>
          </div>
          <div className="flex gap-2">
            <NotificationGrantedPill />
            <NotificationDeniedPill />
          </div>
        </div>
      
      <NotificationBanner onGranted={() => checkAndNotifyEvents()} />
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Create New Event</CardTitle>
            </CardHeader>
            <CardContent>
              <EventForm onSuccess={handleSuccess} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Upcoming Events</h2>
            <EventList key={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  );
}
