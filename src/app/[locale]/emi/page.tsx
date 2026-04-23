"use client"

import { useState } from 'react';
import EMIForm from '@/components/forms/emi-form';
import EmiList from '@/components/emi/emi-list';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function EMIPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-12 animate-fade-in py-4">
      <div className="flex flex-col gap-3" style={{marginBottom:"20px"}}>
        <h1 className="text-3xl md:text-5xl tracking-tight text-[var(--text-primary)]" style={{ fontWeight: 400 }}>
          EMI & Loans
        </h1>
        <p className="text-[var(--text-secondary)] text-xl font-medium">
          Manage your monthly installments and credit payments.
        </p>
      </div>
      
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
