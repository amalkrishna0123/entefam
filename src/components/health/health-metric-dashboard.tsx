"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from "recharts"
import { getHealthComparisonInsight } from "@/lib/ai"
import { Sparkles, Bot, Calendar, TrendingUp, TrendingDown, Minus, Edit, Trash2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { Modal } from "@/components/ui/modal"
import HealthForm from "@/components/forms/health-form"
import { formatDate } from "@/lib/date-utils"

interface HealthRecord {
  id: string
  memberId: string
  metric: string
  value: string
  date: string
}

interface HealthMetricDashboardProps {
  metric: string
  memberId: string
  memberName: string
}

export default function HealthMetricDashboard({ metric, memberId, memberName }: HealthMetricDashboardProps) {
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState<"1w" | "1m" | "all">("1w")
  const [aiInsight, setAiInsight] = useState<string>("")
  const [aiLoading, setAiLoading] = useState(false)
  const [editingRecord, setEditingRecord] = useState<HealthRecord | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/health")
      const data: HealthRecord[] = await res.json()
      
      // Filter by metric and member
      let filtered = data.filter(r => r.metric === metric)
      if (memberId !== "all") {
        filtered = filtered.filter(r => r.memberId === memberId)
      }
      
      // Sort by date ascending for the graph
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      setRecords(filtered)
    } catch (error) {
      console.error("Failed to fetch health records:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [metric, memberId])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this health record?")) return
    
    try {
      const res = await fetch(`/api/health/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Failed to delete record:", error)
    }
  }

  const handleEditSuccess = () => {
    setIsEditModalOpen(false)
    setEditingRecord(null)
    fetchData()
  }

  const filteredByRange = useMemo(() => {
    if (range === "all") return records
    const now = new Date()
    const days = range === "1w" ? 7 : 30
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    return records.filter(r => new Date(r.date) >= cutoff)
  }, [records, range])
// ... (rest of the logic remains same, but I'll need to update the table rendering)

  const chartData = useMemo(() => {
    return filteredByRange.map(r => ({
      date: formatDate(r.date),
      value: parseFloat(r.value.replace(/[^0-9.]/g, '')) || 0,
      originalValue: r.value
    }))
  }, [filteredByRange])

  useEffect(() => {
    const getAiMessage = async () => {
      if (filteredByRange.length < 2) {
        setAiInsight("Log more data to see AI-powered trends and comparisons!")
        return
      }
      
      setAiLoading(true)
      try {
        const current = filteredByRange[filteredByRange.length - 1]
        const previous = filteredByRange[0]
        const message = await getHealthComparisonInsight(
          metric, 
          memberName, 
          current.value, 
          previous.value
        )
        setAiInsight(message)
      } catch (error) {
        setAiInsight("Keep tracking your metrics to see your progress!")
      } finally {
        setAiLoading(false)
      }
    }
    getAiMessage()
  }, [filteredByRange, metric, memberName])

  const stats = useMemo(() => {
    if (filteredByRange.length < 2) return null
    const latest = parseFloat(filteredByRange[filteredByRange.length - 1].value.replace(/[^0-9.]/g, ''))
    const prev = parseFloat(filteredByRange[0].value.replace(/[^0-9.]/g, ''))
    const diff = latest - prev
    const percent = prev !== 0 ? (diff / prev) * 100 : 0
    
    return {
      latest,
      diff: diff.toFixed(1),
      percent: percent.toFixed(1),
      isIncrease: diff > 0,
      isSame: diff === 0
    }
  }, [filteredByRange])

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Skeleton style={{ height: '400px', width: '100%', borderRadius: '1.5rem', backgroundColor: 'var(--bg-elevated)' }} />
        <Skeleton style={{ height: '150px', width: '100%', borderRadius: '1.5rem', backgroundColor: 'var(--bg-elevated)' }} />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Dashboard Sub-header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }} className="flex-col md:flex-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.5rem', backgroundColor: 'var(--accent)', color: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', display: 'flex' }}>
            <TrendingUp size={20} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>{metric} Overview</h2>
        </div>
        
        <div style={{ display: 'flex', padding: '0.25rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '1rem', border: '1px solid var(--border)', width: 'fit-content' }}>
          {(["1w", "1m", "all"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '0.75rem',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                backgroundColor: range === r ? 'white' : 'transparent',
                color: range === r ? 'var(--accent)' : 'var(--text-tertiary)',
                border: 'none',
                boxShadow: range === r ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 'none',
                cursor: 'pointer'
              }}
            >
              {r === "1w" ? "1 Week" : r === "1m" ? "1 Month" : "All Time"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gap: '2rem' }} className="grid-cols-1 lg:grid-cols-4">
        {/* Main Chart Card */}
        <Card style={{ gridColumn: 'span 3', border: 'none', backgroundColor: 'var(--bg-elevated)', borderRadius: '1.5rem', overflow: 'hidden', padding: '2rem' }} className="lg:col-span-3">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.25rem 0' }}>Performance Trend</p>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', margin: 0 }}>{metric} History</h3>
            </div>
            {stats && (
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.25rem 0' }}>Latest Reading</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>{stats.latest}</p>
              </div>
            )}
          </div>
          <CardContent className="p-8">
            <div className="h-[350px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: 'var(--text-tertiary)', fontSize: 11, fontWeight: 600}}
                      dy={15}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: 'var(--text-tertiary)', fontSize: 11, fontWeight: 600}}
                      dx={-10}
                    />
                    <Tooltip 
                      cursor={{ stroke: 'var(--accent)', strokeWidth: 1, strokeDasharray: '4 4' }}
                      contentStyle={{ 
                        backgroundColor: 'var(--bg-elevated)', 
                        border: '1px solid var(--border)',
                        borderRadius: '16px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        padding: '12px'
                      }}
                      itemStyle={{ color: 'var(--accent)', fontWeight: 700 }}
                      labelStyle={{ color: 'var(--text-tertiary)', marginBottom: '4px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="var(--accent)" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                      animationDuration={1500}
                      activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--accent)' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-[var(--text-tertiary)] gap-4">
                  <div className="w-16 h-16 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center border border-[var(--border)]">
                    <Minus size={24} />
                  </div>
                  <p className="font-medium italic">No data available for this range</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="lg:col-span-1">
          {stats && (
            <Card style={{ border: 'none', backgroundColor: 'var(--accent)', color: 'white', borderRadius: '1.5rem', overflow: 'hidden', position: 'relative', padding: '2rem' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', opacity: 0.2 }}>
                <TrendingUp size={48} />
              </div>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', margin: 0 }}>Growth Rate</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '2.25rem', fontWeight: 900 }}>{Math.abs(parseFloat(stats.diff))}</span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  backgroundColor: stats.isSame ? 'rgba(255, 255, 255, 0.2)' : stats.isIncrease ? 'rgb(16, 185, 129)' : 'rgb(244, 63, 94)',
                  color: stats.isSame ? 'white' : stats.isIncrease ? 'white' : 'white'
                }}>
                  {stats.isSame ? <Minus size={12} /> : stats.isIncrease ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {Math.abs(parseFloat(stats.percent))}%
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.8)', marginTop: '1rem', margin: 0 }}>Change over the last {range === "1w" ? "7 days" : "30 days"}</p>
            </Card>
          )}

          <Card variant="premium" style={{ border: 'none', borderRadius: '1.5rem', overflow: 'hidden', position: 'relative', padding: '1.5rem' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem' }}>
              <Sparkles size={20} style={{ color: 'rgb(16, 185, 129)', opacity: 0.5 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
              <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '9999px', backgroundColor: 'rgb(16, 185, 129)' }}></div>
              AI Analysis
            </div>
            {aiLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.5rem 0' }}>
                <Skeleton style={{ height: '0.75rem', width: '100%', borderRadius: '9999px' }} />
                <Skeleton style={{ height: '0.75rem', width: '85%', borderRadius: '9999px' }} />
                <Skeleton style={{ height: '0.75rem', width: '60%', borderRadius: '9999px' }} />
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-1rem', top: 0, bottom: 0, width: '4px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '9999px' }} />
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic', fontWeight: 500, paddingLeft: '0.5rem', margin: 0 }}>
                  "{aiInsight}"
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Logs Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>Recent Entries</h3>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Showing {filteredByRange.length} records</p>
        </div>
        
        <div style={{ border: '1px solid var(--border)', backgroundColor: 'transparent', borderRadius: '1.5rem', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(var(--bg-elevated-rgb), 0.5)' }}>
                  <th style={{ padding: '1.25rem 2rem', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-tertiary)' }}>Date</th>
                  <th style={{ padding: '1.25rem 2rem', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-tertiary)' }}>Member</th>
                  <th style={{ padding: '1.25rem 2rem', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-tertiary)' }}>Value</th>
                  <th style={{ padding: '1.25rem 2rem', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-tertiary)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredByRange.slice().reverse().map((record) => (
                  <tr key={record.id} style={{ borderTop: '1px solid var(--border)', transition: 'all 0.2s ease' }}>
                    <td style={{ padding: '1.25rem 2rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {formatDate(record.date)}
                    </td>
                    <td style={{ padding: '1.25rem 2rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-tertiary)' }}>
                      {memberName}
                    </td>
                    <td style={{ padding: '1.25rem 2rem' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{record.value}</span>
                    </td>
                    <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => {
                            setEditingRecord(record)
                            setIsEditModalOpen(true)
                          }}
                          style={{ padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(record.id)}
                          style={{ padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', color: 'rgb(244, 63, 94)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredByRange.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: '5rem 2rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', opacity: 0.3 }}>
                        <Minus size={32} />
                        <p style={{ fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>No Activity Records</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingRecord(null)
        }} 
        title="Edit Health Record"
      >
        <div style={{ padding: '0.5rem 0' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', marginTop: 0 }}>
            Modify the details of this health record.
          </p>
          {editingRecord && (
            <HealthForm 
              initialData={editingRecord} 
              onSuccess={handleEditSuccess} 
            />
          )}
        </div>
      </Modal>
    </div>
  )
}

