import React, { useState, useEffect } from 'react';
import { queueEngine } from './engine/NotificationQueueEngine';
import { Header } from './components/Header';
import { DispatchConsole } from './components/DispatchConsole';
import { QueueArchitectureView } from './components/QueueArchitectureView';
import { LiveDeliveryTracker } from './components/LiveDeliveryTracker';
import { DeviceSimulators } from './components/DeviceSimulators';
import { MetricsDashboard } from './components/MetricsDashboard';

export function App() {
  const [engineState, setEngineState] = useState(queueEngine.getState());

  useEffect(() => {
    // Subscribe to engine state updates
    const unsubscribe = queueEngine.subscribe((newState) => {
      setEngineState(newState);
    });
    return unsubscribe;
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header state={engineState} />

      <main className="main-layout">
        {/* Top Level System Telemetry */}
        <MetricsDashboard state={engineState} />

        {/* Architecture & Flow Visualization */}
        <QueueArchitectureView state={engineState} />

        {/* Main Workspace Split Grid */}
        <div className="dashboard-grid">
          {/* Left Column: Event Dispatch Console */}
          <div>
            <DispatchConsole />
          </div>

          {/* Right Column: Live Telemetry Audit Log & Device Mockups */}
          <div>
            <DeviceSimulators state={engineState} />
            <LiveDeliveryTracker state={engineState} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
