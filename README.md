# ⚡ PulseNotify | Cloud-Based Multi-Channel Notification Platform

> An event-driven, serverless, queue-based notification system simulator providing real-time multi-channel alerts (Email, SMS, Push), worker auto-scaling, dead-letter queue (DLQ) inspection, and live device mockups.

---

## 🚀 Key Features

* **📱 Multi-Channel Notification Engine**:
  * **Email**: SendGrid SMTP Cloud simulator with HTML preview client.
  * **SMS**: Twilio API Gateway simulator with chat thread bubble preview.
  * **Push Notifications**: Firebase Cloud Messaging (FCM) simulator with lock-screen smartphone push banners.

* **🔄 Event-Driven Architecture (Pub/Sub)**:
  * Topic router mapping system events (`user.signup`, `auth.mfa_requested`, `order.shipped`, `billing.payment_failed`, `system.incident`) into dedicated channel pipelines.

* **⚡ Serverless Worker Scaling (AWS Lambda / GCP Functions)**:
  * Auto-scaling worker pool with dynamic concurrency control (1 to 12 active instances).
  * Real-time worker assignment, latency jitter, and execution telemetry.

* **🛡️ Resiliency, Retries & Dead Letter Queue (DLQ)**:
  * Exponential backoff retry policies.
  * Configurable network drop rate simulator (0% to 50%) for stress testing.
  * Dead Letter Queue (DLQ) for un-deliverable messages with manual **Replay** capabilities.

* **📊 Live SLA Telemetry & Analytics Dashboard**:
  * Real-time Delivery SLA %, Queue Processing Latency (ms), Worker Load %, and Channel Distribution counters.

---

## 🛠️ Tech Stack

- **Frontend Core**: React 19, Vite
- **UI & Styling**: Vanilla CSS, Dark Glassmorphism Design System, Custom Device Mockups
- **Icons**: Lucide React
- **Event Engine**: In-Browser EventBus, SQS-style Queue Engine, Lambda Pool State Machine

---

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

---

## ⚡ Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/cloud-notification-system.git
   cd cloud-notification-system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
project2/
├── src/
│   ├── components/
│   │   ├── Header.jsx                # Global navigation & engine controls
│   │   ├── DispatchConsole.jsx       # Event producer & batch load generator
│   │   ├── QueueArchitectureView.jsx # Pipeline diagram & worker pool status
│   │   ├── LiveDeliveryTracker.jsx   # Telemetry log table & DLQ inspector
│   │   ├── DeviceSimulators.jsx      # Live Smartphone Push, SMS & Email receivers
│   │   └── MetricsDashboard.jsx      # System SLA & telemetry analytics
│   ├── engine/
│   │   ├── NotificationQueueEngine.js# Core event router, SQS & Lambda engine
│   │   └── defaultTemplates.js       # Pre-built scenarios & mock data
│   ├── App.jsx                       # Main application shell
│   ├── main.jsx                      # Vite entrypoint
│   └── index.css                     # Design system tokens & CSS styling
├── index.html                        # HTML5 document & Google Fonts
├── vite.config.js                    # Vite configuration
└── package.json                      # Dependencies & scripts
```

---

## 📄 License

MIT License © 2026 PulseNotify Team
