"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { AvatarUpload } from "@/components/ui/avatar-upload"
import { useAuthStore } from "@/store/auth-store"
import { useEffect } from "react"

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  dob: z.string().min(1, "Date of Birth is required"),
  aadhaar: z.string().regex(/^\d{12}$/, "Aadhaar must be 12 digits").optional().or(z.literal('')),
  mobile: z.string().regex(/^\d{10}$/, "Mobile must be 10 digits").optional().or(z.literal('')),
  email: z.string().email("Invalid email").optional().or(z.literal('')),
  avatarUrl: z.string().optional().nullable(),
})

type MemberFormValues = z.infer<typeof formSchema>

interface MemberFormProps {
  onSuccess?: () => void
  initialData?: MemberFormValues & { id: string }
}

export default function MemberForm({ onSuccess, initialData }: MemberFormProps) {
  const { profile, user } = useAuthStore()
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      relationship: "Father",
      dob: "",
      aadhaar: "",
      mobile: "",
      email: "",
      avatarUrl: null,
    },
  })

  const relationship = form.watch("relationship")

  useEffect(() => {
    if (relationship === "You/Admin" && profile?.avatarUrl) {
      form.setValue("avatarUrl", profile.avatarUrl)
      if (user?.displayName) form.setValue("name", user.displayName)
      if (user?.email) form.setValue("email", user.email)
    }
  }, [relationship, profile, user, form])

  async function onSubmit(values: MemberFormValues) {
    try {
      const url = initialData 
        ? `/api/members/${initialData.id}` 
        : '/api/members';
      
      const res = await fetch(url, {
        method: initialData ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      
      if (res.ok) {
        if (!initialData) {
          form.reset();
        }
        onSuccess?.();
      }
    } catch (e) {
      console.error(e);
    }
  }

  const { formState: { errors, isSubmitting } } = form;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" style={{marginTop:"20px"}}>
      <div className="flex justify-center py-2">
        <AvatarUpload 
          value={form.watch("avatarUrl")} 
          onChange={(url) => form.setValue("avatarUrl", url)}
          userId={relationship === "You/Admin" ? user?.uid : undefined}
          folder="members"
        />
      </div>

      <div className="space-y-2" style={{marginTop:"15px"}}>
        <Label htmlFor="name" className="text-[13px] font-bold text-[var(--text-secondary)] ml-1">Full Name</Label>
        <Input id="name" placeholder="e.g. John Doe" {...form.register("name")} disabled={isSubmitting} className="bg-[var(--bg-base)] border-transparent focus:bg-[var(--bg-surface)]" />
        {errors.name && <p className="text-[11px] font-medium text-[var(--danger)] ml-1">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-5" style={{marginTop:"15px"}}>
        <div className="space-y-2">
          <Label htmlFor="relationship" className="text-[13px] font-bold text-[var(--text-secondary)] ml-1">Relationship</Label>
          <Select id="relationship" {...form.register("relationship")} disabled={isSubmitting} className="bg-[var(--bg-base)] border-transparent focus:bg-[var(--bg-surface)]">
            <option>You/Admin</option>
            <option>Father</option>
            <option>Mother</option>
            <option>Husband</option>
            <option>Wife</option>
            <option>Son</option>
            <option>Daughter</option>
            <option>Brother</option>
            <option>Sister</option>
            <option>Grandfather</option>
            <option>Grandmother</option>
            <option>Other</option>
          </Select>
          {errors.relationship && <p className="text-[11px] font-medium text-[var(--danger)] ml-1">{errors.relationship.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="dob" className="text-[13px] font-bold text-[var(--text-secondary)] ml-1">Date of Birth</Label>
          <Input id="dob" type="date" {...form.register("dob")} disabled={isSubmitting} className="bg-[var(--bg-base)] border-transparent focus:bg-[var(--bg-surface)]" />
          {errors.dob && <p className="text-[11px] font-medium text-[var(--danger)] ml-1">{errors.dob.message}</p>}
        </div>
      </div>

      <div className="space-y-2" style={{marginTop:"15px"}}>
        <Label htmlFor="aadhaar" className="text-[13px] font-bold text-[var(--text-secondary)] ml-1">Aadhaar Number</Label>
        <Input id="aadhaar" placeholder="12-digit number" {...form.register("aadhaar")} disabled={isSubmitting} className="bg-[var(--bg-base)] border-transparent focus:bg-[var(--bg-surface)]" />
        {errors.aadhaar && <p className="text-[11px] font-medium text-[var(--danger)] ml-1">{errors.aadhaar.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-2" style={{marginTop:"15px"}}>
          <Label htmlFor="mobile" className="text-[13px] font-bold text-[var(--text-secondary)] ml-1">Mobile</Label>
          <Input id="mobile" placeholder="10 digits" {...form.register("mobile")} disabled={isSubmitting} className="bg-[var(--bg-base)] border-transparent focus:bg-[var(--bg-surface)]" />
          {errors.mobile && <p className="text-[11px] font-medium text-[var(--danger)] ml-1">{errors.mobile.message}</p>}
        </div>
        <div className="space-y-2" style={{marginTop:"15px"}}>
          <Label htmlFor="email" className="text-[13px] font-bold text-[var(--text-secondary)] ml-1">Email</Label>
          <Input id="email" type="email" placeholder="example@mail.com" {...form.register("email")} disabled={isSubmitting} className="bg-[var(--bg-base)] border-transparent focus:bg-[var(--bg-surface)]" />
          {errors.email && <p className="text-[11px] font-medium text-[var(--danger)] ml-1">{errors.email.message}</p>}
        </div>
      </div>

      <Button type="submit" style={{marginTop:"15px"}} className="w-full mt-4 h-12 shadow-lg shadow-black/5" loading={isSubmitting}>
        {initialData ? 'Update Profile' : 'Add Family Member'}
      </Button>
    </form>
  )
}

