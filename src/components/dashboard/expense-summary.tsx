"use client"
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { StatCardSkeleton } from '@/components/ui/skeleton';
import { Wallet, PiggyBank, CreditCard, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ExpenseSummary() {
  const [totalSpent, setTotalSpent] = useState<number | null>(null);
  const [activeEmis, setActiveEmis] = useState<number>(0);
  const [eventsThisMonth, setEventsThisMonth] = useState<number>(0);

  useEffect(() => {
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
      if (Array.isArray(emiData)) setActiveEmis(emiData.length);
      if (Array.isArray(eventsData)) setEventsThisMonth(eventsData.length);
    }).catch(e => {
      console.error("Dashboard fetch error:", e);
      setTotalSpent(0);
    });
  }, []);

  if (totalSpent === null) {
    return (
      <div className="kpi-grid">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    );
  }

  const budget = 5000;
  const isOverBudget = totalSpent > budget;
  const remaining = budget - totalSpent;

  const stats = [
    {
      label: 'Total Spent',
      value: `₹${totalSpent.toLocaleString('en-IN')}`,
      icon: Wallet,
      color: 'blue',
      change: isOverBudget ? 'Budget Exceeded' : 'This month',
      changeType: isOverBudget ? 'danger' : 'neutral'
    },
    {
      label: 'Remaining Budget',
      value: `₹${Math.max(0, remaining).toLocaleString('en-IN')}`,
      icon: PiggyBank,
      color: 'emerald',
      change: `Limit: ₹${budget.toLocaleString('en-IN')}`,
      changeType: isOverBudget ? 'danger' : 'neutral'
    },
    {
      label: 'Active EMIs',
      value: String(activeEmis),
      icon: CreditCard,
      color: 'orange',
      change: 'Monthly billing',
      changeType: 'neutral'
    },
    {
      label: 'Events',
      value: String(eventsThisMonth),
      icon: Calendar,
      color: 'purple',
      change: 'This month',
      changeType: 'success'
    },
  ];

  const colorMap = {
    blue:    { bg: 'rgba(30, 64, 175, 0.08)',   icon: '#1e40af' },
    emerald: { bg: 'rgba(5, 150, 105, 0.08)',   icon: '#059669' },
    orange:  { bg: 'rgba(217, 119, 6, 0.08)',   icon: '#d97706' },
    purple:  { bg: 'rgba(124, 58, 237, 0.08)',  icon: '#7c3aed' },
  };

  return (
    <div className="kpi-grid">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        const colors = colorMap[stat.color as keyof typeof colorMap];

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="kpi-card-wrapper"
          >
            <Card className="kpi-card">
              <CardContent className="kpi-card__content">
                {/* Icon row */}
                <div className="kpi-card__icon-row">
                  <div
                    className="kpi-card__icon-wrap"
                    style={{ background: colors.bg }}
                  >
                    <Icon size={20} color={colors.icon} strokeWidth={2.5} />
                  </div>
                </div>

                {/* Data */}
                <div className="kpi-card__data">
                  <p className="kpi-card__label">{stat.label}</p>
                  <h4 className="kpi-card__value">{stat.value}</h4>
                  {stat.change && (
                    <p
                      className="kpi-card__change"
                      style={{
                        color:
                          stat.changeType === 'danger'  ? 'var(--danger)'  :
                          stat.changeType === 'success' ? 'var(--success)' :
                          stat.changeType === 'warning' ? 'var(--warning)' :
                          'var(--text-tertiary)'
                      }}
                    >
                      {stat.change}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
