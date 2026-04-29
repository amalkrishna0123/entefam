"use client"
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RowSkeleton } from '@/components/ui/skeleton';
import { CreditCard, AlertCircle, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EMIAlerts() {
  const [alerts, setAlerts] = useState<any[] | null>(null);

  useEffect(() => {
    fetch('/api/emi').then(r => r.json()).then(data => {
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
            <CreditCard size={18} className="text-orange-600" />
            EMI Tracking
          </CardTitle>
          <div className="db-card__status-pill db-card__status-pill--orange">
            <AlertCircle size={10} />
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
              <IndianRupee size={24} strokeWidth={1.5} />
            </div>
            <p className="db-card__empty-text">No active EMIs tracking.</p>
          </div>
        ) : (
          <div className="db-list">
            {alerts.slice(0, 2).map((alert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="db-list__item"
              >
                <div className="db-emi__info">
                  <div className="db-emi__name">
                    {alert.emiName || alert.title || 'EMI Due'}
                    {alert.financeProvider && (
                      <span className="ml-2 text-[10px] font-bold text-[var(--text-tertiary)] bg-[var(--bg-elevated)] px-1.5 py-0.5 rounded border border-[var(--border)] uppercase tracking-wider">
                        {alert.financeProvider}
                      </span>
                    )}
                  </div>
                  <div className="db-emi__due">
                    <span className="db-emi__dot" />
                    Next: {alert.dueDate || '-'}
                  </div>
                </div>
                <div className="db-emi__amount-col">
                  <div className="db-emi__amount">
                    <IndianRupee size={14} />
                    {alert.amount || '0'}
                  </div>
                  <Badge variant="warning" className="db-emi__badge">
                    PENDING
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
