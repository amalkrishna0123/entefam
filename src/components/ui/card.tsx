import * as React from "react"
import { cn } from "@/lib/utils"

type CardVariant = "default" | "glass" | "flat" | "elevated" | "premium"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
}

const variantMap: Record<CardVariant, React.CSSProperties> = {
  default: {
    background: "var(--bg-surface)",
    border: "1px solid var(--border)",
    boxShadow: "var(--shadow-sm)",
  },
  elevated: {
    background: "var(--bg-elevated)",
    border: "1px solid var(--border)",
    boxShadow: "var(--shadow-md)",
  },
  glass: {
    background: "rgba(255,255,255,0.02)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid var(--border)",
    boxShadow: "var(--shadow-sm)",
  },
  flat: {
    background: "transparent",
    border: "none",
    boxShadow: "none",
  },
  premium: {
    background: "var(--bg-surface)",
    border: "1px solid var(--border-strong)",
    boxShadow: "var(--shadow-lg)",
  },
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-2xl transition-all duration-300 hover:shadow-md", className)}
      style={{
        ...variantMap[variant],
        borderRadius: "var(--radius-xl)",
        ...style,
      }}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col", className)}
    style={{ padding: "20px 24px 12px", gap: "4px", ...style }}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, style, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none", className)}
    style={{
      fontSize: "15px",
      letterSpacing: "-0.02em",
      color: "var(--text-primary)",
      ...style,
    }}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, style, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(className)}
    style={{ fontSize: "13px", color: "var(--text-secondary)", ...style }}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    style={{ padding: "0 24px 20px", ...style }}
    {...props}
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center", className)}
    style={{
      padding: "12px 24px 20px",
      borderTop: "1px solid var(--border)",
      ...style,
    }}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }

