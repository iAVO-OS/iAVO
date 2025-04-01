// pages/index.js
import { useEffect, useState } from 'react';
import { getHealth } from '../services/api';

export default function Home() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    async function fetchHealth() {
      try {
        const data = await getHealth();
        setHealth(data);
      } catch (error) {
        console.error('Error fetching health:', error);
      }
    }
    fetchHealth();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to iAVO UI</h1>
      <h2>FastAPI Health Check</h2>
      {health ? (
        <pre>{JSON.stringify(health, null, 2)}</pre>
      ) : (
        <p>Loading health status...</p>
      )}
    </div>
  );
}
