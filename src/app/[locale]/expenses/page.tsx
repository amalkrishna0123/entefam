"use client"

import { useState, useEffect } from 'react';
import ExpenseForm from '@/components/forms/expense-form';
import ExpenseChart from '@/components/charts/expense-chart';
import ExpenseList from '@/components/expenses/expense-list';
import AIInsights from '@/components/dashboard/ai-insights';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

export default function ExpensesPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const BUDGET_LIMIT = 5000;

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const res = await fetch('/api/expenses');
        const data = await res.json();
        if (Array.isArray(data)) {
          const total = data.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
          setTotalExpenses(total);
        }
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
      }
    };
    fetchTotal();
  }, [refreshKey]);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  const isOverBudget = totalExpenses > BUDGET_LIMIT;

  return (
    <div className="space-y-12 animate-fade-in py-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
            Expenses
          </h1>
          <p className="text-[var(--text-secondary)] text-lg md:text-xl font-medium">
            Manage and track your family's spending.
          </p>
        </div>

        <div className={`
          p-6 rounded-3xl border transition-all duration-500 min-w-[280px]
          ${isOverBudget 
            ? 'bg-red-500/10 border-red-500/20 text-red-500 shadow-[0_0_40px_rgba(239,68,68,0.05)]' 
            : 'bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--text-primary)] shadow-sm'}
        `}>
          <div className="text-[11px] font-bold uppercase tracking-widest opacity-60 mb-2">
            Total Monthly Spend
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl md:text-4xl font-black tracking-tighter">
              {formatCurrency(totalExpenses)}
            </span>
            <span className="text-sm font-bold opacity-40">
              / {formatCurrency(BUDGET_LIMIT)}
            </span>
          </div>
          {isOverBudget && (
            <div className="mt-2 text-xs font-bold flex items-center gap-1.5 animate-pulse">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              BUDGET EXCEEDED
            </div>
          )}
        </div>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-3 items-start">
        <div className="lg:col-span-1">
          <Card className="h-auto">
            <CardHeader>
              <CardTitle>Add New Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseForm onSuccess={handleSuccess} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseChart key={`chart-${refreshKey}`} />
            </CardContent>
          </Card>
          <AIInsights />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Recent Expenses</h2>
        </div>
        <div className="rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg-surface)]">
          <ExpenseList key={`list-${refreshKey}`} />
        </div>
      </div>
    </div>
  );
}
