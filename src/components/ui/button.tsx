import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "link" | "trust"
  size?: "sm" | "md" | "lg"
  loading?: boolean
}

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, React.CSSProperties> = {
  sm: { height: "36px", padding: "0 14px", fontSize: "13px", borderRadius: "var(--radius-md)" },
  md: { height: "46px", padding: "0 20px", fontSize: "15px", borderRadius: "var(--radius-md)" },
  lg: { height: "54px", padding: "0 28px", fontSize: "16px", borderRadius: "var(--radius-lg)" },
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, React.CSSProperties> = {
  default: {
    background: "var(--accent)",
    color: "#fff",
    border: "none",
    boxShadow: "var(--shadow-md)",
  },
  outline: {
    background: "transparent",
    color: "var(--text-primary)",
    border: "1px solid var(--border-strong)",
  },
  ghost: {
    background: "transparent",
    color: "var(--text-secondary)",
    border: "none",
  },
  destructive: {
    background: "var(--danger)",
    color: "#fff",
    border: "none",
  },
  link: {
    background: "transparent",
    color: "var(--text-accent)",
    border: "none",
    textDecoration: "underline",
    textUnderlineOffset: "4px",
    boxShadow: "none",
  },
  trust: {
    background: "var(--accent-trust)",
    color: "#fff",
    border: "none",
    boxShadow: "var(--shadow-md)",
  },
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", loading, disabled, children, style, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all focus-visible:outline-none",
          "hover:opacity-90 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none",
          "focus-visible:ring-2 focus-visible:ring-offset-2",
          className
        )}
        style={{
          ...sizeStyles[size],
          ...variantStyles[variant ?? "default"],
          cursor: loading ? "wait" : "pointer",
          fontWeight: 700,
          letterSpacing: "-0.01em",
          ...style,
        }}
        {...props}
      >
        {loading && (
          <svg
            width="14" height="14"
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ animation: "spin-slow 0.8s linear infinite", flexShrink: 0 }}
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }

