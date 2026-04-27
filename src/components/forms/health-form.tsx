import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"

const formSchema = z.object({
  memberId: z.string().min(1, "Family member is required"),
  metric: z.string().min(1, "Metric is required"),
  value: z.string().min(1, "Value is required"),
  date: z.string().min(1, "Date is required"),
})

export default function HealthForm({ onSuccess }: { onSuccess?: () => void }) {
  const [members, setMembers] = useState<{id: string, name: string}[]>([])

  useEffect(() => {
    fetch('/api/members')
      .then(res => res.json())
      .then(data => setMembers(data))
      .catch(err => console.error(err))
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      memberId: "",
      metric: "Weight",
      value: "",
      date: new Date().toISOString().split('T')[0],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch('/api/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      if (res.ok) {
        form.reset({
          ...values,
          value: "",
        });
        onSuccess?.();
      }
    } catch (e) {
      console.error(e);
    }
  }

  const { formState: { errors, isSubmitting } } = form;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="memberId">Family Member</Label>
        <Select id="memberId" {...form.register("memberId")} disabled={isSubmitting}>
          <option value="">Select a member</option>
          {members.map(member => (
            <option key={member.id} value={member.id}>{member.name}</option>
          ))}
        </Select>
        {errors.memberId && <p className="text-[11px] text-[var(--danger)]">{errors.memberId.message}</p>}
      </div>
      <div className="space-y-2" style={{marginTop:"15px"}}>
        <Label htmlFor="metric">Metric Type</Label>
        <Select id="metric" {...form.register("metric")} disabled={isSubmitting}>
          <option>Weight</option>
          <option>Height</option>
          <option>BMI</option>
          <option>Blood Pressure</option>
          <option>Heart Rate</option>
          <option>Steps</option>
          <option>Sleep</option>
          <option>Fasting Blood Sugar</option>
          <option>Post-Meal Blood Sugar</option>
          <option>Temperature</option>
          <option>Blood Oxygen</option>
          <option>Other</option>
        </Select>
        {errors.metric && <p className="text-[11px] text-[var(--danger)]">{errors.metric.message}</p>}
      </div>
      <div className="space-y-2" style={{marginTop:"15px"}}>
        <Label htmlFor="value">Value</Label>
        <Input id="value" placeholder="Enter value" {...form.register("value")} disabled={isSubmitting} />
        {errors.value && <p className="text-[11px] text-[var(--danger)]">{errors.value.message}</p>}
      </div>
      <div className="space-y-2" style={{marginTop:"15px"}}>
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="date" {...form.register("date")} disabled={isSubmitting} />
        {errors.date && <p className="text-[11px] text-[var(--danger)]">{errors.date.message}</p>}
      </div>
      <Button type="submit" className="w-full mt-2" style={{marginTop:"15px"}} loading={isSubmitting}>
        Log Metric
      </Button>
    </form>
  )
}

