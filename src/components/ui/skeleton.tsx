import * as React from "react"
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Rounded pill shape */
  pill?: boolean
}

export function Skeleton({ className, pill, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-skeleton",
        pill ? "rounded-full" : "rounded-lg",
        className
      )}
      style={{
        background: "linear-gradient(90deg, var(--bg-elevated) 0%, var(--bg-hover) 50%, var(--bg-elevated) 100%)",
        backgroundSize: "200% 100%",
      }}
      {...props}
    />
  )
}

/** Pre-built skeleton for a stat card */
export function StatCardSkeleton() {
  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "20px",
      }}
    >
      <Skeleton className="h-3 w-24 mb-4" />
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  )
}

/** Pre-built skeleton for a list row */
export function RowSkeleton({ lines = 2 }: { lines?: number }) {
  return (
    <div
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <Skeleton className="h-8 w-8 shrink-0" style={{ borderRadius: "var(--radius-md)" }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
        <Skeleton className="h-3 w-40" />
        {lines > 1 && <Skeleton className="h-3 w-24" />}
      </div>
      <Skeleton pill className="h-5 w-16" />
    </div>
  )
}
