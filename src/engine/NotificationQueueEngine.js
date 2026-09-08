/**
 * EventSignal Notification Engine
 * Simulates an event-driven architecture with a message queue,
 * worker pool, and multi-channel delivery providers.
 */

export class NotificationQueueEngine {
  constructor() {
    this.queue = [];
    this.completed = [];
    this.dlq = [];
    this.workers = [];
    this.workerCount = 4;
    this.listeners = new Set();
    this.isRunning = true;

    this.config = {
      failureRate: 0.05,
      maxRetries: 3,
      workerSpeedMs: 1200,
      jitterMs: 400,
      autoRateLimit: false,
      channels: {
        email: { provider: 'SendGrid SMTP', status: 'healthy', latency: '45ms' },
        sms: { provider: 'Twilio API', status: 'healthy', latency: '120ms' },
        push: { provider: 'Firebase FCM', status: 'healthy', latency: '25ms' }
      }
    };

    this.stats = {
      totalDispatched: 0,
      totalDelivered: 0,
      totalFailed: 0,
      totalRetried: 0,
      avgLatencyMs: 0,
      channelCounts: { email: 0, sms: 0, push: 0 },
      eventsPerSecHistory: []
    };

    this.initWorkers();
    this.startLoop();
  }

  initWorkers() {
    this.workers = Array.from({ length: this.workerCount }, (_, idx) => ({
      id: `worker-${String(idx + 1).padStart(2, '0')}`,
      status: 'idle',
      currentJob: null,
      jobsCompleted: 0
    }));
  }

  setWorkerCount(count) {
    this.workerCount = Math.max(1, Math.min(20, count));

    if (this.workers.length < this.workerCount) {
      for (let idx = this.workers.length; idx < this.workerCount; idx++) {
        this.workers.push({
          id: `worker-${String(idx + 1).padStart(2, '0')}`,
          status: 'idle',
          currentJob: null,
          jobsCompleted: 0
        });
      }
    } else if (this.workers.length > this.workerCount) {
      this.workers = this.workers.slice(0, this.workerCount);
    }
    this.notify();
  }

  setFailureRate(rate) {
    this.config.failureRate = rate;
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.getState()));
  }

  getState() {
    return {
      queue: [...this.queue],
      completed: [...this.completed],
      dlq: [...this.dlq],
      workers: [...this.workers],
      workerCount: this.workerCount,
      config: { ...this.config },
      stats: { ...this.stats }
    };
  }

  dispatch({ channel, recipient, subject, body, priority = 'NORMAL', event = 'custom.event', phone = '', metadata = {} }) {
    const id = 'msg_' + Math.random().toString(36).substring(2, 10);
    const createdAt = new Date().toISOString();

    const job = {
      id,
      event,
      channel,
      recipient,
      phone: phone || recipient,
      subject,
      body,
      priority,
      status: 'queued',
      attempts: 0,
      maxRetries: this.config.maxRetries,
      createdAt,
      updatedAt: createdAt,
      assignedWorker: null,
      logs: [{ timestamp: new Date().toLocaleTimeString(), text: `Event '${event}' published [channel:${channel}]` }],
      metadata
    };

    if (priority === 'CRITICAL' || priority === 'HIGH') {
      this.queue.unshift(job);
    } else {
      this.queue.push(job);
    }

    this.stats.totalDispatched++;
    this.stats.channelCounts[channel] = (this.stats.channelCounts[channel] || 0) + 1;
    this.notify();
    return job;
  }

  dispatchBatch(count = 10, channelFilter = 'all') {
    const channels = ['email', 'sms', 'push'];
    const events = ['user.signup', 'order.shipped', 'payment.failed', 'auth.mfa', 'system.alert'];

    for (let idx = 0; idx < count; idx++) {
      const ch = channelFilter === 'all'
        ? channels[Math.floor(Math.random() * channels.length)]
        : channelFilter;
      const ev = events[Math.floor(Math.random() * events.length)];
      const idNum = Math.floor(1000 + Math.random() * 9000);

      this.dispatch({
        channel: ch,
        event: ev,
        recipient: `user_${idNum}@domain.com`,
        phone: `+1 (555) 01${Math.floor(10 + Math.random() * 89)}-${idNum}`,
        subject: `[Batch #${idx + 1}] Alert: ${ev}`,
        body: `Auto-generated event payload for batch test #${idx + 1}.`,
        priority: idx % 4 === 0 ? 'HIGH' : 'NORMAL'
      });
    }
  }

  startLoop() {
    this.intervalId = setInterval(() => {
      if (!this.isRunning) return;
      this.processQueue();
    }, 400);
  }

  processQueue() {
    if (this.queue.length === 0) return;

    const idleWorkers = this.workers.filter(w => w.status === 'idle');
    if (idleWorkers.length === 0) return;

    const jobIndex = this.queue.findIndex(j => j.status === 'queued' || j.status === 'retrying');
    if (jobIndex === -1) return;

    const job = this.queue[jobIndex];
    const worker = idleWorkers[0];

    job.status = 'processing';
    job.assignedWorker = worker.id;
    job.updatedAt = new Date().toISOString();
    job.attempts++;
    job.logs.push({
      timestamp: new Date().toLocaleTimeString(),
      text: `Worker '${worker.id}' picked up job (Attempt ${job.attempts}/${job.maxRetries + 1})`
    });

    worker.status = 'processing';
    worker.currentJob = job.id;

    this.notify();

    const processTime = this.config.workerSpeedMs +
      (Math.random() * this.config.jitterMs - this.config.jitterMs / 2);

    setTimeout(() => {
      this.completeJob(job, worker);
    }, Math.max(300, processTime));
  }

  completeJob(job, worker) {
    const didFail = Math.random() < this.config.failureRate;

    if (!didFail) {
      job.status = 'delivered';
      job.updatedAt = new Date().toISOString();
      job.logs.push({
        timestamp: new Date().toLocaleTimeString(),
        text: `Delivered via ${this.config.channels[job.channel]?.provider || job.channel.toUpperCase()}`
      });

      this.queue = this.queue.filter(j => j.id !== job.id);
      this.completed.unshift(job);
      if (this.completed.length > 200) this.completed.pop();

      this.stats.totalDelivered++;

      const createdMs = new Date(job.createdAt).getTime();
      const deliveredMs = new Date(job.updatedAt).getTime();
      const latency = deliveredMs - createdMs;
      this.stats.avgLatencyMs = this.stats.avgLatencyMs === 0
        ? latency
        : Math.round(this.stats.avgLatencyMs * 0.8 + latency * 0.2);
    } else {
      if (job.attempts <= job.maxRetries) {
        job.status = 'retrying';
        job.updatedAt = new Date().toISOString();
        const backoffSec = Math.pow(2, job.attempts);
        job.logs.push({
          timestamp: new Date().toLocaleTimeString(),
          text: `API Error. Retry #${job.attempts} in ${backoffSec}s (Exponential Backoff)`
        });
        this.stats.totalRetried++;
      } else {
        job.status = 'failed';
        job.updatedAt = new Date().toISOString();
        job.logs.push({
          timestamp: new Date().toLocaleTimeString(),
          text: `Max retries exceeded (${job.maxRetries}). Moved to DLQ.`
        });

        this.queue = this.queue.filter(j => j.id !== job.id);
        this.dlq.unshift(job);
        this.stats.totalFailed++;
      }
    }

    worker.status = 'idle';
    worker.currentJob = null;
    worker.jobsCompleted++;

    this.notify();
  }

  retryDLQMessage(id) {
    const idx = this.dlq.findIndex(j => j.id === id);
    if (idx === -1) return;

    const [job] = this.dlq.splice(idx, 1);
    job.status = 'queued';
    job.attempts = 0;
    job.logs.push({
      timestamp: new Date().toLocaleTimeString(),
      text: `Manually replayed from DLQ by operator.`
    });

    this.queue.unshift(job);
    this.notify();
  }

  clearCompleted() {
    this.completed = [];
    this.notify();
  }

  clearDLQ() {
    this.dlq = [];
    this.notify();
  }

  purgeAll() {
    this.queue = [];
    this.completed = [];
    this.dlq = [];
    this.stats = {
      totalDispatched: 0,
      totalDelivered: 0,
      totalFailed: 0,
      totalRetried: 0,
      avgLatencyMs: 0,
      channelCounts: { email: 0, sms: 0, push: 0 },
      eventsPerSecHistory: []
    };
    this.notify();
  }
}

export const queueEngine = new NotificationQueueEngine();
