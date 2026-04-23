"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  description: z.string().min(2, "Description must be at least 2 characters"),
  category: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
})

export default function ExpenseForm({ onSuccess }: { onSuccess?: () => void }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      description: "",
      category: "Food",
      date: new Date().toISOString().split('T')[0],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      if (res.ok) {
        form.reset({
          ...values,
          amount: "",
          description: "",
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
      <div className="space-y-2 relative">
        <Label htmlFor="amount">Amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] font-medium">₹</span>
          <Input id="amount" placeholder="0.00" type="number" step="0.01" style={{ paddingLeft: "28px" }} {...form.register("amount")} disabled={isSubmitting} />
        </div>
        {errors.amount && <p className="text-[11px] text-[var(--danger)]">{errors.amount.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" placeholder="Where did you spend?" {...form.register("description")} disabled={isSubmitting} />
        {errors.description && <p className="text-[11px] text-[var(--danger)]">{errors.description.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select id="category" {...form.register("category")} disabled={isSubmitting}>
          <option>Food</option>
          <option>Transport</option>
          <option>Rent</option>
          <option>Utilities</option>
          <option>Entertainment</option>
          <option>Other</option>
        </Select>
        {errors.category && <p className="text-[11px] text-[var(--danger)]">{errors.category.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="date" {...form.register("date")} disabled={isSubmitting} />
        {errors.date && <p className="text-[11px] text-[var(--danger)]">{errors.date.message}</p>}
      </div>
      <Button type="submit" className="w-full mt-2" style={{marginTop:"20px"}} loading={isSubmitting}>
        Save Expense
      </Button>
    </form>
  )
}

