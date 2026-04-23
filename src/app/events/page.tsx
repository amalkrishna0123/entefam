"use client"

import { useState } from 'react';
import EventForm from '@/components/forms/event-form';
import EventList from '@/components/events/event-list';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function EventsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-12 animate-fade-in py-4">
      <div className="flex flex-col gap-3" style={{marginBottom:"20px"}}>
        <h1 className="text-5xl tracking-tight text-[var(--text-primary)]" style={{ fontWeight: 800 }}>
          Events
        </h1>
        <p className="text-[var(--text-secondary)] text-xl font-medium">
          Keep track of important family dates and gatherings.
        </p>
      </div>
      
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
