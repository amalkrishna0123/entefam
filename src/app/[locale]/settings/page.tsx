"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import { useState, useEffect, useRef } from 'react';
import { Camera, Trash2, Loader2, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNotificationStore } from '@/store/notification-store';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.uid) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/profile?userId=${user?.uid}`);
      const data = await res.json();
      if (data.avatarUrl) {
        setAvatarUrl(data.avatarUrl);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.uid) return;

    // Validate file size (max 800K as per UI text)
    if (file.size > 800 * 1024) {
      addNotification({
        title: "File too large",
        message: "Maximum size allowed is 800KB",
        type: "warning"
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', user.uid);

    try {
      const res = await fetch('/api/profile/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setAvatarUrl(data.url);
        addNotification({
          title: "Avatar Updated",
          message: "Your profile picture has been successfully updated.",
          type: "success"
        });
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      addNotification({
        title: "Upload Failed",
        message: "There was an error uploading your image. Please try again.",
        type: "danger"
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteAvatar = async () => {
    if (!user?.uid || !avatarUrl) return;

    if (!confirm("Are you sure you want to delete your avatar?")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/profile?userId=${user.uid}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setAvatarUrl(null);
        addNotification({
          title: "Avatar Removed",
          message: "Your profile picture has been removed.",
          type: "success"
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      addNotification({
        title: "Delete Failed",
        message: "Failed to remove avatar. Please try again.",
        type: "danger"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getInitials = () => {
    if (user?.displayName) {
      return user.displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'AK';
  };

  return (
    <div className="space-y-10 animate-fade-in py-6 max-w-4xl">
      <div className="flex flex-col gap-1" style={{marginBottom:"20px"}}>
        <h1 className="hidden md:block text-2xl md:text-5xl tracking-tighter text-[var(--text-primary)]" style={{ fontWeight: 500 }}>
          Settings
        </h1>
        <p className="hidden md:block text-[var(--text-secondary)] text-lg font-medium opacity-80">
          Customize your experience and manage your account preferences.
        </p>
      </div>

      <div className="grid gap-3 md:gap-8">
        {/* Personal Profile Section */}
        <Card variant="elevated" className="border-[var(--border-strong)] overflow-hidden">
          <CardHeader className="bg-[var(--bg-subtle)]/30 border-b border-[var(--border)]">
            <CardTitle>Personal Profile</CardTitle>
            <CardDescription>Update your public information and how others see you.</CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-6" style={{paddingTop:"20px"}}>
            <div className="flex items-center gap-8 mb-4">
              <div 
                className="relative group cursor-pointer"
                onClick={handleAvatarClick}
              >
                <div className="w-24 h-24 rounded-full bg-[var(--bg-subtle)] border-4 border-[var(--bg-surface)] shadow-lg flex items-center justify-center text-3xl font-bold text-[var(--text-primary)] overflow-hidden relative">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    getInitials()
                  )}
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera className="text-white" size={24} />
                  </div>
                  
                  {/* Loading State */}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 className="text-white animate-spin" size={24} />
                    </div>
                  )}
                </div>
                
                {/* Status indicator */}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[var(--bg-surface)] border-2 border-[var(--border-strong)] flex items-center justify-center shadow-sm">
                  <div className={`w-2.5 h-2.5 rounded-full ${user ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAvatarClick}
                    disabled={isUploading}
                    className="h-9 px-4 rounded-xl border-[var(--border-strong)] hover:border-[var(--accent)] hover:bg-[var(--accent-muted)]/10 transition-all"
                  >
                    {isUploading ? <Loader2 className="animate-spin mr-2" size={14} /> : <Upload className="mr-2" size={14} />}
                    Change Avatar
                  </Button>
                  
                  {avatarUrl && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleDeleteAvatar}
                      disabled={isDeleting}
                      className="h-9 w-9 p-0 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                      {isDeleting ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={16} />}
                    </Button>
                  )}
                </div>
                <p className="text-[11px] text-[var(--text-tertiary)] font-medium flex items-center gap-1.5" style={{marginTop:"0px"}}>
                  <AlertCircle size={10} />
                  JPG, GIF or PNG. Max size of 800K
                </p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6" style={{marginBottom:"20px",marginTop:"20px"}}>
              <div className="space-y-2">
                <Label className="text-[13px] font-bold text-[var(--text-secondary)] ml-1">Display Name</Label>
                <Input 
                  placeholder="Amal Krishna" 
                  className="bg-[var(--bg-base)] border-transparent focus:bg-[var(--bg-surface)] h-11 rounded-xl" 
                  defaultValue={user?.displayName || "Amal Krishna"}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] font-bold text-[var(--text-secondary)] ml-1">Email Address</Label>
                <Input 
                  type="email" 
                  placeholder="amal@example.com" 
                  className="bg-[var(--bg-base)] border-transparent focus:bg-[var(--bg-surface)] h-11 rounded-xl" 
                  defaultValue={user?.email || "amal@example.com"}
                  disabled
                />
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

