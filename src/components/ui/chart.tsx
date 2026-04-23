"use client"

import * as React from "react"
import { ResponsiveContainer } from "recharts"

const ChartContainer = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  )
}

export { ChartContainer }
