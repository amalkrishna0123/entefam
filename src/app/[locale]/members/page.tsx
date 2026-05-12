"use client"

import { useState } from 'react';
import MemberForm from '@/components/forms/member-form';
import MemberList from '@/components/members/member-list';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function MembersPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-in py-10 px-4 md:px-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 max-w-3xl" style={{marginBottom:"15px"}}>
        <h1 className="text-[20px] md:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-tight">
          Family Members
        </h1>
        <p className="hidden md:block text-[var(--text-secondary)] text-lg font-medium opacity-70">
          A centralized hub to manage and organize your family's vital information and documents.
        </p>
      </div>
      
      <div className="grid gap-10 lg:grid-cols-12 items-start">
        {/* Sidebar: Add Member */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <Card className="overflow-hidden border-[var(--border-strong)] bg-[var(--bg-surface)] shadow-2xl shadow-black/5 rounded-[2.5rem]">
            <CardHeader className="bg-[var(--bg-subtle)]/30 border-b border-[var(--border)] px-8 py-6">
              <CardTitle className="text-xl font-black tracking-tight">Add Member</CardTitle>
              <p className="text-[11px] text-[var(--text-tertiary)] uppercase font-bold tracking-widest mt-1">Create a new profile</p>
            </CardHeader>
            <CardContent className="p-8">
              <MemberForm onSuccess={handleSuccess} />
            </CardContent>
          </Card>
        </div>

        {/* Main Content: Member List */}
        <div className="lg:col-span-8">
          <div className="space-y-8">
            <div className="flex items-center gap-6" style={{marginBottom:"10px"}}>
              <h2 className="text-[20px] font-black text-[var(--text-primary)] tracking-tight whitespace-nowrap">All Members</h2>
              <div className="h-px w-full bg-gradient-to-r from-[var(--border)] to-transparent" />
            </div>
            <MemberList key={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  );
}
