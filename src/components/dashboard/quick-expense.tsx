"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Zap, IndianRupee, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
        body: JSON.stringify({
          amount,
          description,
          category: 'Quick',
          date: new Date().toISOString().split('T')[0]
        })
      });
      if (res.ok) {
        setAmount('');
        setDescription('');
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to add quick expense', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="db-card db-card--relative">
      {/* Success overlay */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="db-card__success-overlay"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="db-card__success-icon"
            >
              <CheckCircle2 size={32} />
            </motion.div>
            <span className="db-card__success-text">Expense Recorded!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <CardHeader className="db-card__header">
        <div className="db-card__header-row">
          <CardTitle className="db-card__title">
            <div className="db-card__title-icon db-card__title-icon--orange">
              <Zap size={14} fill="currentColor" />
            </div>
            Quick Expense
          </CardTitle>
          <div className="db-card__badge-icon">
            <IndianRupee size={12} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="db-card__body">
        <div className="qe-form">
          {/* Amount field */}
          <div className="qe-form__amount-wrap">
            <div className="qe-form__currency-icon">
              <IndianRupee size={18} strokeWidth={3} />
            </div>
            <Input
              id="qe-amount"
              placeholder="0.00"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="qe-form__amount-input"
              disabled={loading}
            />
          </div>

          {/* Description field */}
          <Input
            id="qe-description"
            placeholder="Description (e.g. Coffee, Milk)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="qe-form__text-input"
            disabled={loading}
          />

          {/* Submit */}
          <Button
            id="qe-submit"
            className="qe-form__submit"
            style={{ background: "#0f172a", color: "white" }}
            onClick={handleAddExpense}
            disabled={!amount || !description || loading}
          >
            {loading ? "Recording…" : "Record Expense"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
