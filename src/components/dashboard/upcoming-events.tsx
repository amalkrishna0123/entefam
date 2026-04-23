"use client"
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RowSkeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function UpcomingEvents() {
  const [events, setEvents] = useState<any[] | null>(null);

  useEffect(() => {
    fetch('/api/events').then(r => r.json()).then(data => {
      setEvents(Array.isArray(data) ? data : []);
    }).catch(e => {
      console.error(e);
      setEvents([]);
    });
  }, []);

  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader className="border-b border-[var(--border)]">
        <div className="flex justify-between items-center w-full">
          <CardTitle>Upcoming Events</CardTitle>
          <button className="text-[12px] text-black font-bold hover:underline uppercase tracking-wider">View All</button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <div className="flex flex-col">
          {events === null ? (
            <div className="p-4 space-y-3">
              <RowSkeleton lines={2} />
              <RowSkeleton lines={2} />
              <RowSkeleton lines={2} />
            </div>
          ) : events.length === 0 ? (
            <div className="p-10 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <p className="text-[13px] text-[var(--text-secondary)]">No upcoming events planned.</p>
            </div>
          ) : (
            <div>
              {events.slice(0, 4).map((event, i) => (
                <div key={i} className="flex items-center justify-between p-4 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-hover)] transition-colors group" style={{marginTop:"10px"}}>
                  <div className="flex items-center gap-4">
                    {/* Date icon */}
                    <div className="w-12 h-12 rounded-xl bg-black flex flex-col items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-lg font-bold text-white leading-none">
                        {new Date(event.date).getDate() || '-'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-[var(--text-primary)] text-[14px]">{event.title}</div>
                      <div className="text-[12px] text-[var(--text-secondary)] mt-0.5 flex items-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {event.date}
                      </div>
                    </div>
                  </div>
                  <Badge variant="accent">
                    {event.location || event.label || "Planned"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

