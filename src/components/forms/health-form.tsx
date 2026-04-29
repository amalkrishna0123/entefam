"use client"
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

export default function HealthForm({ onSuccess, initialData }: { onSuccess?: () => void, initialData?: any }) {
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
      memberId: initialData?.memberId || "",
      metric: initialData?.metric || "Weight",
      value: initialData?.value || "",
      date: initialData?.date || new Date().toISOString().split('T')[0],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const url = initialData?.id ? `/api/health/${initialData.id}` : '/api/health';
      const method = initialData?.id ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      if (res.ok) {
        if (!initialData) {
          form.reset({
            ...values,
            value: "",
          });
        }
        onSuccess?.();
      }
    } catch (e) {
      console.error(e);
    }
  }

  const { formState: { errors, isSubmitting } } = form;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1.5rem' }} className="md:grid-cols-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Label htmlFor="memberId" style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-tertiary)', marginLeft: '0.25rem' }}>Family Member</Label>
          <Select 
            id="memberId" 
            {...form.register("memberId")} 
            disabled={isSubmitting}
            style={{ height: '3rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '0.75rem', paddingLeft: '1rem', width: '100%' }}
          >
            <option value="">Select a member</option>
            {members.map(member => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </Select>
          {errors.memberId && <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--danger)', marginLeft: '0.25rem', margin: 0 }}>{errors.memberId.message}</p>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Label htmlFor="metric" style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-tertiary)', marginLeft: '0.25rem' }}>Metric Type</Label>
          <Select 
            id="metric" 
            {...form.register("metric")} 
            disabled={isSubmitting}
            style={{ height: '3rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '0.75rem', paddingLeft: '1rem', width: '100%' }}
          >
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
          {errors.metric && <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--danger)', marginLeft: '0.25rem', margin: 0 }}>{errors.metric.message}</p>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1.5rem' }} className="md:grid-cols-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Label htmlFor="value" style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-tertiary)', marginLeft: '0.25rem' }}>Recorded Value</Label>
          <Input 
            id="value" 
            placeholder="e.g. 70 kg" 
            {...form.register("value")} 
            disabled={isSubmitting} 
            style={{ height: '3rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '0.75rem', paddingLeft: '1rem', paddingRight: '1rem', fontWeight: 500, width: '100%' }}
          />
          {errors.value && <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--danger)', marginLeft: '0.25rem', margin: 0 }}>{errors.value.message}</p>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Label htmlFor="date" style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-tertiary)', marginLeft: '0.25rem' }}>Log Date</Label>
          <Input 
            id="date" 
            type="date" 
            {...form.register("date")} 
            disabled={isSubmitting} 
            style={{ height: '3rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '0.75rem', paddingLeft: '1rem', paddingRight: '1rem', fontWeight: 500, width: '100%' }}
          />
          {errors.date && <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--danger)', marginLeft: '0.25rem', margin: 0 }}>{errors.date.message}</p>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem' }}>
        <Button 
          type="button" 
          variant="outline" 
          style={{ flex: 1, height: '3rem', borderRadius: '0.75rem', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontWeight: 'bold', backgroundColor: 'transparent', cursor: 'pointer' }} 
          onClick={onSuccess}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          style={{ flex: 1, height: '3rem', borderRadius: '0.75rem', backgroundColor: 'var(--accent)', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(var(--accent-rgb), 0.2)' }} 
          loading={isSubmitting}
        >
          Save Record
        </Button>
      </div>
    </form>
  )
}

