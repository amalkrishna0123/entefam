"use client"

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';

export default function ExpenseChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        const res = await fetch('/api/expenses');
        const expenses = await res.json();
        
        if (Array.isArray(expenses)) {
          const categoryTotals: { [key: string]: number } = {};
          expenses.forEach((exp) => {
            const cat = exp.category || 'Other';
            categoryTotals[cat] = (categoryTotals[cat] || 0) + parseFloat(exp.amount || 0);
          });

          const chartData = Object.keys(categoryTotals).map((cat) => ({
            name: cat,
            amount: categoryTotals[cat],
          }));

          setData(chartData);
        }
      } catch (error) {
        console.error('Failed to fetch expense data for chart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessData();
  }, []);

  if (loading) {
    return <div className="h-[300px] flex items-center justify-center text-[var(--text-tertiary)]">Loading analysis...</div>;
  }

  if (data.length === 0) {
    return <div className="h-[300px] flex items-center justify-center text-[var(--text-tertiary)]">No expense data available.</div>;
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--bg-elevated)', 
              border: '1px solid var(--border)',
              borderRadius: '12px',
              color: 'var(--text-primary)'
            }}
          />
          <Bar dataKey="amount" fill="var(--accent)" radius={[6, 6, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
