"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNotifications } from "@/hooks/use-notifications"

const formSchema = z.object({
  emiName: z.string().min(2, "EMI Name is required"),
  amount: z.string().min(1, "Amount is required"),
  dueDate: z.string().min(1, "Due date is required"),
})

export default function EMIForm({ onSuccess }: { onSuccess?: () => void }) {
  const { sendNotification } = useNotifications();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emiName: "",
      amount: "",
      dueDate: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch('/api/emi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      if (res.ok) {
        form.reset({
          ...values,
          emiName: "",
          amount: "",
        });
        onSuccess?.();
        sendNotification(
          "✅ EMI Alert Set",
          `Alert for "${values.emiName}" (₹${parseFloat(values.amount).toLocaleString("en-IN")}) has been set.`
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
        <Label htmlFor="emiName">EMI Name</Label>
        <Input id="emiName" placeholder="e.g. Home Loan" {...form.register("emiName")} disabled={isSubmitting} />
        {errors.emiName && <p className="text-[11px] text-[var(--danger)]">{errors.emiName.message}</p>}
      </div>
      <div className="space-y-2 relative" style={{marginTop:"15px"}}>
        <Label htmlFor="amount">Monthly Amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] font-medium">₹</span>
          <Input id="amount" type="number" step="0.01" style={{ paddingLeft: "28px" }} placeholder="0.00" {...form.register("amount")} disabled={isSubmitting} />
        </div>
        {errors.amount && <p className="text-[11px] text-[var(--danger)]">{errors.amount.message}</p>}
      </div>
      <div className="space-y-2" style={{marginTop:"15px"}}>
        <Label htmlFor="dueDate">Due Date (Day of Month)</Label>
        <Input id="dueDate" type="number" min="1" max="31" placeholder="1" {...form.register("dueDate")} disabled={isSubmitting} />
        {errors.dueDate && <p className="text-[11px] text-[var(--danger)]">{errors.dueDate.message}</p>}
      </div>
      <Button type="submit" className="w-full mt-2" style={{marginTop:"15px"}} loading={isSubmitting}>
        Set EMI Alert
      </Button>
    </form>
  )
}

