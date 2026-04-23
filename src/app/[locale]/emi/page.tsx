"use client"

import { useState } from 'react';
import EMIForm from '@/components/forms/emi-form';
import EmiList from '@/components/emi/emi-list';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import NotificationBanner, { NotificationGrantedPill, NotificationDeniedPill } from '@/components/ui/notification-banner';
import { useNotifications } from '@/hooks/use-notifications';
import { useEffect } from 'react';

export default function EMIPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { checkAndNotifyEmis } = useNotifications();

  useEffect(() => {
    checkAndNotifyEmis();
  }, [checkAndNotifyEmis]);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-12 animate-fade-in py-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl md:text-5xl tracking-tight text-[var(--text-primary)]" style={{ fontWeight: 400 }}>
              EMI & Loans
            </h1>
            <p className="text-[var(--text-secondary)] text-lg font-medium">
              Manage your monthly installments and credit payments.
            </p>
          </div>
          <div className="flex gap-2">
            <NotificationGrantedPill />
            <NotificationDeniedPill />
          </div>
        </div>
      
      <NotificationBanner onGranted={() => checkAndNotifyEmis()} />
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Add EMI Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <EMIForm onSuccess={handleSuccess} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]" style={{marginBottom:"20px"}}>Active EMIs</h2>
            <EmiList key={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  );
}
