"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';

const data = [
  { day: 'Mon', weight: 70, steps: 8000 },
  { day: 'Tue', weight: 69.8, steps: 10000 },
  { day: 'Wed', weight: 70.1, steps: 12000 },
  { day: 'Thu', weight: 69.9, steps: 9000 },
  { day: 'Fri', weight: 69.7, steps: 11000 },
  { day: 'Sat', weight: 70.2, steps: 15000 },
  { day: 'Sun', weight: 70, steps: 7000 },
];

export default function HealthChart() {
  return (
    <ChartContainer>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="steps" stroke="#10b981" strokeWidth={2} />
      </LineChart>
    </ChartContainer>
  );
}
