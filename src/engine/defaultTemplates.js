export const DEFAULT_TEMPLATES = [
  {
    id: 'user_welcome',
    name: 'User Welcome & Onboarding',
    event: 'user.signup',
    channels: ['email', 'push'],
    subject: 'Welcome to EventSignal, {{name}}!',
    body: 'Hi {{name}}, your account is ready on region {{region}}. Access your dashboard to get started.',
    recipient: 'alex.dev@company.io',
    phone: '+1 (555) 019-2834',
    priority: 'NORMAL',
    data: { name: 'Alex Rivera', region: 'us-east-1', plan: 'Enterprise' }
  },
  {
    id: 'security_alert',
    name: '2FA Security Verification',
    event: 'auth.mfa_requested',
    channels: ['sms', 'push'],
    subject: 'Security Alert: Login Attempt',
    body: 'Your EventSignal verification code is {{code}}. Valid for 5 minutes. Do not share.',
    recipient: 'alex.dev@company.io',
    phone: '+1 (555) 019-2834',
    priority: 'HIGH',
    data: { code: '849-201', location: 'San Francisco, CA' }
  },
  {
    id: 'order_shipped',
    name: 'Order Status Update',
    event: 'order.shipped',
    channels: ['email', 'sms', 'push'],
    subject: 'Order #{{orderId}} is on its way!',
    body: 'Your package with {{item}} has shipped via Express Delivery. Tracking: {{trackingId}}',
    recipient: 'customer@store.com',
    phone: '+1 (555) 349-9912',
    priority: 'NORMAL',
    data: { orderId: 'ORD-98421', item: 'Developer Workstation M3 Pro', trackingId: 'TRK-90021-X' }
  },
  {
    id: 'payment_failed',
    name: 'Payment & Billing Warning',
    event: 'billing.payment_failed',
    channels: ['email', 'sms'],
    subject: 'Action Required: Payment Failed for Invoice #{{invoiceId}}',
    body: 'We could not process your payment of ${{amount}}. Please update your payment method to avoid interruption.',
    recipient: 'billing@enterprise.org',
    phone: '+1 (555) 881-3004',
    priority: 'URGENT',
    data: { invoiceId: 'INV-4410', amount: '299.00', cardEnding: '4242' }
  },
  {
    id: 'system_outage',
    name: 'Incident Alert',
    event: 'system.incident',
    channels: ['sms', 'push'],
    subject: 'CRITICAL: Database Latency Spike',
    body: 'ALERT: Cluster {{cluster}} reporting high latency ({{latency}}ms). Auto-remediation triggered.',
    recipient: 'oncall@devops.net',
    phone: '+1 (555) 911-0000',
    priority: 'CRITICAL',
    data: { cluster: 'prod-us-west-2-db', latency: '4200' }
  }
];

export const MOCK_RECIPIENTS = [
  { name: 'Alex Rivera (Dev Lead)', email: 'alex.dev@company.io', phone: '+1 (555) 019-2834', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { name: 'Sarah Chen (DevOps)', email: 'oncall@devops.net', phone: '+1 (555) 911-0000', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
  { name: 'Marcus Brody (VIP Client)', email: 'marcus@acmecorp.com', phone: '+1 (555) 349-9912', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' }
];
