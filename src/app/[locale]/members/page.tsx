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
    <div className="space-y-10 animate-fade-in py-6">
      <div className="flex flex-col gap-1 max-w-2xl" style={{marginBottom:"20px"}}>
        <h1 className="text-2xl md:text-5xl tracking-tighter text-[var(--text-primary)]" style={{ fontWeight: 500 }}>
          Family Members
        </h1>
        <p className="hidden md:block text-[var(--text-secondary)] text-lg font-medium opacity-80">
          Manage your family profiles and their personal information.
        </p>
      </div>
      
      <div className="grid gap-10 lg:grid-cols-12 items-start">
        <div className="lg:col-span-4 sticky top-6">
          <Card variant="elevated" className="overflow-hidden border-[var(--border-strong)]">
            <CardHeader className="bg-[var(--bg-subtle)]/50 border-b border-[var(--border)]">
              <CardTitle className="text-lg">Add New Member</CardTitle>
              <p className="text-xs text-[var(--text-tertiary)]">Create a new profile for your family.</p>
            </CardHeader>
            <CardContent className="pt-6">
              <MemberForm onSuccess={handleSuccess} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between" style={{marginBottom:"10px"}}>
              <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">All Members</h2>
              <div className="h-px flex-1 mx-4 bg-[var(--border)] opacity-50" />
            </div>
            <MemberList key={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  );
}
