import * as React from "react"
import { cn } from "@/lib/utils"

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, style, ...props }, ref) => (
  <div style={{ position: "relative", width: "100%" }}>
    <select
      ref={ref}
      className={cn("w-full transition-all appearance-none", className)}
      style={{
        height: "46px",
        padding: "0 40px 0 16px",
        fontSize: "15px",
        fontWeight: 500,
        background: "var(--bg-surface)",
        color: "var(--text-primary)",
        border: "1px solid var(--border-strong)",
        borderRadius: "var(--radius-md)",
        outline: "none",
        cursor: "pointer",
        transition: "all var(--duration-fast) var(--ease-out)",
        ...style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "var(--accent)"
        e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-muted)"
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "var(--border-strong)"
        e.currentTarget.style.boxShadow = "none"
      }}
      {...props}
    >
      {children}
    </select>
    {/* Custom chevron */}
    <svg
      width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  </div>
))
Select.displayName = "Select"

export { Select }
