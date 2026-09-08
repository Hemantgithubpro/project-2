import React from 'react';
import { 
  Server, 
  Cpu, 
  Send, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle, 
  Layers,
  Database,
  Radio
} from 'lucide-react';

export function QueueArchitectureView({ state }) {
  const { queue, workers, dlq, completed, config } = state;

  const queuedCount = queue.filter(j => j.status === 'queued' || j.status === 'retrying').length;
  const processingCount = queue.filter(j => j.status === 'processing').length;

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Radio className="w-5 h-5" style={{ color: '#06b6d4' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Event-Driven Architecture & Queue Flow</h2>
        </div>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
          <span style={{ color: '#fcd34d' }}>Pending: {queuedCount}</span>
          <span style={{ color: '#67e8f9' }}>In-Flight: {processingCount}</span>
          <span style={{ color: '#6ee7b7' }}>Delivered: {completed.length}</span>
          <span style={{ color: '#fca5a5' }}>DLQ: {dlq.length}</span>
        </div>
      </div>

      <div className="arch-grid">
        {/* Node 1: Event Producer */}
        <div className="arch-card" style={{ borderColor: 'rgba(99, 102, 241, 0.3)' }}>
          <div className="arch-card-icon" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
            <Server className="w-5 h-5" />
          </div>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'white' }}>Event Broker</h3>
          <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>AWS EventBridge / Kafka</p>
          <div style={{ marginTop: '0.75rem', background: 'rgba(0,0,0,0.3)', padding: '0.4rem', borderRadius: '6px', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#a5b4fc' }}>
            Topic: notification.events
          </div>
        </div>

        {/* Arrow 1 */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
          <div style={{ textAlign: 'center' }}>
            <ArrowRight className="w-6 h-6 text-indigo-400" style={{ color: '#6366f1', margin: '0 auto' }} />
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>SQS Publish</span>
          </div>
        </div>

        {/* Node 2: Message Queue */}
        <div className="arch-card" style={{ borderColor: queuedCount > 0 ? 'rgba(245, 158, 11, 0.5)' : 'var(--border-color)' }}>
          <div className="arch-card-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>
            <Database className="w-5 h-5" />
          </div>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'white' }}>Cloud SQS Queue</h3>
          <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>FIFO / Priority Buffer</p>
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
            <span className="status-pill status-queued">{queuedCount} Enqueued</span>
          </div>
        </div>

        {/* Arrow 2 */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
          <div style={{ textAlign: 'center' }}>
            <ArrowRight className="w-6 h-6 text-cyan-400" style={{ color: '#06b6d4', margin: '0 auto' }} />
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Lambda Poll</span>
          </div>
        </div>
      </div>

      {/* Serverless Worker Pool Monitor */}
      <div style={{ marginTop: '1.25rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu className="w-4 h-4" style={{ color: '#818cf8' }} />
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>Serverless Lambda Worker Pool ({workers.length} Active Instances)</h4>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Auto-Scaling Concurrency</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.6rem' }}>
          {workers.map(w => (
            <div 
              key={w.id}
              style={{
                background: w.status === 'processing' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${w.status === 'processing' ? 'rgba(6, 182, 212, 0.5)' : 'var(--border-color)'}`,
                borderRadius: '8px',
                padding: '0.5rem',
                fontSize: '0.75rem',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                <span style={{ fontWeight: 600, color: w.status === 'processing' ? '#67e8f9' : 'var(--text-muted)' }}>{w.id}</span>
                <span className={`pulse-dot`} style={{ background: w.status === 'processing' ? '#06b6d4' : '#6b7280', boxShadow: 'none', width: '6px', height: '6px' }}></span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                {w.status === 'processing' ? `Job: ${w.currentJob}` : `Jobs: ${w.jobsCompleted}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
