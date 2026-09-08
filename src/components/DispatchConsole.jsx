import { useState } from 'react';
import {
  Send,
  Mail,
  MessageSquare,
  Smartphone,
  Sparkles,
  Layers,
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

  const applyTemplate = (e) => {
    const template = DEFAULT_TEMPLATES.find(t => t.id === e.target.value);
    if (!template) return;

    setSelectedTemplate(template);
    setEventTopic(template.event);
    setSubject(template.subject);
    setBody(template.body);
    setRecipient(template.recipient);
    setPhone(template.phone);
    setPriority(template.priority);
    setChannel(template.channels[0] || 'email');
  };

  const applyRecipient = (e) => {
    const found = MOCK_RECIPIENTS.find(r => r.email === e.target.value);
    if (found) {
      setRecipient(found.email);
      setPhone(found.phone);
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
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Sparkles className="w-5 h-5" style={{ color: '#818cf8' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>
            Dispatch Console
          </h2>
        </div>
        <span style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)'
        }}>
          Event Producer
        </span>
      </div>

      <div className="form-group">
        <label className="form-label">Scenario Template</label>
        <select
          className="form-select"
          value={selectedTemplate.id}
          onChange={applyTemplate}
        >
          {DEFAULT_TEMPLATES.map(t => (
            <option key={t.id} value={t.id}>
              {t.name} ({t.event})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Channel</label>
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
        <div className="form-group">
          <label className="form-label">Recipient</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <select className="form-select" value={recipient} onChange={applyRecipient}>
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
            <label className="form-label">Priority</label>
            <select
              className="form-select"
              value={priority}
              onChange={e => setPriority(e.target.value)}
            >
              <option value="LOW">LOW</option>
              <option value="NORMAL">NORMAL</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Subject / Header</label>
          <input
            type="text"
            className="form-input"
            value={subject}
            onChange={e => setSubject(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Message Body</label>
          <textarea
            className="form-textarea"
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={3}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
            {justDispatched ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            {justDispatched ? 'Sent!' : 'Send Event'}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => queueEngine.dispatchBatch(10, channel)}
            title="Generate 10 synthetic messages"
          >
            <Layers className="w-4 h-4" /> +10 Batch
          </button>
        </div>
      </form>
    </div>
  );
}
