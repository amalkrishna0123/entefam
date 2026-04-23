"use client"
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RowSkeleton } from '@/components/ui/skeleton';

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
    <Card className="flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center w-full">
          <CardTitle className="text-sm font-bold text-[var(--text-primary)]">Health Activity</CardTitle>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--success-muted)] border border-[var(--success)]" style={{padding:"5px 10px"}}>
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
            <span className="text-[10px] font-bold text-[var(--success)] uppercase tracking-tight">Active</span>
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
              No recent health logs.
            </div>
          ) : (
            <div className="flex flex-col">
              {alerts.slice(0, 3).map((alert, i) => (
                <div key={i} className="flex justify-between items-center p-4 px-6 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-hover)] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--success-muted)] flex items-center justify-center border border-[rgba(5,150,105,0.1)]">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-[var(--text-primary)] text-[15px]">
                        {alert.metric || alert.message || "Log entry"}
                      </div>
                      <div className="text-[13px] text-[var(--text-secondary)] font-medium mt-0.5">
                        {alert.value}
                      </div>
                    </div>
                  </div>
                  <div className="text-[12px] text-[var(--text-tertiary)] font-bold tracking-tight">
                    {alert.date || alert.createdAt?.split('T')[0] || "Just now"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

