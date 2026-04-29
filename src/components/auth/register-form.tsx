"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function RegisterForm() {
  const { register, handleSubmit } = useForm()

  function onSubmit(values: any) {
    console.log(values)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Label htmlFor="fullname" style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>Full Name</Label>
        <Input id="fullname" placeholder="John Doe" {...register("fullname")} required style={{ width: '100%' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Label htmlFor="email" style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>Email address</Label>
        <Input id="email" type="email" placeholder="john@example.com" {...register("email")} required style={{ width: '100%' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Label htmlFor="password" style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>Password</Label>
        <Input id="password" type="password" {...register("password")} required style={{ width: '100%' }} />
      </div>
      <Button type="submit" style={{ width: '100%', marginTop: '8px' }}>Create account</Button>
      <div style={{ textAlign: 'center', fontSize: '14px', color: '#4b5563', marginTop: '16px' }}>
        Already have an account?{" "}
        <Link href="/login" style={{ fontWeight: 500, color: '#4f46e5', textDecoration: 'none' }}>
          Sign in
        </Link>
      </div>
    </form>
  )
}
