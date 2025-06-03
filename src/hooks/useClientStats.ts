
export interface ClientStats {
  rifas: number;
  cashback: number;
  completedMissions: number;
  totalEarnings: number;
}

export function useClientStats() {
  return {
    data: {
      rifas: 150,
      cashback: 25.50,
      completedMissions: 8,
      totalEarnings: 175.50
    } as ClientStats,
    isLoading: false,
    error: null
  };
}
