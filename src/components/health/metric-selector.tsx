"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const METRICS = [
  "Weight", "Height", "BMI", "Blood Pressure", "Heart Rate", 
  "Steps", "Sleep", "Fasting Blood Sugar", "Post-Meal Blood Sugar", 
  "Temperature", "Blood Oxygen", "Other"
]

interface MetricSelectorProps {
  activeMetric: string
  onChange: (metric: string) => void
}

export default function MetricSelector({ activeMetric, onChange }: MetricSelectorProps) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
      {METRICS.map((metric) => (
        <button
          key={metric}
          onClick={() => onChange(metric)}
          style={{
            padding: '0.625rem 1.25rem',
            borderRadius: '1rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            transition: 'all 0.3s ease',
            border: activeMetric === metric ? '1px solid var(--accent)' : '1px solid var(--border)',
            backgroundColor: activeMetric === metric ? 'var(--accent)' : 'var(--bg-elevated)',
            color: activeMetric === metric ? 'white' : 'var(--text-secondary)',
            boxShadow: activeMetric === metric ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
            cursor: 'pointer'
          }}
        >
          {metric}
        </button>
      ))}
    </div>
  )
}
