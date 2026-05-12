"use client"

import React, { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/date-utils"
import {
  ArrowLeft,
  Edit3,
  FileText,
  Phone,
  Mail,
  CreditCard,
  Droplets,
  Briefcase,
  MapPin,
  Calendar,
  User as UserIcon,
  ChevronRight
} from "lucide-react"
import { Modal } from "@/components/ui/modal"
import MemberForm from "@/components/forms/member-form"

interface DocumentImage {
  url: string
  label: string
}

interface MemberDocument {
  id: string
  name: string
  images: DocumentImage[]
  updatedAt?: string
}

interface Member {
  id: string
  name: string
  relationship: string
  dob: string
  aadhaar?: string
  mobile?: string
  email?: string
  avatarUrl?: string
  bloodGroup?: string
  occupation?: string
  address?: string
  documents?: MemberDocument[]
}

export default function MemberDetailPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const { id, locale } = use(params)
  const router = useRouter()
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  const fetchMember = async () => {
    try {
      const res = await fetch(`/api/members`)
      const data: Member[] = await res.json()
      const found = data.find(m => m.id === id)
      if (found) {
        setMember(found)
      } else {
        router.push(`/${locale}/members`)
      }
    } catch (error) {
      console.error("Failed to fetch member:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMember()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!member) return null

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-10 px-4 animate-fade-in">
      {/* Header Actions */}
      <div className="flex items-center justify-between" style={{ marginBottom: "10px" }}>
        <Button
          variant="ghost"
          onClick={() => router.push(`/${locale}/members`)}
          className="rounded-2xl px-4 h-11 text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] transition-all"
        >
          <ArrowLeft size={18} className="mr-2" />
          <span className="font-bold text-sm tracking-tight">Back to Family</span>
        </Button>
        <Button
          onClick={() => setIsEditing(true)}
          className="rounded-2xl h-11 px-6 shadow-xl shadow-[var(--accent)]/10 hover:shadow-[var(--accent)]/20 transition-all font-bold"
        >
          <Edit3 size={18} className="mr-2" /> Edit Profile
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Profile Card & Actions */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="overflow-hidden border-[var(--border-strong)] bg-[var(--bg-surface)] shadow-2xl shadow-black/5 rounded-[2.5rem]">
            <div style={{ marginBottom: "10px" }} className="h-32 bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-200" />
            <CardContent style={{display:"flex",justifyContent:"center",flexDirection:"column",alignItems:"center"}} className="relative pt-0 px-8 pb-10 text-center">
              <div className="relative -mt-16 mb-6 mx-auto w-32 h-32 rounded-[2rem] bg-[var(--bg-surface)] p-1.5 shadow-2xl">
                <div className="w-full h-full rounded-[1.75rem] bg-[var(--bg-subtle)] border border-[var(--border-strong)] flex items-center justify-center overflow-hidden shadow-inner">
                  {member.avatarUrl ? (
                    <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--bg-subtle)] to-[var(--bg-base)] flex items-center justify-center text-[var(--accent)] font-black text-xl tracking-tighter opacity-40" style={{marginBottom:"10px"}}>
                      {member.name ? member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-[var(--bg-surface)] border-2 border-[var(--bg-surface)] shadow-lg flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-[var(--success)] shadow-[0_0_10px_rgba(var(--success-rgb),0.5)]" />
                </div>
              </div>

              <h1 style={{marginBottom:"5px",marginTop:"5px"}} className="text-2xl font-black tracking-tight text-[var(--text-primary)] leading-tight mb-2">
                {member.name}
              </h1>
              <Badge variant="outline" className="px-4 py-1 uppercase tracking-[0.2em] font-black bg-[var(--accent)]/5 border-[var(--accent)]/20 text-[var(--accent)] text-[10px] rounded-full">
                {member.relationship}
              </Badge>

              <div className="mt-8 pt-8 border-t border-[var(--border)] border-dashed">
                <Button
                  onClick={() => router.push(`/${locale}/members/${id}/documents`)}
                  className="w-full h-16 rounded-2xl bg-[var(--bg-subtle)]/50 border border-[var(--border-strong)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:bg-[var(--bg-subtle)] hover:shadow-lg transition-all group"
                  variant="ghost"
                >
                  <div style={{ paddingTop: "15px" }} className="flex items-center justify-between w-full px-2">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-[var(--accent)] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                        <FileText size={20} />
                      </div>
                      <div className="text-left">
                        <span className="block font-black text-[15px] tracking-tight">Documents</span>
                        <span className="block text-[10px] text-[var(--text-tertiary)] uppercase font-black tracking-widest mt-0.5">
                          {member.documents?.length || 0} Saved Files
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-[var(--text-tertiary)] group-hover:translate-x-1 transition-transform" />
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Detailed Information */}
        <div className="lg:col-span-8">
          <Card className="border-[var(--border-strong)] bg-[var(--bg-surface)] shadow-2xl shadow-black/5 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-[var(--bg-subtle)]/30 border-b border-[var(--border)] px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl text-black flex items-center justify-center" style={{ background: "linear-gradient(45deg, #fac440, #fac440)", color: "white" }}>
                  <UserIcon size={20} />
                </div>
                <div>
                  <CardTitle className="text-xl font-black tracking-tight">Personal Profile</CardTitle>
                  <p className="text-[11px] text-[var(--text-tertiary)] uppercase font-bold tracking-widest mt-0.5">Comprehensive member details</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8" style={{ paddingTop: "10px" }}>
              <div className="grid gap-8 sm:grid-cols-2">
                <DetailItem
                  icon={<Calendar />}
                  label="Date of Birth"
                  value={formatDate(member.dob)}
                  color="blue"
                />
                <DetailItem
                  icon={<Droplets />}
                  label="Blood Group"
                  value={member.bloodGroup || "Not Specified"}
                  color="red"
                />
                <DetailItem
                  icon={<Briefcase />}
                  label="Occupation"
                  value={member.occupation || "Not Specified"}
                  color="indigo"
                />
                <DetailItem
                  icon={<CreditCard />}
                  label="Aadhaar ID"
                  value={member.aadhaar ? `•••• •••• ${member.aadhaar.slice(-4)}` : "Not Linked"}
                  color="amber"
                  isMono
                />
                <DetailItem
                  icon={<Phone />}
                  label="Primary Mobile"
                  value={member.mobile || "Not Added"}
                  color="emerald"
                />
                <DetailItem
                  icon={<Mail />}
                  label="Email Address"
                  value={member.email || "Not Added"}
                  color="violet"
                />
                <div className="sm:col-span-2 pt-4">
                  <DetailItem
                    icon={<MapPin />}
                    label="Current Address"
                    value={member.address || "No address provided"}
                    color="rose"
                    isFullWidth
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes/Section could go here */}
          <div style={{ marginTop: "15px", padding: "10px" }} className="mt-6 p-6 rounded-[2rem] bg-[var(--bg-subtle)]/30 border border-[var(--border-strong)] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-strong)] flex items-center justify-center text-[var(--text-tertiary)]">
                <Calendar size={20} />
              </div>
              <div>
                <span className="block text-[11px] text-[var(--text-tertiary)] uppercase font-black tracking-widest">Profile Status</span>
                <span className="block font-bold text-[var(--text-secondary)]">Last updated on {new Date().toLocaleDateString()}</span>
              </div>
            </div>
            <Badge className="bg-[var(--success)]/10 text-[var(--success)] border-none font-black text-[10px] px-3 py-1 uppercase rounded-lg">Active</Badge>
          </div>
        </div>
      </div>

      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Update Member Profile">
        <MemberForm
          initialData={member}
          onSuccess={() => {
            setIsEditing(false);
            fetchMember();
          }}
        />
      </Modal>
    </div>
  )
}

function DetailItem({ icon, label, value, isMono, isFullWidth, color }: {
  icon: React.ReactNode,
  label: string,
  value: string,
  isMono?: boolean,
  isFullWidth?: boolean,
  color: string
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-black text-white border-black",
    red: "bg-black text-white border-black",
    indigo: "bg-black text-white border-black",
    amber: "bg-black text-white border-black",
    emerald: "bg-black text-white border-black",
    violet: "bg-black text-white border-black",
    rose: "bg-black text-white border-black",
  }

  return (
    <div className={`group transition-all duration-300 ${isFullWidth ? 'w-full' : ''}`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-110 ${colorMap[color] || 'bg-[var(--bg-subtle)]'}`}>
          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 20 }) : icon}
        </div>
        <div className="space-y-0.5 overflow-hidden">
          <span className="block text-[10px] text-[var(--text-tertiary)] uppercase font-black tracking-[0.15em]">
            {label}
          </span>
          <span className={`block text-[15px] font-black text-[var(--text-primary)] truncate ${isMono ? 'font-mono tracking-wider' : ''}`}>
            {value}
          </span>
        </div>
      </div>
    </div>
  )
}
