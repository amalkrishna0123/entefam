import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, style, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn("w-full transition-all", className)}
        style={{
          height: "46px",
          padding: "0 16px",
          fontSize: "15px",
          fontWeight: 500,
          background: "var(--bg-surface)",
          color: "var(--text-primary)",
          border: "1px solid var(--border-strong)",
          borderRadius: "var(--radius-md)",
          outline: "none",
          transition: "all var(--duration-fast) var(--ease-out)",
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--accent)"
          e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-muted)"
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--border)"
          e.currentTarget.style.boxShadow = "none"
          props.onBlur?.(e)
        }}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

