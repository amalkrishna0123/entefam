"use client";
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { analyzeExpenses } from '@/lib/ai';

export default function AIInsights() {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndAnalyze = async () => {
      try {
        const res = await fetch('/api/expenses');
        const expenses = await res.json();
        
        if (expenses && expenses.length > 0) {
          const aiResponse = await analyzeExpenses(expenses.slice(0, 10));
          setInsight(aiResponse);
        } else {
          setInsight('Not enough data to analyze yet.');
        }
      } catch (error) {
        setInsight('Failed to load insights.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAndAnalyze();
  }, []);

  return (
    <Card variant="premium" className="relative overflow-hidden group">
      {/* Decorative background glow */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-[var(--accent-trust)] opacity-5 blur-3xl rounded-full pointer-events-none group-hover:opacity-10 transition-opacity duration-500" />
      
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center w-full">
          <CardTitle className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <div className="p-1.5 bg-[var(--accent-muted)] rounded-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
            </div>
            AI Suggestions
          </CardTitle>
          <div className="text-[11px] text-[var(--text-tertiary)] font-semibold uppercase tracking-wider">
            Fams Ai
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-[85%]" />
            <Skeleton className="h-3 w-[90%]" />
            <Skeleton className="h-3 w-[60%]" />
          </div>
        ) : (
          <div className="text-[13px] text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed animate-fade-in font-medium">
            {insight}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

