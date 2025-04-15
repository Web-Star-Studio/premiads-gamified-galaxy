
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, subtitle }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
    >
      <div className="flex items-center">
        <div className="mr-4 p-2 rounded-full bg-accent/20 text-accent">
          <ShieldAlert size={28} className="text-neon-pink" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold neon-text-pink">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      
      <div className="mt-4 md:mt-0 bg-galaxy-deepPurple px-4 py-2 rounded-md border border-galaxy-purple/30 flex items-center">
        <div className="h-2 w-2 rounded-full bg-neon-lime mr-2 animate-pulse"></div>
        <span className="text-sm">Sessão Admin Ativa</span>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
