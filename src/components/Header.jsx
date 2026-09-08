import React from 'react';
import { 
  Bell, 
  Zap, 
  Cpu, 
  AlertTriangle, 
  RefreshCw, 
  Sliders, 
  ShieldAlert, 
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { queueEngine } from '../engine/NotificationQueueEngine';

export function Header({ state }) {
  const { workerCount, config, queue, dlq, completed } = state;

  const handleWorkerChange = (e) => {
    queueEngine.setWorkerCount(parseInt(e.target.value, 10));
  };

  const handleFailureRateChange = (e) => {
    queueEngine.setFailureRate(parseFloat(e.target.value));
  };

  const runFlashSaleScenario = () => {
    queueEngine.dispatchBatch(40, 'all');
  };

  const runDevOpsOutageScenario = () => {
    for (let i = 0; i < 8; i++) {
      queueEngine.dispatch({
        channel: i % 2 === 0 ? 'sms' : 'push',
        event: 'system.incident',
        recipient: 'oncall@devops.net',
        phone: '+1 (555) 911-0000',
        subject: `CRITICAL: Cluster db-us-east-${i+1} unreachable`,
        body: `High latency & packet loss detected on node ${i+1}. Worker auto-remediation initiated.`,
        priority: 'CRITICAL'
      });
    }
  };

  return (
    <header className="header-bar">
      <div className="logo-group">
        <div className="logo-icon">
          <Bell className="w-5 h-5" />
        </div>
        <div className="logo-text">
          <h1>PulseNotify Cloud</h1>
          <p>Event-Driven Multi-Channel Notification Platform</p>
        </div>
        <div className="pulse-badge" style={{ marginLeft: '1rem' }}>
          <span className="pulse-dot"></span>
          <span>Engine Online (SQS + Lambda)</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Serverless Worker Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.4rem 0.8rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <Cpu className="w-4 h-4 text-indigo-400" style={{ color: '#818cf8' }} />
          <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)' }}>Lambda Workers:</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#a5b4fc', minWidth: '20px' }}>{workerCount}</span>
          <input 
            type="range" 
            min="1" 
            max="12" 
            value={workerCount} 
            onChange={handleWorkerChange}
            style={{ width: '70px', cursor: 'pointer', accentColor: '#6366f1' }} 
            title="Adjust active serverless worker pool concurrency"
          />
        </div>

        {/* Failure Rate Simulator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.4rem 0.8rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <AlertTriangle className="w-4 h-4 text-amber-400" style={{ color: '#f59e0b' }} />
          <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)' }}>Drop Rate:</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#fcd34d', minWidth: '35px' }}>{Math.round(config.failureRate * 100)}%</span>
          <input 
            type="range" 
            min="0" 
            max="0.5" 
            step="0.05" 
            value={config.failureRate} 
            onChange={handleFailureRateChange}
            style={{ width: '70px', cursor: 'pointer', accentColor: '#f59e0b' }} 
            title="Simulate random external API network failures to test retry & DLQ logic"
          />
        </div>

        {/* Quick Scenario Triggers */}
        <button className="btn btn-secondary btn-sm" onClick={runFlashSaleScenario} title="Simulate 40 incoming order notifications in parallel">
          <Zap className="w-3.5 h-3.5" style={{ color: '#06b6d4' }} />
          Flash Sale Load (40)
        </button>

        <button className="btn btn-danger btn-sm" onClick={runDevOpsOutageScenario} title="Trigger critical DevOps incident alerts">
          <ShieldAlert className="w-3.5 h-3.5" />
          DevOps Alert
        </button>

        <button className="btn btn-secondary btn-sm" onClick={() => queueEngine.purgeAll()} title="Clear all queues and stats">
          <Trash2 className="w-3.5 h-3.5" />
          Purge
        </button>
      </div>
    </header>
  );
}
