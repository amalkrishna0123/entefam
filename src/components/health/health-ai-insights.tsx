"use client";
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { analyzeHealth } from '@/lib/ai';
import { Sparkles, Bot } from 'lucide-react';

export default function HealthAIInsights() {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndAnalyze = async () => {
      try {
        const res = await fetch('/api/health');
        const metrics = await res.json();
        
        if (metrics && metrics.length > 0) {
          const aiResponse = await analyzeHealth(metrics.slice(0, 15));
          setInsight(aiResponse);
        } else {
          setInsight('Not enough health data to analyze yet. Keep tracking your metrics!');
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
    <Card variant="premium" className="relative overflow-hidden group border-none h-full" style={{marginTop:"20px"}}>
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500 opacity-5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500 opacity-5 blur-[100px] rounded-full pointer-events-none" />
      
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center w-full">
          <CardTitle className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-xl shadow-sm text-white">
              <Sparkles size={16} />
            </div>
            AI Health Insights
          </CardTitle>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--accent-muted)] rounded-full">
            <Bot size={12} className="text-emerald-600" />
            <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wider">
              Powered by AI
            </span>
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
          <div className="text-[14px] text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed animate-fade-in font-medium italic relative pl-4 border-l-2 border-emerald-500/20">
            "{insight}"
          </div>
        )}
      </CardContent>
    </Card>
  );
}
