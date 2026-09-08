import React, { useState } from 'react';
import { 
  Send, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Sparkles, 
  Layers, 
  User, 
  Clock, 
  Code,
  Check
} from 'lucide-react';
import { DEFAULT_TEMPLATES, MOCK_RECIPIENTS } from '../engine/defaultTemplates';
import { queueEngine } from '../engine/NotificationQueueEngine';

export function DispatchConsole() {
  const [selectedTemplate, setSelectedTemplate] = useState(DEFAULT_TEMPLATES[0]);
  const [channel, setChannel] = useState('email');
  const [recipient, setRecipient] = useState(DEFAULT_TEMPLATES[0].recipient);
  const [phone, setPhone] = useState(DEFAULT_TEMPLATES[0].phone);
  const [subject, setSubject] = useState(DEFAULT_TEMPLATES[0].subject);
  const [body, setBody] = useState(DEFAULT_TEMPLATES[0].body);
  const [priority, setPriority] = useState('NORMAL');
  const [eventTopic, setEventTopic] = useState(DEFAULT_TEMPLATES[0].event);
  const [justDispatched, setJustDispatched] = useState(false);

  const handleTemplateSelect = (e) => {
    const tmpl = DEFAULT_TEMPLATES.find(t => t.id === e.target.value);
    if (!tmpl) return;
    setSelectedTemplate(tmpl);
    setEventTopic(tmpl.event);
    setSubject(tmpl.subject);
    setBody(tmpl.body);
    setRecipient(tmpl.recipient);
    setPhone(tmpl.phone);
    setPriority(tmpl.priority);
    setChannel(tmpl.channels[0] || 'email');
  };

  const handleRecipientSelect = (e) => {
    const r = MOCK_RECIPIENTS.find(rec => rec.email === e.target.value);
    if (r) {
      setRecipient(r.email);
      setPhone(r.phone);
    } else {
      setRecipient(e.target.value);
    }
  };

  const handleDispatch = (e) => {
    e.preventDefault();
    queueEngine.dispatch({
      channel,
      event: eventTopic,
      recipient,
      phone,
      subject,
      body,
      priority
    });

    setJustDispatched(true);
    setTimeout(() => setJustDispatched(false), 1200);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Sparkles className="w-5 h-5" style={{ color: '#818cf8' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Dispatch Console</h2>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Pub/Sub Event Producer</span>
      </div>

      {/* Preset Selector */}
      <div className="form-group">
        <label className="form-label">Notification Scenario Preset</label>
        <select className="form-select" value={selectedTemplate.id} onChange={handleTemplateSelect}>
          {DEFAULT_TEMPLATES.map(tmpl => (
            <option key={tmpl.id} value={tmpl.id}>
              {tmpl.name} ({tmpl.event})
            </option>
          ))}
        </select>
      </div>

      {/* Multi-Channel Selector */}
      <div className="form-group">
        <label className="form-label">Delivery Channel</label>
        <div className="channel-selector">
          <button 
            type="button"
            className={`channel-btn ${channel === 'email' ? 'active' : ''}`}
            data-channel="email"
            onClick={() => setChannel('email')}
          >
            <Mail className="w-4 h-4" /> Email
          </button>
          <button 
            type="button"
            className={`channel-btn ${channel === 'sms' ? 'active' : ''}`}
            data-channel="sms"
            onClick={() => setChannel('sms')}
          >
            <MessageSquare className="w-4 h-4" /> SMS
          </button>
          <button 
            type="button"
            className={`channel-btn ${channel === 'push' ? 'active' : ''}`}
            data-channel="push"
            onClick={() => setChannel('push')}
          >
            <Smartphone className="w-4 h-4" /> Push
          </button>
        </div>
      </div>

      <form onSubmit={handleDispatch}>
        {/* Recipient Target */}
        <div className="form-group">
          <label className="form-label">Target Recipient</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <select className="form-select" value={recipient} onChange={handleRecipientSelect}>
              {MOCK_RECIPIENTS.map(r => (
                <option key={r.email} value={r.email}>{r.name}</option>
              ))}
              <option value="custom@domain.com">Custom Recipient</option>
            </select>
            <input 
              type="text" 
              className="form-input" 
              value={channel === 'sms' ? phone : recipient} 
              onChange={e => channel === 'sms' ? setPhone(e.target.value) : setRecipient(e.target.value)}
              placeholder={channel === 'sms' ? "Phone number" : "Email address"} 
            />
          </div>
        </div>

        {/* Priority & Event Topic */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }} className="form-group">
          <div>
            <label className="form-label">Event Topic</label>
            <input 
              type="text" 
              className="form-input" 
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
              value={eventTopic}
              onChange={e => setEventTopic(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Priority Queue</label>
            <select className="form-select" value={priority} onChange={e => setPriority(e.target.value)}>
              <option value="LOW">LOW</option>
              <option value="NORMAL">NORMAL</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>
        </div>

        {/* Subject (for email / push header) */}
        <div className="form-group">
          <label className="form-label">Subject / Header</label>
          <input 
            type="text" 
            className="form-input" 
            value={subject} 
            onChange={e => setSubject(e.target.value)} 
          />
        </div>

        {/* Message Body */}
        <div className="form-group">
          <label className="form-label">Message Content</label>
          <textarea 
            className="form-textarea" 
            value={body} 
            onChange={e => setBody(e.target.value)} 
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
            {justDispatched ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            {justDispatched ? 'Published to EventBus!' : 'Publish Event'}
          </button>
          
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => queueEngine.dispatchBatch(10, channel)}
            title="Generate 10 synthetic messages in batch"
          >
            <Layers className="w-4 h-4" /> +10 Batch
          </button>
        </div>
      </form>
    </div>
  );
}
