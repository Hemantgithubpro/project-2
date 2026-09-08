import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Zap, 
  BarChart3, 
  Layers, 
  ShieldCheck 
} from 'lucide-react';

export function MetricsDashboard({ state }) {
  const { stats, workers, queue, dlq, completed } = state;

  const totalProcessed = stats.totalDelivered + stats.totalFailed;
  const successRate = totalProcessed > 0 
    ? Math.round((stats.totalDelivered / totalProcessed) * 100) 
    : 100;

  const activeWorkersCount = workers.filter(w => w.status === 'processing').length;
  const workerUtilization = Math.round((activeWorkersCount / workers.length) * 100);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <BarChart3 className="w-5 h-5" style={{ color: '#6366f1' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>System Metrics & Telemetry</h2>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Real-Time Cloud SLA</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {/* Metric 1: Success Rate */}
        <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Delivery SLA</span>
            <ShieldCheck className="w-4 h-4" style={{ color: successRate > 90 ? '#10b981' : '#f59e0b' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-mono)' }}>
            {successRate}%
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
            {stats.totalDelivered} Delivered / {stats.totalFailed} Failed
          </div>
        </div>

        {/* Metric 2: Avg Latency */}
        <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Avg Queue Latency</span>
            <Clock className="w-4 h-4" style={{ color: '#06b6d4' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#67e8f9', fontFamily: 'var(--font-mono)' }}>
            {stats.avgLatencyMs || 85} ms
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
            SQS Publish to Lambda Execution
          </div>
        </div>

        {/* Metric 3: Worker Utilization */}
        <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Worker Load</span>
            <Zap className="w-4 h-4" style={{ color: '#f59e0b' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fcd34d', fontFamily: 'var(--font-mono)' }}>
            {workerUtilization}%
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
            {activeWorkersCount} of {workers.length} Lambdas Busy
          </div>
        </div>

        {/* Metric 4: Channel Distribution */}
        <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Dispatches</span>
            <Layers className="w-4 h-4" style={{ color: '#818cf8' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#a5b4fc', fontFamily: 'var(--font-mono)' }}>
            {stats.totalDispatched}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
            Mail: {stats.channelCounts.email} | SMS: {stats.channelCounts.sms} | Push: {stats.channelCounts.push}
          </div>
        </div>
      </div>
    </div>
  );
}
