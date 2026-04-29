"use client";
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { analyzeExpenses } from '@/lib/ai';
import { Sparkles, Bot } from 'lucide-react';

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
          setInsight('Not enough data to analyze yet. Keep tracking your expenses!');
        }
      } catch (error) {
        setInsight('Failed to load insights. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAndAnalyze();
  }, []);

  return (
    <Card variant="premium" className="relative overflow-hidden group border-none" style={{marginTop:"15px"}}>
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500 opacity-5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500 opacity-5 blur-[100px] rounded-full pointer-events-none" />
      
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center w-full">
          <CardTitle className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <div className="p-2 text-[#facc15] rounded-[5px] shadow-sm bg-[#111111ff]">
              <Sparkles size={18} />
            </div>
            AI Insights & Suggestions
          </CardTitle>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--accent-muted)] rounded-full">
            <Bot size={18} className="text-[#111111ff]" />
            {/* <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wider">
              Powered by AI
            </span> */}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-3 w-full rounded-full" />
            <Skeleton className="h-3 w-[85%] rounded-full" />
            <Skeleton className="h-3 w-[90%] rounded-full" />
            <Skeleton className="h-3 w-[60%] rounded-full" />
          </div>
        ) : (
          <div className="text-[14px] text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed animate-fade-in font-medium italic relative pl-4 border-l-2 border-blue-500/20">
            "{insight}"
          </div>
        )}
      </CardContent>
    </Card>
  );
}


