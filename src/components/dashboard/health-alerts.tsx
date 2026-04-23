"use client"
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RowSkeleton } from '@/components/ui/skeleton';
import { Activity, Heart, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HealthAlerts() {
  const [alerts, setAlerts] = useState<any[] | null>(null);

  useEffect(() => {
    fetch('/api/health').then(r => r.json()).then(data => {
      setAlerts(Array.isArray(data) ? data : []);
    }).catch(e => {
      console.error(e);
      setAlerts([]);
    });
  }, []);

  return (
    <Card className="db-card">
      <CardHeader className="db-card__header db-card__header--muted">
        <div className="db-card__header-row">
          <CardTitle className="db-card__title">
            <Activity size={18} className="text-emerald-600" />
            Health Activity
          </CardTitle>
          <div className="db-card__status-pill db-card__status-pill--emerald">
            <Heart size={10} fill="currentColor" />
            <span>Active</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="db-card__body db-card__body--flush">
        {alerts === null ? (
          <div className="db-card__skeleton-wrap">
            <RowSkeleton lines={1} />
            <RowSkeleton lines={1} />
          </div>
        ) : alerts.length === 0 ? (
          <div className="db-card__empty">
            <div className="db-card__empty-icon">
              <Activity size={24} strokeWidth={1.5} />
            </div>
            <p className="db-card__empty-text">No recent health logs.</p>
          </div>
        ) : (
          <div className="db-list">
            {alerts.slice(0, 3).map((alert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="db-list__item"
              >
                <div className="db-health__icon-wrap">
                  <Activity size={16} strokeWidth={2.5} />
                </div>
                <div className="db-health__info">
                  <div className="db-health__metric">
                    {alert.metric || alert.message || "Log entry"}
                  </div>
                  <div className="db-health__value">{alert.value}</div>
                </div>
                <div className="db-health__date-chip">
                  <Clock size={10} />
                  {alert.date || alert.createdAt?.split('T')[0] || "Just now"}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
