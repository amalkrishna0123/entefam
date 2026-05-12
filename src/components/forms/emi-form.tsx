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
  financeProvider: z.string().optional(),
  tenure: z.string().min(1, "Tenure is required"),
})

export default function EMIForm({ onSuccess }: { onSuccess?: () => void }) {
  const { sendNotification } = useNotifications();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emiName: "",
      amount: "",
      dueDate: new Date().toISOString().split('T')[0],
      financeProvider: "Bajaj Finserv",
      tenure: "12",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload = {
        ...values,
        paidInstallments: 0,
        status: "Active"
      };
      const res = await fetch('/api/emi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        form.reset({
          emiName: "",
          amount: "",
          dueDate: new Date().toISOString().split('T')[0],
          financeProvider: "Bajaj Finserv",
          tenure: "12",
        });
        onSuccess?.();
        sendNotification(
          "✅ EMI Alert Set",
          `Alert for "${values.emiName}" (₹${parseFloat(values.amount).toLocaleString("en-IN")}) for ${values.tenure} months has been set.`
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

      <div className="space-y-2" style={{marginTop:"15px"}}>
        <Label htmlFor="financeProvider">Finance Provider</Label>
        <select 
          id="financeProvider" 
          {...form.register("financeProvider")} 
          disabled={isSubmitting}
          style={{
            display: 'block',
            width: '100%',
            borderRadius: '0.75rem',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg-elevated)',
            padding: '0.625rem 1rem',
            color: 'var(--text-primary)',
            transition: 'all 0.3s ease',
            outline: 'none',
          }}
        >
          <option>Bajaj Finserv</option>
          <option>HDB Financial Services</option>
          <option>Muthoot Finance</option>
          <option>Manappuram Finance</option>
          <option>Kerala State Financial Enterprises (KSFE)</option>
          <option>Federal Bank</option>
          <option>South Indian Bank</option>
          <option>Kerala Gramin Bank</option>
          <option>Canara Bank</option>
          <option>SBI</option>
          <option>HDFC Bank</option>
          <option>ICICI Bank</option>
          <option>Other</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4" style={{marginTop:"15px"}}>
        <div className="space-y-2">
          <Label htmlFor="amount">Monthly Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] font-medium">₹</span>
            <Input id="amount" type="number" step="0.01" style={{ paddingLeft: "28px" }} placeholder="0.00" {...form.register("amount")} disabled={isSubmitting} />
          </div>
          {errors.amount && <p className="text-[11px] text-[var(--danger)]">{errors.amount.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="tenure">Tenure (Months)</Label>
          <Input id="tenure" type="number" placeholder="12" {...form.register("tenure")} disabled={isSubmitting} />
          {errors.tenure && <p className="text-[11px] text-[var(--danger)]">{errors.tenure.message}</p>}
        </div>
      </div>
      <div className="space-y-2" style={{marginTop:"15px"}}>
        <Label htmlFor="dueDate">EMI Date</Label>
        <Input 
          id="dueDate" 
          type="date" 
          {...form.register("dueDate")} 
          disabled={isSubmitting}
          className="block w-full rounded-xl border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2.5 text-[var(--text-primary)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
        />
        {errors.dueDate && <p className="text-[11px] text-[var(--danger)]">{errors.dueDate.message}</p>}
      </div>
      <Button type="submit" className="w-full mt-2" style={{marginTop:"15px"}} loading={isSubmitting}>
        Set EMI Alert
      </Button>
    </form>
  )
}
