
import React from "react";
import { motion } from "framer-motion";
import { FileText, Image, Camera, Upload, MapPin, Users, Shield, Ticket, FileCheck, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, useRecentActivities } from "@/hooks/admin/useRecentActivities";

// Animation variants
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100 }
  }
};

const RecentActivities = () => {
  const { activities, loading } = useRecentActivities();

  // Get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch(type) {
      case "user":
        return <Users size={16} className="text-neon-cyan" />;
      case "permission":
        return <Shield size={16} className="text-neon-pink" />;
      case "raffle":
        return <Ticket size={16} className="text-neon-lime" />;
      case "moderation":
        return <FileCheck size={16} className="text-purple-400" />;
      case "system":
        return <AlertTriangle size={16} className="text-amber-400" />;
      default:
        return <Shield size={16} />;
    }
  };

  if (loading) {
    return (
      <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/40 backdrop-blur-sm h-full">
        <CardContent className="pt-6 relative">
          <div className="absolute top-0 left-7 bottom-0 w-px bg-galaxy-purple/30 z-0"></div>
          
          <div className="space-y-8 relative z-10">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="mt-0.5 h-6 w-6 rounded-full border border-galaxy-purple bg-galaxy-deepPurple"></div>
                <div className="flex-1">
                  <div className="h-4 w-48 bg-galaxy-purple/30 rounded animate-pulse mb-2" />
                  <div className="h-3 w-32 bg-galaxy-purple/20 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.section variants={itemVariants}>
      <h2 className="text-xl font-heading mb-4 neon-text-cyan">Atividades Recentes</h2>
      <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/40 backdrop-blur-sm">
        <CardContent className="pt-6 relative">
          <div className="absolute top-0 left-7 bottom-0 w-px bg-galaxy-purple/30 z-0"></div>
          
          <div className="space-y-8 relative z-10">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-galaxy-purple bg-galaxy-deepPurple">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <p className="text-sm font-medium">{activity.event}</p>
                    <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">por {activity.user}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
};

export default RecentActivities;
