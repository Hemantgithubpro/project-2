import React, { useState } from 'react';
import { 
  Smartphone, 
  Mail, 
  MessageSquare, 
  Bell, 
  Wifi, 
  Battery, 
  User, 
  Inbox, 
  ChevronRight,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

export function DeviceSimulators({ state }) {
  const { completed } = state;
  const [deviceTab, setDeviceTab] = useState('push'); // 'push' | 'sms' | 'email'

  // Filter delivered messages by channel
  const pushList = completed.filter(m => m.channel === 'push');
  const smsList = completed.filter(m => m.channel === 'sms');
  const emailList = completed.filter(m => m.channel === 'email');

  const [selectedEmail, setSelectedEmail] = useState(null);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Smartphone className="w-5 h-5" style={{ color: '#f59e0b' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Client Device Receivers (Live Simulation)</h2>
        </div>

        {/* Device Switcher */}
        <div className="channel-selector" style={{ minWidth: '280px' }}>
          <button 
            type="button"
            className={`channel-btn ${deviceTab === 'push' ? 'active' : ''}`}
            onClick={() => setDeviceTab('push')}
          >
            <Smartphone className="w-4 h-4" /> Push ({pushList.length})
          </button>
          <button 
            type="button"
            className={`channel-btn ${deviceTab === 'sms' ? 'active' : ''}`}
            onClick={() => setDeviceTab('sms')}
          >
            <MessageSquare className="w-4 h-4" /> SMS ({smsList.length})
          </button>
          <button 
            type="button"
            className={`channel-btn ${deviceTab === 'email' ? 'active' : ''}`}
            onClick={() => setDeviceTab('email')}
          >
            <Mail className="w-4 h-4" /> Email ({emailList.length})
          </button>
        </div>
      </div>

      {/* PUSH SMARTPHONE MOCKUP */}
      {deviceTab === 'push' && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
          <div className="phone-mockup">
            <div className="phone-notch"></div>
            {/* Status bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', padding: '0 0.5rem 0.5rem 0.5rem' }}>
              <span>9:41 AM</span>
              <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                <Wifi className="w-3 h-3" />
                <Battery className="w-3 h-3" />
              </div>
            </div>

            {/* Smartphone Lock Screen / Notification Feed */}
            <div className="phone-screen">
              {pushList.length === 0 ? (
                <div style={{ textAlign: 'center', margin: 'auto 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  <Bell className="w-8 h-8" style={{ margin: '0 auto 0.5rem auto', opacity: 0.3 }} />
                  <div>No Push Notifications Yet</div>
                  <div style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>Dispatch a push notification to see it arrive in real-time.</div>
                </div>
              ) : (
                pushList.map(msg => (
                  <div key={msg.id} className="push-notification-banner">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <div style={{ width: '16px', height: '16px', background: 'var(--primary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Bell className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'white' }}>PULSENOTIFY</span>
                      </div>
                      <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)' }}>
                        {new Date(msg.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white', marginBottom: '0.15rem' }}>
                      {msg.subject}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#cbd5e1', lineHeight: '1.3' }}>
                      {msg.body}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SMS CHAT BUBBLE MOCKUP */}
      {deviceTab === 'sms' && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
          <div className="phone-mockup" style={{ height: '520px' }}>
            <div className="phone-notch"></div>
            <div style={{ background: '#1e293b', padding: '1.8rem 1rem 0.6rem 1rem', borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>Cloud SMS Gateway</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>+1 (800) 555-PULSE</div>
            </div>

            <div className="phone-screen" style={{ background: '#090d16', padding: '1rem' }}>
              {smsList.length === 0 ? (
                <div style={{ textAlign: 'center', margin: 'auto 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  <MessageSquare className="w-8 h-8" style={{ margin: '0 auto 0.5rem auto', opacity: 0.3 }} />
                  <div>SMS Thread Empty</div>
                </div>
              ) : (
                smsList.map(msg => (
                  <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{
                      background: 'rgba(6, 182, 212, 0.15)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      borderRadius: '16px 16px 16px 4px',
                      padding: '0.65rem 0.85rem',
                      maxWidth: '85%',
                      color: 'white',
                      fontSize: '0.75rem'
                    }}>
                      <div style={{ fontWeight: 700, color: '#67e8f9', marginBottom: '0.2rem', fontSize: '0.7rem' }}>
                        {msg.subject}
                      </div>
                      {msg.body}
                    </div>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.2rem', marginLeft: '0.4rem' }}>
                      {new Date(msg.updatedAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* EMAIL CLIENT MOCKUP */}
      {deviceTab === 'email' && (
        <div className="email-client">
          <div className="email-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Inbox className="w-4 h-4" style={{ color: '#818cf8' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>Inbox (Simulated Client Mail)</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emailList.length} Messages</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '320px' }}>
            {/* Email List Sidebar */}
            <div style={{ borderRight: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', overflowY: 'auto', maxHeight: '380px' }}>
              {emailList.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  No emails received yet.
                </div>
              ) : (
                emailList.map(msg => (
                  <div 
                    key={msg.id} 
                    onClick={() => setSelectedEmail(msg)}
                    style={{
                      padding: '0.75rem',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      cursor: 'pointer',
                      background: (selectedEmail && selectedEmail.id === msg.id) ? 'rgba(99, 102, 241, 0.15)' : 'transparent'
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {msg.subject}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', marginTop: '0.2rem' }}>
                      <span>{msg.recipient}</span>
                      <span>{new Date(msg.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Email Body Detail */}
            <div className="email-body">
              {selectedEmail ? (
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>{selectedEmail.subject}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <User className="w-4 h-4" />
                    <div>
                      <div>From: <strong>CloudPulse Dispatch &lt;noreply@cloudpulse.io&gt;</strong></div>
                      <div>To: <strong>{selectedEmail.recipient}</strong></div>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', lineHeight: '1.6', fontSize: '0.875rem' }}>
                    <p style={{ marginBottom: '1rem' }}>{selectedEmail.body}</p>
                    <hr style={{ border: 0, borderTop: '1px solid var(--border-color)', margin: '1rem 0' }} />
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                      This notification was delivered via SendGrid SMTP Cloud Infrastructure (Latency: 42ms).<br/>
                      Tracking ID: <span style={{ fontFamily: 'var(--font-mono)' }}>{selectedEmail.id}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Select an email from the left sidebar to preview its full HTML content.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
