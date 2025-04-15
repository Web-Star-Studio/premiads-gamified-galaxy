
import { useState, useEffect } from 'react';

interface SystemMetrics {
  totalUsers: number;
  administrators: number;
  activeMissions: number;
  activeRaffles: number;
  pendingModerations: number;
  systemIssues: number;
}

export const useSystemMetrics = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalUsers: 0,
    administrators: 0,
    activeMissions: 0,
    activeRaffles: 0,
    pendingModerations: 0,
    systemIssues: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would be an API call in a real application
    const fetchMetrics = async () => {
      setLoading(true);
      
      // Mock data for demonstration purposes
      const mockData = {
        totalUsers: 3478,
        administrators: 12,
        activeMissions: 87,
        activeRaffles: 5,
        pendingModerations: 34,
        systemIssues: 3
      };
      
      setTimeout(() => {
        setMetrics(mockData);
        setLoading(false);
      }, 800);
    };

    fetchMetrics();
  }, []);

  return { metrics, loading };
};
