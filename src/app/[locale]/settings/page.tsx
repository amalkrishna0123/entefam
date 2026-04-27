"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  return (
    <div className="space-y-10 animate-fade-in py-6 max-w-4xl">
      <div className="flex flex-col gap-1" style={{marginBottom:"20px"}}>
        <h1 className="text-2xl md:text-5xl tracking-tighter text-[var(--text-primary)]" style={{ fontWeight: 500 }}>
          Settings
        </h1>
        <p className="hidden md:block text-[var(--text-secondary)] text-lg font-medium opacity-80">
          Customize your experience and manage your account preferences.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Personal Profile Section */}
        <Card variant="elevated" className="border-[var(--border-strong)] overflow-hidden">
          <CardHeader className="bg-[var(--bg-subtle)]/30 border-b border-[var(--border)]">
            <CardTitle>Personal Profile</CardTitle>
            <CardDescription>Update your public information and how others see you.</CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-6" style={{paddingTop:"10px"}}>
            <div className="flex items-center gap-8 mb-4">
              <div className="w-24 h-24 rounded-full bg-[var(--bg-subtle)] border-4 border-[var(--bg-surface)] shadow-lg flex items-center justify-center text-3xl font-bold text-[var(--text-primary)]">
                AK
              </div>
              <div className="space-y-2">
                <Button variant="outline" size="sm">Change Avatar</Button>
                <p className="text-[11px] text-[var(--text-tertiary)]" style={{marginTop:"10px"}}>JPG, GIF or PNG. Max size of 800K</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6" style={{marginBottom:"20px",marginTop:"20px"}}>
              <div className="space-y-2">
                <Label className="text-[13px] font-bold text-[var(--text-secondary)] ml-1">Display Name</Label>
                <Input placeholder="Amal Krishna" className="bg-[var(--bg-base)] border-transparent focus:bg-[var(--bg-surface)]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] font-bold text-[var(--text-secondary)] ml-1">Email Address</Label>
                <Input type="email" placeholder="amal@example.com" className="bg-[var(--bg-base)] border-transparent focus:bg-[var(--bg-surface)]" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-bold text-[var(--text-secondary)] ml-1">Bio</Label>
              <textarea 
              style={{padding:"15px 20px"}}
                className="w-full min-h-[100px] rounded-xl bg-[var(--bg-base)] border-transparent focus:bg-[var(--bg-surface)] p-4 text-[15px] font-medium transition-all outline-none focus:ring-2 focus:ring-[var(--accent-muted)] border border-[var(--border-strong)]"
                placeholder="Tell us a bit about your role in the family..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card className="border-[var(--border-strong)]">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Choose what updates you want to receive and where.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-subtle)]/50 border border-[var(--border)] group hover:border-[var(--accent)] transition-colors" style={{padding:"15px 20px", marginBottom:"20px"}}>
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-[var(--text-primary)]">Weekly Family Digest</p>
                <p className="text-xs text-[var(--text-tertiary)]">Receive a summary of expenses and events every Monday.</p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded-md border-[var(--border-strong)] text-[var(--accent)] focus:ring-[var(--accent)]" defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-subtle)]/50 border border-[var(--border)] group hover:border-[var(--accent)] transition-colors" style={{padding:"15px 20px", marginBottom:"0px"}}>
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-[var(--text-primary)]">Health Alerts</p>
                <p className="text-xs text-[var(--text-tertiary)]">Get notified immediately about health-related reminders.</p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded-md border-[var(--border-strong)] text-[var(--accent)] focus:ring-[var(--accent)]" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="border-[var(--border-strong)]">
          <CardHeader>
            <CardTitle>Security & Privacy</CardTitle>
            <CardDescription>Manage your account security and data privacy settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between py-2" style={{padding:"0px", marginBottom:"20px"}}>
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-[var(--text-primary)]">Password Authentication</p>
                <p className="text-xs text-[var(--text-tertiary)]">Last changed 3 months ago</p>
              </div>
              <Button variant="outline" size="sm">Change Password</Button>
            </div>
            
            <div className="h-px bg-[var(--border)] opacity-50" />

            <div className="flex items-center justify-between py-2" style={{paddingTop:"20px", marginBottom:"0px"}}>
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-[var(--text-primary)]">Two-Factor Authentication</p>
                <p className="text-xs text-[var(--text-tertiary)]">Add an extra layer of security to your account.</p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 pt-4">
          <Button variant="ghost">Cancel</Button>
          <Button className="px-8 shadow-lg shadow-black/10">Save All Changes</Button>
        </div>
      </div>
    </div>
  );
}
