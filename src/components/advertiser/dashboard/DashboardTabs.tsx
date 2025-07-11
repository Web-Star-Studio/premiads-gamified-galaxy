
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MetricsOverview from "@/components/advertiser/MetricsOverview";
import TopUsers from "@/components/advertiser/TopUsers";
import DynamicEngagementChart from "@/components/advertiser/DynamicEngagementChart";
import AlertsPanel from "@/components/advertiser/AlertsPanel";
import CampaignsList from "@/components/advertiser/CampaignsList";
import CreditsPurchase from "@/components/advertiser/CreditsPurchase";
import SubmissionsApproval from "@/components/advertiser/SubmissionsApproval";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  credits: number;
}

const DashboardTabs = ({ activeTab, onTabChange, credits }: DashboardTabsProps) => (
    <Tabs value={activeTab} onValueChange={onTabChange} className="mt-8">
      <TabsList className="w-full md:w-auto grid grid-cols-4 md:flex md:gap-4 mb-6">
        <TabsTrigger className="data-[state=active]:neon-text-pink" value="overview">Visão Geral</TabsTrigger>
        <TabsTrigger className="data-[state=active]:neon-text-pink" value="campaigns">Missões</TabsTrigger>
        <TabsTrigger className="data-[state=active]:neon-text-pink" value="analytics">Relatórios</TabsTrigger>
        <TabsTrigger className="data-[state=active]:neon-text-pink" value="finance">Finanças</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <MetricsOverview />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <TopUsers />
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DynamicEngagementChart />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <AlertsPanel />
        </motion.div>
      </TabsContent>
      
      <TabsContent value="campaigns" className="pb-8">
        <CampaignsList />
      </TabsContent>
      
      <TabsContent value="analytics" className="pb-8">
        <DynamicEngagementChart showExtended={true} />
      </TabsContent>
      
      <TabsContent value="finance" className="space-y-6 pb-8">
        <CreditsPurchase currentCredits={credits} />
        <SubmissionsApproval />
      </TabsContent>
    </Tabs>
  );

export default DashboardTabs;
