"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { AlertCircle, Loader2 } from "lucide-react"

export default function LoginForm() {
  const { register, handleSubmit } = useForm()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(values: any) {
    setLoading(true)
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password)
      router.push("/dashboard")
    } catch (err: any) {
      console.error(err)
      setError("Invalid email or password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {error && (
        <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', fontSize: '14px' }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Label htmlFor="email" style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>Email address</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="amal@example.com" 
          {...register("email")} 
          required 
          defaultValue="amalkrishna2001ma@gmail.com"
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Label htmlFor="password" style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>Password</Label>
          <Link href="#" style={{ fontSize: '14px', fontWeight: 500, color: '#1f1f1fff', textDecoration: 'none' }}>
            Forgot password?
          </Link>
        </div>
        <Input 
          id="password" 
          type="password" 
          {...register("password")} 
          required 
          defaultValue="1234"
          style={{ width: '100%' }}
        />
      </div>
      <Button type="submit" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
        {loading ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Loader2 className="animate-spin" size={18} />
            Signing in...
          </span>
        ) : (
          "Sign in"
        )}
      </Button>
      <div style={{ textAlign: 'center', fontSize: '14px', color: '#4b5563', marginTop: '16px' }}>
        Don't have an account?{" "}
        <Link href="/register" style={{ fontWeight: 500, color: '#212121ff', textDecoration: 'none' }}>
          Sign up
        </Link>
      </div>
    </form>
  )
}

