import { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertOctagon,
  Clock,
  RotateCcw,
  Eye,
  Mail,
  MessageSquare,
  Smartphone,
  FileText,
  X,
  Search
} from 'lucide-react';
import { queueEngine } from '../engine/NotificationQueueEngine';

export function LiveDeliveryTracker({ state }) {
  const { queue, completed, dlq } = state;
  const [activeTab, setActiveTab] = useState('live');
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'email':
        return <Mail className="w-3.5 h-3.5" style={{ color: '#818cf8' }} />;
      case 'sms':
        return <MessageSquare className="w-3.5 h-3.5" style={{ color: '#06b6d4' }} />;
      case 'push':
        return <Smartphone className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} />;
      default:
        return <FileText className="w-3.5 h-3.5" />;
    }
  };

  const getStatusPill = (status) => (
    <span className={`status-pill status-${status}`}>{status}</span>
  );

  const filterBySearch = (list) => {
    if (!searchTerm) return list;
    const query = searchTerm.toLowerCase();
    return list.filter(j =>
      j.id.toLowerCase().includes(query) ||
      j.recipient.toLowerCase().includes(query) ||
      j.event.toLowerCase().includes(query) ||
      j.subject.toLowerCase().includes(query)
    );
  };

  const displayList = activeTab === 'live'
    ? filterBySearch(queue)
    : activeTab === 'delivered'
      ? filterBySearch(completed)
      : filterBySearch(dlq);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Activity className="w-5 h-5" style={{ color: '#10b981' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>
            Delivery Tracker & Telemetry
          </h2>
        </div>

        <div style={{ position: 'relative', width: '220px' }}>
          <Search
            className="w-3.5 h-3.5"
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search ID, event, recipient..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '28px', fontSize: '0.75rem' }}
          />
        </div>
      </div>

      <div className="tabs-header">
        <button
          className={`tab-btn ${activeTab === 'live' ? 'active' : ''}`}
          onClick={() => setActiveTab('live')}
        >
          <Clock className="w-4 h-4" /> Active ({queue.length})
        </button>

        <button
          className={`tab-btn ${activeTab === 'delivered' ? 'active' : ''}`}
          onClick={() => setActiveTab('delivered')}
        >
          <CheckCircle2 className="w-4 h-4" /> Delivered ({completed.length})
        </button>

        <button
          className={`tab-btn ${activeTab === 'dlq' ? 'active' : ''}`}
          onClick={() => setActiveTab('dlq')}
          style={{ color: dlq.length > 0 ? '#fca5a5' : undefined }}
        >
          <AlertOctagon className="w-4 h-4" /> DLQ ({dlq.length})
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
          textAlign: 'left'
        }}>
          <thead>
            <tr style={{
              borderBottom: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              fontSize: '0.7rem',
              letterSpacing: '0.05em'
            }}>
              <th style={{ padding: '0.6rem 0.75rem' }}>ID</th>
              <th style={{ padding: '0.6rem 0.75rem' }}>Channel / Event</th>
              <th style={{ padding: '0.6rem 0.75rem' }}>Recipient</th>
              <th style={{ padding: '0.6rem 0.75rem' }}>Priority</th>
              <th style={{ padding: '0.6rem 0.75rem' }}>Status</th>
              <th style={{ padding: '0.6rem 0.75rem' }}>Worker</th>
              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayList.length === 0 ? (
              <tr>
                <td colSpan={7} style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: 'var(--text-muted)'
                }}>
                  No messages in this view.
                </td>
              </tr>
            ) : (
              displayList.map(job => (
                <tr
                  key={job.id}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    transition: 'background 0.15s ease'
                  }}
                >
                  <td style={{
                    padding: '0.6rem 0.75rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'white',
                    fontWeight: 600
                  }}>
                    {job.id}
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {getChannelIcon(job.channel)}
                      <span style={{ fontWeight: 600, color: 'white' }}>{job.event}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)' }}>
                    {job.channel === 'sms' ? job.phone : job.recipient}
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem' }}>
                    <span className={`priority-pill priority-${job.priority}`}>
                      {job.priority}
                    </span>
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem' }}>
                    {getStatusPill(job.status)}
                  </td>
                  <td style={{
                    padding: '0.6rem 0.75rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem'
                  }}>
                    {job.assignedWorker || 'Unassigned'} ({job.attempts}/{job.maxRetries + 1})
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      {activeTab === 'dlq' && (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => queueEngine.retryDLQMessage(job.id)}
                          title="Replay from DLQ back into queue"
                        >
                          <RotateCcw className="w-3 h-3" /> Replay
                        </button>
                      )}
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedJob(job)}
                        title="View audit trace & payload"
                      >
                        <Eye className="w-3 h-3" /> Inspect
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedJob && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200, padding: '1rem'
        }}>
          <div
            className="glass-panel"
            style={{ width: '100%', maxWidth: '650px', padding: '1.5rem', maxHeight: '85vh', overflowY: 'auto' }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText className="w-5 h-5" style={{ color: '#818cf8' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>
                  Trace: {selectedJob.id}
                </h3>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedJob(null)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div style={{
              marginBottom: '1rem',
              fontSize: '0.8rem',
              color: 'var(--text-muted)'
            }}>
              <div><strong>Subject:</strong> {selectedJob.subject}</div>
              <div><strong>Event:</strong> {selectedJob.event}</div>
              <div><strong>Channel:</strong> {selectedJob.channel} | <strong>Priority:</strong> {selectedJob.priority}</div>
            </div>

            <h4 style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              marginBottom: '0.5rem',
              textTransform: 'uppercase'
            }}>
              Execution Trace
            </h4>
            <div style={{
              background: '#090d16',
              borderRadius: '8px',
              padding: '0.75rem',
              marginBottom: '1.25rem',
              border: '1px solid var(--border-color)'
            }}>
              {selectedJob.logs.map((log, idx) => (
                <div
                  key={idx}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.725rem',
                    color: '#cbd5e1',
                    marginBottom: '0.35rem'
                  }}
                >
                  <span style={{ color: '#6366f1', marginRight: '0.5rem' }}>
                    [{log.timestamp}]
                  </span>
                  {log.text}
                </div>
              ))}
            </div>

            <h4 style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              marginBottom: '0.5rem',
              textTransform: 'uppercase'
            }}>
              Payload
            </h4>
            <pre style={{
              background: '#090d16',
              padding: '0.75rem',
              borderRadius: '8px',
              fontSize: '0.725rem',
              fontFamily: 'var(--font-mono)',
              color: '#67e8f9',
              overflowX: 'auto',
              border: '1px solid var(--border-color)'
            }}>
              {JSON.stringify(selectedJob, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
