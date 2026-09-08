import {
  Bell,
  Zap,
  Cpu,
  AlertTriangle,
  ShieldAlert,
  Trash2
} from 'lucide-react';
import { queueEngine } from '../engine/NotificationQueueEngine';

export function Header({ state }) {
  const { workerCount, config, queue, dlq, completed } = state;

  const onWorkerAdjust = (e) => {
    queueEngine.setWorkerCount(parseInt(e.target.value, 10));
  };

  const onDropRateAdjust = (e) => {
    queueEngine.setFailureRate(parseFloat(e.target.value));
  };

  const triggerFlashSale = () => {
    queueEngine.dispatchBatch(40, 'all');
  };

  const triggerOutageAlerts = () => {
    for (let idx = 0; idx < 8; idx++) {
      queueEngine.dispatch({
        channel: idx % 2 === 0 ? 'sms' : 'push',
        event: 'system.incident',
        recipient: 'oncall@devops.net',
        phone: '+1 (555) 911-0000',
        subject: `CRITICAL: Cluster db-us-east-${idx + 1} unreachable`,
        body: `High latency & packet loss detected on node ${idx + 1}. Auto-remediation initiated.`,
        priority: 'CRITICAL'
      });
    }
  };

  const controlPanelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(0,0,0,0.3)',
    padding: '0.4rem 0.8rem',
    borderRadius: '10px',
    border: '1px solid var(--border-color)'
  };

  return (
    <header className="header-bar">
      <div className="logo-group">
        <div className="logo-icon">
          <Bell className="w-5 h-5" />
        </div>
        <div className="logo-text">
          <h1>EventSignal</h1>
          <p>Multi-Channel Event Notification Engine</p>
        </div>
        <div className="pulse-badge" style={{ marginLeft: '1rem' }}>
          <span className="pulse-dot"></span>
          <span>Engine Active (Queue + Workers)</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={controlPanelStyle}>
          <Cpu className="w-4 h-4 text-indigo-400" style={{ color: '#818cf8' }} />
          <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Workers:
          </span>
          <span style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            color: '#a5b4fc',
            minWidth: '20px'
          }}>
            {workerCount}
          </span>
          <input
            type="range"
            min="1"
            max="12"
            value={workerCount}
            onChange={onWorkerAdjust}
            style={{ width: '70px', cursor: 'pointer', accentColor: '#6366f1' }}
            title="Adjust worker pool concurrency"
          />
        </div>

        <div style={controlPanelStyle}>
          <AlertTriangle className="w-4 h-4 text-amber-400" style={{ color: '#f59e0b' }} />
          <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Drop Rate:
          </span>
          <span style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            color: '#fcd34d',
            minWidth: '35px'
          }}>
            {Math.round(config.failureRate * 100)}%
          </span>
          <input
            type="range"
            min="0"
            max="0.5"
            step="0.05"
            value={config.failureRate}
            onChange={onDropRateAdjust}
            style={{ width: '70px', cursor: 'pointer', accentColor: '#f59e0b' }}
            title="Simulate network failures to test retry & DLQ behavior"
          />
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={triggerFlashSale}
          title="Simulate 40 incoming notifications"
        >
          <Zap className="w-3.5 h-3.5" style={{ color: '#06b6d4' }} />
          Flash Sale (40)
        </button>

        <button
          className="btn btn-danger btn-sm"
          onClick={triggerOutageAlerts}
          title="Trigger critical incident alerts"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          Outage Alert
        </button>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => queueEngine.purgeAll()}
          title="Clear all queues and reset stats"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>
    </header>
  );
}
