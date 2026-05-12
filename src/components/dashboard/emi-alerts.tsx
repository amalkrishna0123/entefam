"use client"
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RowSkeleton } from '@/components/ui/skeleton';
import { CreditCard, AlertCircle, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { differenceInDays, parseISO, isPast, isToday, isValid, setDate } from 'date-fns';
import { formatDate } from '@/lib/date-utils';

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

  const getEmiStatus = (dueDateStr: string) => {
    try {
      if (!dueDateStr) return "future";
      let dueDate: Date;
      if (/^\d+$/.test(dueDateStr)) {
        dueDate = setDate(new Date(), parseInt(dueDateStr));
      } else {
        dueDate = parseISO(dueDateStr);
      }
      if (!isValid(dueDate)) return "future";
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (isPast(dueDate) || isToday(dueDate)) return "pending";
      
      const diff = differenceInDays(dueDate, today);
      return diff <= 7 ? "pending" : "future";
    } catch {
      return "future";
    }
  };

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
            {alerts
              .filter(alert => alert.status !== "Closed")
              .slice(0, 2)
              .map((alert, i) => {
                const statusType = getEmiStatus(alert.dueDate);
                return (
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
                        <span className={`db-emi__dot ${statusType === 'pending' ? 'bg-orange-500' : 'bg-green-500'}`} />
                        Next: {alert.dueDate ? formatDate(alert.dueDate) : '-'}
                      </div>
                    </div>
                    <div className="db-emi__amount-col">
                      <div className="db-emi__amount">
                        <IndianRupee size={14} />
                        {alert.amount || '0'}
                      </div>
                      <Badge 
                        variant={statusType === "pending" ? "warning" : "success"} 
                        className={cn(
                          "db-emi__badge",
                          statusType === "future" && "bg-green-500/10 text-green-600 border-green-500/20"
                        )}
                      >
                        {statusType === "pending" ? "PENDING" : "SCHEDULED"}
                      </Badge>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
