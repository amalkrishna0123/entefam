import * as React from "react"
import { cn } from "@/lib/utils"

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, style, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("block", className)}
    style={{
      fontSize: "13px",
      fontWeight: 600,
      letterSpacing: "-0.01em",
      color: "var(--text-primary)",
      marginBottom: "6px",
      ...style,
    }}
    {...props}
  />
))
Label.displayName = "Label"

export { Label }
