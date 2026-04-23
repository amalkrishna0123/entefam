"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNotifications } from "@/hooks/use-notifications"

const formSchema = z.object({
  title: z.string().min(2, "Title is required"),
  date: z.string().min(1, "Date is required"),
  location: z.string().optional(),
})

export default function EventForm({ onSuccess }: { onSuccess?: () => void }) {
  const { sendNotification } = useNotifications();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      date: new Date().toISOString().split('T')[0],
      location: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      if (res.ok) {
        form.reset({
          ...values,
          title: "",
          location: "",
        });
        onSuccess?.();
        sendNotification(
          "✅ Event Scheduled",
          `"${values.title}" has been added to your calendar.`
        );
      }
    } catch (e) {
      console.error(e);
    }
  }

  const { formState: { errors, isSubmitting } } = form;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">Event Title</Label>
        <Input id="title" placeholder="What's happening?" {...form.register("title")} disabled={isSubmitting} />
        {errors.title && <p className="text-[11px] text-[var(--danger)]">{errors.title.message}</p>}
      </div>
      <div className="space-y-2" style={{marginTop:"15px"}}>
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="date" {...form.register("date")} disabled={isSubmitting} />
        {errors.date && <p className="text-[11px] text-[var(--danger)]">{errors.date.message}</p>}
      </div>
      <div className="space-y-2" style={{marginTop:"15px"}}>
        <Label htmlFor="location">Location (Optional)</Label>
        <Input id="location" placeholder="Where is it?" {...form.register("location")} disabled={isSubmitting} />
      </div>
      <Button type="submit" className="w-full mt-2" style={{marginTop:"15px"}} loading={isSubmitting}>
        Create Event
      </Button>
    </form>
  )
}

