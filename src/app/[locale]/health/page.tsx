"use client"

import { useState, useEffect } from 'react';
import HealthForm from '@/components/forms/health-form';
import HealthMetricDashboard from '@/components/health/health-metric-dashboard';
import MetricSelector from '@/components/health/metric-selector';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Select } from '@/components/ui/select';
import { Plus, Users, Filter } from 'lucide-react';

interface Member {
  id: string
  name: string
}

export default function HealthPage() {
  const [activeMetric, setActiveMetric] = useState("Weight");
  const [selectedMemberId, setSelectedMemberId] = useState("all");
  const [members, setMembers] = useState<Member[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetch('/api/members')
      .then(res => res.json())
      .then(data => setMembers(data))
      .catch(err => console.error(err));
  }, []);

  const handleSuccess = () => {
    setIsModalOpen(false);
    setRefreshKey(prev => prev + 1);
  };

  const selectedMemberName = selectedMemberId === "all" 
    ? "Everyone" 
    : members.find(m => m.id === selectedMemberId)?.name || "Member";

  return (
    <div className="animate-fade-in mx-auto px-4 md:px-8" style={{ paddingTop: '2rem', paddingBottom: '2rem', maxWidth: '80rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }} className="flex-col lg:flex-row lg:items-end">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: '9999px', backgroundColor: 'var(--accent-muted)', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', width: 'fit-content' }}>
            Health Management
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-primary)', margin: 0 }} className="md:text-6xl">
            Health Tracking
          </h1>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '1.125rem', fontWeight: 500, maxWidth: '42rem', margin: 0 }}>
            Monitor vitals and track wellness progress for <span style={{ color: 'var(--text-secondary)' }}>{selectedMemberName}</span>.
          </p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="sm:flex-row sm:items-center">
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }}>
              <Users size={18} />
            </div>
            <Select 
              value={selectedMemberId} 
              onChange={(e) => setSelectedMemberId(e.target.value)}
              style={{ paddingLeft: '3rem', height: '3rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '1rem', fontWeight: 500, width: '100%' }}
            >
              <option value="all">All Family Members</option>
              {members.map(member => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </Select>
          </div>
          
          <Button 
            onClick={() => setIsModalOpen(true)}
            style={{ height: '3rem', paddingLeft: '2rem', paddingRight: '2rem', borderRadius: '1rem', backgroundColor: 'var(--accent)', color: 'white', boxShadow: '0 20px 25px -5px rgba(var(--accent-rgb), 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
          >
            <Plus size={22} strokeWidth={3} />
            <span>Log Metric</span>
          </Button>
        </div>
      </div>

      {/* Metric Selection Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          <div style={{ width: '2rem', height: '1px', backgroundColor: 'var(--border)' }}></div>
          <span>Select Health Metric</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></div>
        </div>
        <MetricSelector activeMetric={activeMetric} onChange={setActiveMetric} />
      </div>
      
      {/* Dashboard Section */}
      <div style={{ paddingTop: '0.5rem' }}>
        <HealthMetricDashboard 
          key={`${activeMetric}-${selectedMemberId}-${refreshKey}`}
          metric={activeMetric}
          memberId={selectedMemberId}
          memberName={selectedMemberName}
        />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Log New Health Metric"
      >
        <div style={{ padding: '0.5rem 0' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', marginTop: 0 }}>
            Enter the details for the health metric you want to record.
          </p>
          <HealthForm onSuccess={handleSuccess} />
        </div>
      </Modal>
    </div>
  );
}
