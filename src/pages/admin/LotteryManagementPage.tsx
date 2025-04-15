
import { useState } from "react";
import { motion } from "framer-motion";
import DashboardHeader from "@/components/admin/DashboardHeader";
import { 
  LotteryList, 
  LotteryDetails, 
  EmptyState,
  Lottery 
} from "@/components/admin/lottery";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";

// Sample data for demonstration
const sampleLotteries: Lottery[] = [
  {
    id: 1,
    name: "Mega Prêmio Semanal",
    startDate: "15/04/2025",
    endDate: "22/04/2025",
    status: "active",
    prizes: [
      { id: 1, name: "Smartphone Galaxy XYZ", rarity: "Raro", probability: 0.1 },
      { id: 2, name: "Fones de Ouvido Wireless", rarity: "Comum", probability: 5.2 },
      { id: 3, name: "Cartão Presente R$50", rarity: "Comum", probability: 12.3 },
      { id: 4, name: "1000 Pontos Premium", rarity: "Incomum", probability: 8.7 }
    ]
  },
  {
    id: 2,
    name: "Sorteio de Aniversário",
    startDate: "01/05/2025",
    endDate: "10/05/2025",
    status: "pending",
    prizes: [
      { id: 1, name: "Smart TV 55\"", rarity: "Ultra Raro", probability: 0.05 },
      { id: 2, name: "Relógio Fitness", rarity: "Raro", probability: 0.8 },
      { id: 3, name: "5000 Pontos Premium", rarity: "Incomum", probability: 5.0 }
    ]
  },
  {
    id: 3,
    name: "Prêmio Especial de Natal",
    startDate: "15/12/2024",
    endDate: "25/12/2024",
    status: "completed",
    prizes: [
      { id: 1, name: "Console de Videogame", rarity: "Ultra Raro", probability: 0.01 },
      { id: 2, name: "Kit Gamer", rarity: "Raro", probability: 0.3 },
      { id: 3, name: "10.000 Pontos Premium", rarity: "Incomum", probability: 2.5 },
      { id: 4, name: "Cartão Presente R$200", rarity: "Raro", probability: 0.5 }
    ]
  }
];

const LotteryManagementPage = () => {
  const [selectedLotteryId, setSelectedLotteryId] = useState<number | null>(null);
  
  const selectedLottery = sampleLotteries.find(
    lottery => lottery.id === selectedLotteryId
  );
  
  const handleSelectLottery = (lottery: Lottery) => {
    setSelectedLotteryId(lottery.id);
  };
  
  const handleStatusChange = (id: number, newStatus: string) => {
    // In a real application, this would update the database
    console.log(`Lottery ${id} status changed to ${newStatus}`);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdminSidebar />
        <SidebarInset className="overflow-y-auto pb-20 fancy-scrollbar">
          <div className="container px-4 py-6 sm:py-8 mx-auto max-w-7xl">
            <DashboardHeader title="Gestão de Sorteios" subtitle="Administração de sorteios e prêmios" />
            
            <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-galaxy-deepPurple/10 rounded-lg p-3 sm:p-4 border border-galaxy-purple/30">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 text-contrast-high">
                  Sorteios Disponíveis
                </h3>
                <LotteryList
                  lotteries={sampleLotteries}
                  selectedLotteryId={selectedLotteryId}
                  onSelectLottery={handleSelectLottery}
                />
              </div>
              
              <div className="lg:col-span-2 bg-galaxy-deepPurple/10 rounded-lg p-3 sm:p-4 border border-galaxy-purple/30">
                {selectedLottery ? (
                  <LotteryDetails
                    selectedLottery={selectedLottery}
                    onStatusChange={handleStatusChange}
                  />
                ) : (
                  <EmptyState />
                )}
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default LotteryManagementPage;
