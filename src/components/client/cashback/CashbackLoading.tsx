
import React from 'react';
import ClientDashboardHeader from '@/components/client/ClientDashboardHeader';

interface CashbackLoadingProps {
  userName: string | null;
}

const CashbackLoading: React.FC<CashbackLoadingProps> = ({ userName }) => (
    <div className="container mx-auto px-4 py-8">
      <ClientDashboardHeader 
        title="Marketplace de Cashback" 
        userName={userName} 
        showBackButton
        backTo="/cliente"
      />
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-700 rounded-full mb-4"></div>
          <div className="h-6 w-32 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 w-48 bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );

export default CashbackLoading;
