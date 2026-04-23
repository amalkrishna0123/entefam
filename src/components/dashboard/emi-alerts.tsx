"use client"
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RowSkeleton } from '@/components/ui/skeleton';

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
    <Card className="flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center w-full">
          <CardTitle className="text-sm font-bold text-[var(--text-primary)]">EMI Alerts</CardTitle>
          <div className="flex items-center gap-1.5 py-0.5 rounded-full bg-[var(--warning-muted)] border border-[var(--warning)]" style={{padding:"5px 10px"}}>
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--warning)]" />
            <span className="text-[10px] font-bold text-[var(--warning)] uppercase tracking-tight">Attention</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col">
          {alerts === null ? (
            <div className="p-4 space-y-3">
              <RowSkeleton lines={1} />
              <RowSkeleton lines={1} />
            </div>
          ) : alerts.length === 0 ? (
            <div className="p-6 text-center text-[13px] text-[var(--text-secondary)]">
              No active EMIs tracking.
            </div>
          ) : (
            <div>
              {alerts.slice(0, 3).map((alert, i) => {
                // Mock status badge logic
                const isOverdue = false; 
                const variant = isOverdue ? "danger" : "warning";
                
                return (
                  <div key={i} className="flex justify-between items-center p-4 px-6 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-hover)] transition-colors">
                    <div>
                      <div className="font-bold text-[var(--text-primary)] text-[15px]">
                        {alert.emiName || alert.title || 'EMI Due'}
                      </div>
                      <div className="text-[12px] text-[var(--text-secondary)] font-medium mt-0.5">
                        Due: {alert.dueDate || '-'}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="font-bold text-[var(--text-primary)] text-[16px] tracking-tight">
                        ₹{alert.amount || '0'}
                      </div>
                      <Badge variant={variant} style={{ padding: "1px 8px", fontSize: "10px", fontWeight: 700 }}>
                        PENDING
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

