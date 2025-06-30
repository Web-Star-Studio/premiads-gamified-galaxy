import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Data {
  filtered: any[];
  count: number;
  total: number;
  average: number;
}

export const useRLSOptimized = () => {
  const [data, setData] = useState<Data>({
    filtered: [],
    count: 0,
    total: 0,
    average: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchOptimizedData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Await the promise first, then use array methods
      const rawData = await supabase
        .from('submissions')
        .select('*')
        .eq('status', 'pending');
        
      if (rawData.data) {
        const filteredData = rawData.data.filter(item => item.status === 'pending');
        const count = filteredData.length;
        const totalPoints = filteredData.reduce((sum, item) => sum + (item.points || 0), 0);
        const averageLength = filteredData.length > 0 ? totalPoints / filteredData.length : 0;
        
        setData({
          filtered: filteredData,
          count,
          total: totalPoints,
          average: averageLength
        });
      }
    } catch (error) {
      console.error('RLS fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOptimizedData();
  }, [fetchOptimizedData]);

  return {
    data,
    loading,
    refetch: fetchOptimizedData,
  };
};
