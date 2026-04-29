"use client"
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RowSkeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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
    <Card className="db-card db-card--stretch">
      <CardHeader className="db-card__header">
        <div className="db-card__header-row">
          <CardTitle className="db-card__title">
            <CalendarDays size={18} className="text-yellow-600" />
            Upcoming Events
          </CardTitle>
          <Link href="/events" className="db-card__action-btn">
            View All <ChevronRight size={12} />
          </Link>
        </div>
      </CardHeader>

      <CardContent className="db-card__body db-card__body--flush">
        {events === null ? (
          <div className="db-card__skeleton-wrap">
            <RowSkeleton lines={2} />
            <RowSkeleton lines={2} />
            <RowSkeleton lines={2} />
          </div>
        ) : events.length === 0 ? (
          <div className="db-card__empty">
            <div className="db-card__empty-icon">
              <CalendarDays size={32} strokeWidth={1.5} />
            </div>
            <p className="db-card__empty-text">No upcoming events planned.</p>
            <button className="db-card__empty-cta">Add one now</button>
          </div>
        ) : (
          <div className="db-list">
            {[...events]
              .sort((a, b) => {
                const priorityOrder: Record<string, number> = { 'High': 0, 'Medium': 1, 'Low': 2 };
                const aP = priorityOrder[a.priority] ?? 3;
                const bP = priorityOrder[b.priority] ?? 3;
                if (aP !== bP) return aP - bP;
                return new Date(a.date).getTime() - new Date(b.date).getTime();
              })
              .slice(0, 2).map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="db-list__item group"
              >
                {/* Date badge */}
                <div className="db-event__date-badge">
                  <span className="db-event__date-month">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="db-event__date-day">
                    {new Date(event.date).getDate() || '-'}
                  </span>
                </div>

                {/* Info */}
                <div className="db-event__info">
                  <div className="db-event__title">{event.title}</div>
                  <div className="db-event__meta">
                    <span className="db-event__meta-item">
                      <Clock size={12} />
                      {event.time || "All day"}
                    </span>
                    {event.location && (
                      <span className="db-event__meta-item">
                        <MapPin size={12} />
                        {event.location}
                      </span>
                    )}
                  </div>
                </div>

                {/* Badge */}
                <div className="db-event__badge-wrap">
                  <Badge
                    variant={event.priority === "High" ? "accent" : "outline"}
                    className={cn(
                      "db-event__category-badge",
                      event.priority === "High" && "bg-red-500/10 text-red-500 border-red-500/20"
                    )}
                  >
                    {event.priority ? `${event.priority} Priority` : (event.category || "General")}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
