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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="amal@example.com" 
          {...register("email")} 
          required 
          defaultValue="amalkrishna2001ma@gmail.com"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Forgot password?
          </Link>
        </div>
        <Input 
          id="password" 
          type="password" 
          {...register("password")} 
          required 
          defaultValue="1234"
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="animate-spin" size={18} />
            Signing in...
          </span>
        ) : (
          "Sign in"
        )}
      </Button>
      <div className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign up
        </Link>
      </div>
    </form>
  )
}

