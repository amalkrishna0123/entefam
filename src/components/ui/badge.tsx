import * as React from "react"
import { cn } from "@/lib/utils"

type BadgeVariant = "default" | "success" | "warning" | "danger" | "accent" | "outline" | "info"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  default: {
    background: "var(--bg-elevated)",
    color: "var(--text-secondary)",
    border: "1px solid var(--border)",
  },
  success: {
    background: "var(--success-muted)",
    color: "var(--success)",
    border: "1px solid rgba(52, 211, 153, 0.2)",
  },
  warning: {
    background: "var(--warning-muted)",
    color: "var(--warning)",
    border: "1px solid rgba(251, 191, 36, 0.2)",
  },
  danger: {
    background: "var(--danger-muted)",
    color: "var(--danger)",
    border: "1px solid rgba(248, 113, 113, 0.2)",
  },
  accent: {
    background: "var(--accent-muted)",
    color: "var(--text-accent)",
    border: "1px solid var(--border-accent)",
  },
  outline: {
    background: "transparent",
    color: "var(--text-secondary)",
    border: "1px solid var(--border-strong)",
  },
  info: {
    background: "rgba(99,102,241,0.08)",
    color: "rgb(99,102,241)",
    border: "1px solid rgba(99,102,241,0.2)",
  },
}

export function Badge({ className, variant = "default", style, ...props }: BadgeProps) {
  return (
    <span
      className={cn(className)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "var(--radius-full)",
        padding: "2px 10px",
        fontSize: "11px",
        fontWeight: 500,
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
        lineHeight: "1.6",
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    />
  )
}
