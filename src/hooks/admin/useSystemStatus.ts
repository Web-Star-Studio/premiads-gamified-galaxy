
import { useState, useEffect } from 'react';

interface SystemStatusItem {
  name: string;
  status: 'Operacional' | 'Alerta' | 'Crítico';
  performance: number;
  icon: any;
}

export const useSystemStatus = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatusItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would be an API call in a real application
    const fetchSystemStatus = async () => {
      setLoading(true);
      
      // Mock data for demonstration purposes
      const mockData = [
        { name: "API Status", status: "Operacional", performance: 98, icon: "Server" },
        { name: "Database Status", status: "Operacional", performance: 99, icon: "Database" },
        { name: "File Server Status", status: "Operacional", performance: 97, icon: "HardDrive" },
        { name: "Backup Service Status", status: "Alerta", performance: 85, icon: "ArrowDown" }
      ];
      
      setTimeout(() => {
        setSystemStatus(mockData as SystemStatusItem[]);
        setLoading(false);
      }, 800);
    };

    fetchSystemStatus();
  }, []);

  return { systemStatus, loading };
};
