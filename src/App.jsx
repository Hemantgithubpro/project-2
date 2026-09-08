import { useState, useEffect } from 'react';
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
    const unsub = queueEngine.subscribe((updated) => {
      setEngineState(updated);
    });
    return unsub;
  }, []);

  const layoutStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  };

  return (
    <div style={layoutStyle}>
      <Header state={engineState} />

      <main className="main-layout">
        <MetricsDashboard state={engineState} />
        <QueueArchitectureView state={engineState} />

        <div className="dashboard-grid">
          <div>
            <DispatchConsole />
          </div>
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
