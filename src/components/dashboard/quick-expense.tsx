"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function QuickExpense() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddExpense = async () => {
    if (!amount || !description) return;
    setLoading(true);
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, description, category: 'Quick', date: new Date().toISOString().split('T')[0] })
      });
      if (res.ok) {
        setAmount('');
        setDescription('');
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }
    } catch(err) {
      console.error('Failed to add quick expense', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="relative overflow-hidden group">
      {success && (
        <div className="absolute inset-0 bg-[var(--success-muted)] flex items-center justify-center z-10 animate-fade-in backdrop-blur-md">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-[var(--success)] flex items-center justify-center text-white shadow-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <span className="text-sm font-bold text-[var(--success)]">Expense Added</span>
          </div>
        </div>
      )}
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center w-full">
          <CardTitle className="text-sm font-bold text-[var(--text-primary)]">Quick Expense</CardTitle>
          <div className="px-3 py-0 bg-[var(--accent-muted)] rounded-lg" style={{padding:"5px 10px"}}>
            ₹
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] font-bold text-lg">₹</span>
            <Input 
              placeholder="0.00" 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              style={{ paddingLeft: "36px" }}
              disabled={loading}
            />
          </div>
          <Input 
            placeholder="What was this for?" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            disabled={loading}
          />
          <Button 
            variant="trust"
            className="w-full mt-2" 
            onClick={handleAddExpense} 
            loading={loading}
            disabled={!amount || !description}
          >
            Record Expense
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

