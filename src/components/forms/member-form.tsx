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
  bloodGroup: z.string().optional().or(z.literal('')),
  occupation: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
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
      bloodGroup: "",
      occupation: "",
      address: "",
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col items-center gap-4" style={{marginTop:"15px"}}>
        <AvatarUpload 
          value={form.watch("avatarUrl")} 
          onChange={(url) => form.setValue("avatarUrl", url)}
          userId={relationship === "You/Admin" ? user?.uid : undefined}
          folder="members"
        />
        <div className="text-center">
          <p className="text-[11px] text-[var(--text-tertiary)] uppercase font-black tracking-widest">Profile Photo</p>
          <p className="text-[10px] text-[var(--text-tertiary)] opacity-60 mt-0.5">Click to upload or change</p>
        </div>
      </div>

      <div className="space-y-4 pt-4" style={{marginTop:"15px"}}>
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[12px] font-black text-[var(--text-secondary)] uppercase tracking-wider ml-1">Full Name</Label>
          <Input id="name" placeholder="Enter full name" {...form.register("name")} disabled={isSubmitting} className="h-12 bg-[var(--bg-subtle)]/50 border-transparent focus:bg-[var(--bg-surface)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all rounded-xl text-sm" />
          {errors.name && <p className="text-[10px] font-bold text-[var(--danger)] ml-1">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4" style={{marginTop:"15px"}}>
          <div className="space-y-2">
            <Label htmlFor="relationship" className="text-[12px] font-black text-[var(--text-secondary)] uppercase tracking-wider ml-1">Relationship</Label>
            <Select id="relationship" {...form.register("relationship")} disabled={isSubmitting} className="h-12 bg-[var(--bg-subtle)]/50 border-transparent focus:bg-[var(--bg-surface)] rounded-xl text-sm">
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
            {errors.relationship && <p className="text-[10px] font-bold text-[var(--danger)] ml-1">{errors.relationship.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob" className="text-[12px] font-black text-[var(--text-secondary)] uppercase tracking-wider ml-1">Birth Date</Label>
            <Input id="dob" type="date" {...form.register("dob")} disabled={isSubmitting} className="h-12 bg-[var(--bg-subtle)]/50 border-transparent focus:bg-[var(--bg-surface)] rounded-xl text-sm" />
            {errors.dob && <p className="text-[10px] font-bold text-[var(--danger)] ml-1">{errors.dob.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4" style={{marginTop:"15px"}}>
          <div className="space-y-2">
            <Label htmlFor="bloodGroup" className="text-[12px] font-black text-[var(--text-secondary)] uppercase tracking-wider ml-1">Blood Group</Label>
            <Select id="bloodGroup" {...form.register("bloodGroup")} disabled={isSubmitting} className="h-12 bg-[var(--bg-subtle)]/50 border-transparent focus:bg-[var(--bg-surface)] rounded-xl text-sm">
              <option value="">Select</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>O+</option>
              <option>O-</option>
              <option>AB+</option>
              <option>AB-</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="occupation" className="text-[12px] font-black text-[var(--text-secondary)] uppercase tracking-wider ml-1">Occupation</Label>
            <Input id="occupation" placeholder="e.g. Designer" {...form.register("occupation")} disabled={isSubmitting} className="h-12 bg-[var(--bg-subtle)]/50 border-transparent focus:bg-[var(--bg-surface)] rounded-xl text-sm" />
          </div>
        </div>

        <div className="space-y-2" style={{marginTop:"15px"}}>
          <Label htmlFor="aadhaar" className="text-[12px] font-black text-[var(--text-secondary)] uppercase tracking-wider ml-1">Aadhaar (Optional)</Label>
          <Input id="aadhaar" placeholder="12-digit UID" {...form.register("aadhaar")} disabled={isSubmitting} className="h-12 bg-[var(--bg-subtle)]/50 border-transparent focus:bg-[var(--bg-surface)] rounded-xl text-sm font-mono tracking-widest" />
          {errors.aadhaar && <p className="text-[10px] font-bold text-[var(--danger)] ml-1">{errors.aadhaar.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4" style={{marginTop:"15px"}}>
          <div className="space-y-2">
            <Label htmlFor="mobile" className="text-[12px] font-black text-[var(--text-secondary)] uppercase tracking-wider ml-1">Mobile</Label>
            <Input id="mobile" placeholder="10 digits" {...form.register("mobile")} disabled={isSubmitting} className="h-12 bg-[var(--bg-subtle)]/50 border-transparent focus:bg-[var(--bg-surface)] rounded-xl text-sm" />
            {errors.mobile && <p className="text-[10px] font-bold text-[var(--danger)] ml-1">{errors.mobile.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[12px] font-black text-[var(--text-secondary)] uppercase tracking-wider ml-1">Email</Label>
            <Input id="email" type="email" placeholder="mail@example.com" {...form.register("email")} disabled={isSubmitting} className="h-12 bg-[var(--bg-subtle)]/50 border-transparent focus:bg-[var(--bg-surface)] rounded-xl text-sm" />
            {errors.email && <p className="text-[10px] font-bold text-[var(--danger)] ml-1">{errors.email.message}</p>}
          </div>
        </div>

        <div className="space-y-2" style={{marginTop:"15px"}}>
          <Label htmlFor="address" className="text-[12px] font-black text-[var(--text-secondary)] uppercase tracking-wider ml-1">Full Address</Label>
          <Input id="address" placeholder="Residential address" {...form.register("address")} disabled={isSubmitting} className="h-12 bg-[var(--bg-subtle)]/50 border-transparent focus:bg-[var(--bg-surface)] rounded-xl text-sm" />
        </div>
      </div>

      <div className="pt-4" style={{marginTop:"15px"}}>
        <Button 
          type="submit" 
          className="w-full h-14 rounded-2xl shadow-xl shadow-[var(--accent)]/10 hover:shadow-[var(--accent)]/20 transition-all font-black text-sm uppercase tracking-widest" 
          loading={isSubmitting}
        >
          {initialData ? 'Save Changes' : 'Create Member Profile'}
        </Button>
      </div>
    </form>
  )
}

