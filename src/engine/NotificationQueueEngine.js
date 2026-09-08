/**
 * Cloud-Based Notification Engine
 * Simulates an Event-Driven Architecture with Message Queue (SQS/RabbitMQ),
 * Serverless Worker Pool (AWS Lambda / GCP Functions), and multi-channel delivery provider.
 */

export class NotificationQueueEngine {
  constructor() {
    this.queue = [];             // Active queue items awaiting or in processing
    this.completed = [];         // Successfully delivered messages
    this.dlq = [];               // Dead Letter Queue for failed messages after max retries
    this.workers = [];           // Serverless workers status
    this.workerCount = 4;        // Default active worker concurrency
    this.listeners = new Set();  // React subscribers
    this.isRunning = true;
    
    // Configurable simulated network settings
    this.config = {
      failureRate: 0.05,         // 5% simulated random API gateway drops
      maxRetries: 3,
      workerSpeedMs: 1200,       // Time per worker job processing
      jitterMs: 400,
      autoRateLimit: false,
      channels: {
        email: { provider: 'SendGrid Cloud SMTP', status: 'healthy', latency: '45ms' },
        sms: { provider: 'Twilio Gateway API', status: 'healthy', latency: '120ms' },
        push: { provider: 'Firebase Cloud Messaging (FCM)', status: 'healthy', latency: '25ms' }
      }
    };

    // Telemetry Stats
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
    this.workers = Array.from({ length: this.workerCount }, (_, i) => ({
      id: `lambda-worker-${String(i + 1).padStart(2, '0')}`,
      status: 'idle', // 'idle' | 'processing' | 'cooldown'
      currentJob: null,
      jobsCompleted: 0
    }));
  }

  setWorkerCount(count) {
    this.workerCount = Math.max(1, Math.min(20, count));
    if (this.workers.length < this.workerCount) {
      for (let i = this.workers.length; i < this.workerCount; i++) {
        this.workers.push({
          id: `lambda-worker-${String(i + 1).padStart(2, '0')}`,
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

  /**
   * Dispatch a new notification event into the queue system
   */
  dispatch({ channel, recipient, subject, body, priority = 'NORMAL', event = 'custom.event', phone = '', metadata = {} }) {
    const id = 'msg_' + Math.random().toString(36).substring(2, 10);
    const createdAt = new Date().toISOString();

    const job = {
      id,
      event,
      channel, // 'email' | 'sms' | 'push'
      recipient,
      phone: phone || recipient,
      subject,
      body,
      priority, // 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL'
      status: 'queued', // 'queued' | 'processing' | 'sent' | 'delivered' | 'failed' | 'retrying'
      attempts: 0,
      maxRetries: this.config.maxRetries,
      createdAt,
      updatedAt: createdAt,
      assignedWorker: null,
      logs: [{ timestamp: new Date().toLocaleTimeString(), text: `Event '${event}' published to topic [channel:${channel}]` }],
      metadata
    };

    // High and Critical priority get pushed to front of queue
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

  /**
   * Dispatch batch of events for load testing
   */
  dispatchBatch(count = 10, channelFilter = 'all') {
    const channels = ['email', 'sms', 'push'];
    const events = ['user.signup', 'order.shipped', 'payment.failed', 'auth.mfa', 'system.alert'];
    
    for (let i = 0; i < count; i++) {
      const channel = channelFilter === 'all' ? channels[Math.floor(Math.random() * channels.length)] : channelFilter;
      const ev = events[Math.floor(Math.random() * events.length)];
      const idNum = Math.floor(1000 + Math.random() * 9000);
      
      this.dispatch({
        channel,
        event: ev,
        recipient: `user_${idNum}@domain.com`,
        phone: `+1 (555) 01${Math.floor(10 + Math.random() * 89)}-${idNum}`,
        subject: `[Batch #${i+1}] Alert regarding ${ev}`,
        body: `Automated event payload generated for batch simulation test #${i+1}.`,
        priority: i % 4 === 0 ? 'HIGH' : 'NORMAL'
      });
    }
  }

  /**
   * Main asynchronous queue tick processing loop
   */
  startLoop() {
    this.intervalId = setInterval(() => {
      if (!this.isRunning) return;
      this.processQueue();
    }, 400);
  }

  processQueue() {
    if (this.queue.length === 0) return;

    // Find available idle workers
    const idleWorkers = this.workers.filter(w => w.status === 'idle');
    if (idleWorkers.length === 0) return;

    // Pick top job from queue
    const queuedJobIndex = this.queue.findIndex(j => j.status === 'queued' || j.status === 'retrying');
    if (queuedJobIndex === -1) return;

    const job = this.queue[queuedJobIndex];
    const worker = idleWorkers[0];

    // Assign job to worker
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

    // Calculate simulated processing time with latency jitter
    const processTime = this.config.workerSpeedMs + (Math.random() * this.config.jitterMs - this.config.jitterMs / 2);

    setTimeout(() => {
      this.finishJobProcessing(job, worker);
    }, Math.max(300, processTime));
  }

  finishJobProcessing(job, worker) {
    const isSimulatedFailure = Math.random() < this.config.failureRate;

    if (!isSimulatedFailure) {
      // SUCCESSFUL DELIVERY
      job.status = 'delivered';
      job.updatedAt = new Date().toISOString();
      job.logs.push({
        timestamp: new Date().toLocaleTimeString(),
        text: `Successfully dispatched via ${this.config.channels[job.channel]?.provider || job.channel.toUpperCase()}`
      });

      // Remove from queue and add to completed
      this.queue = this.queue.filter(j => j.id !== job.id);
      this.completed.unshift(job);
      if (this.completed.length > 200) this.completed.pop(); // Keep array bounded

      this.stats.totalDelivered++;
      
      // Calculate latency
      const createdTime = new Date(job.createdAt).getTime();
      const deliveredTime = new Date(job.updatedAt).getTime();
      const latency = deliveredTime - createdTime;
      this.stats.avgLatencyMs = this.stats.avgLatencyMs === 0 
        ? latency 
        : Math.round(this.stats.avgLatencyMs * 0.8 + latency * 0.2);

    } else {
      // FAILURE ENCOUNTERED
      if (job.attempts <= job.maxRetries) {
        job.status = 'retrying';
        job.updatedAt = new Date().toISOString();
        const backoffSec = Math.pow(2, job.attempts);
        job.logs.push({
          timestamp: new Date().toLocaleTimeString(),
          text: `⚠️ API Gateway Error. Scheduling retry #${job.attempts} in ${backoffSec}s (Exponential Backoff)`
        });
        this.stats.totalRetried++;
      } else {
        // EXCEEDED MAX RETRIES -> MOVE TO DEAD LETTER QUEUE (DLQ)
        job.status = 'failed';
        job.updatedAt = new Date().toISOString();
        job.logs.push({
          timestamp: new Date().toLocaleTimeString(),
          text: `🚨 Max retries exceeded (${job.maxRetries}). Message routed to Dead Letter Queue (DLQ).`
        });

        this.queue = this.queue.filter(j => j.id !== job.id);
        this.dlq.unshift(job);
        this.stats.totalFailed++;
      }
    }

    // Release worker back to idle
    worker.status = 'idle';
    worker.currentJob = null;
    worker.jobsCompleted++;

    this.notify();
  }

  /**
   * Replay a message from DLQ back into the active queue
   */
  retryDLQMessage(id) {
    const itemIndex = this.dlq.findIndex(j => j.id === id);
    if (itemIndex === -1) return;

    const [job] = this.dlq.splice(itemIndex, 1);
    job.status = 'queued';
    job.attempts = 0;
    job.logs.push({
      timestamp: new Date().toLocaleTimeString(),
      text: `Manually replayed from Dead Letter Queue by operator.`
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

// Global instance export for app
export const queueEngine = new NotificationQueueEngine();
