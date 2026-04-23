"use client"
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatCardSkeleton } from '@/components/ui/skeleton';

export default function ExpenseSummary() {
  const [totalSpent, setTotalSpent] = useState<number | null>(null);
  const [activeEmis, setActiveEmis] = useState<number>(0);
  const [eventsThisMonth, setEventsThisMonth] = useState<number>(0);

  useEffect(() => {
    // Parallel fetch for dashboard summary items
    Promise.all([
      fetch('/api/expenses').then(r => r.json()),
      fetch('/api/emi').then(r => r.json()),
      fetch('/api/events').then(r => r.json())
    ]).then(([expensesData, emiData, eventsData]) => {
      
      if (Array.isArray(expensesData)) {
        const total = expensesData.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
        setTotalSpent(total);
      } else {
        setTotalSpent(0);
      }

      if (Array.isArray(emiData)) {
        setActiveEmis(emiData.length);
      }

      if (Array.isArray(eventsData)) {
        // Just mocking current month logic for UI purposes
        setEventsThisMonth(eventsData.length);
      }
    }).catch(e => {
      console.error("Dashboard fetch error:", e);
      setTotalSpent(0);
    });
  }, []);

  if (totalSpent === null) {
    return (
      <>
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </>
    );
  }

  const budget = 5000;
  const isOverBudget = totalSpent > budget;
  const remaining = budget - totalSpent;

  const stats = [
    { 
      label: 'Total Spent', 
      value: `₹${totalSpent.toLocaleString('en-IN')}`, 
      accent: true, 
      change: isOverBudget ? 'Budget Exceeded' : '', 
      changeType: isOverBudget ? 'danger' : 'neutral' 
    },
    { 
      label: 'Remaining Budget', 
      value: `₹${Math.max(0, remaining).toLocaleString('en-IN')}`, 
      change: `Limit: ₹${budget.toLocaleString('en-IN')}`, 
      changeType: isOverBudget ? 'danger' : 'neutral' 
    },
    { label: 'Active EMIs', value: String(activeEmis), change: '', changeType: 'neutral' },
    { label: 'Upcoming Events', value: String(eventsThisMonth), change: 'This month', changeType: 'success' },
  ];

  return (
    <>
      {stats.map((stat, i) => (
        <Card key={i} variant={stat.accent ? "elevated" : "default"} className="relative overflow-hidden group border-none">
          {stat.accent && (
            <div className="absolute top-0 left-0 w-full h-1 bg-[var(--accent-trust)]" />
          )}
          <CardHeader className="pb-2">
            <CardTitle className="text-[13px] font-bold text-[var(--text-tertiary)]">
              {stat.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-4xl font-extrabold tracking-tighter text-[var(--text-primary)] font-sans`}>
              {stat.value}
            </div>
            {stat.change && (
              <div style={{
                fontSize: "12px",
                marginTop: "6px",
                fontWeight: 500,
                color: stat.changeType === 'danger' ? 'var(--danger)' :
                       stat.changeType === 'success' ? 'var(--success)' :
                       stat.changeType === 'warning' ? 'var(--warning)' : 'var(--text-secondary)'
              }}>
                {stat.change}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </>
  );
}

