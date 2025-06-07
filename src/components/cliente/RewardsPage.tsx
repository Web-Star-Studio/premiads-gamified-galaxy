
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Trophy, Star, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRewards } from '@/hooks/useRewards';
import { useAuth } from '@/hooks/useAuth';
import LootBoxList from '@/components/lootbox/LootBoxList';

const RewardsPage = () => {
  const { user } = useAuth();
  const { badges, loading } = useRewards(user?.id || null);
  const [lootBoxes] = useState([]);

  const refreshData = async () => {
    // Refresh logic here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-galaxy-darkPurple via-galaxy-purple to-galaxy-darkPurple flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neon-cyan mx-auto mb-4"></div>
          <p className="text-white">Carregando recompensas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-galaxy-darkPurple via-galaxy-purple to-galaxy-darkPurple">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Suas Recompensas
          </h1>
          <p className="text-galaxy-text text-lg">
            Badges conquistadas e loot boxes coletadas
          </p>
        </motion.div>

        <div className="grid gap-8">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-galaxy-darkPurple border-galaxy-purple">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Trophy className="h-6 w-6 text-neon-pink" />
                  Badges Conquistadas ({badges.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {badges.length === 0 ? (
                  <div className="text-center py-8">
                    <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-400 mb-2">Nenhuma badge conquistada ainda</p>
                    <p className="text-sm text-gray-500">Complete missões para ganhar badges!</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {badges.map((badge) => (
                      <Card key={badge.id} className="bg-galaxy-purple border-galaxy-pink">
                        <CardContent className="p-4 text-center">
                          <div className="mb-3">
                            {badge.badge_image_url ? (
                              <img
                                src={badge.badge_image_url}
                                alt={badge.badge_name}
                                className="h-16 w-16 mx-auto rounded-full"
                                onError={(e) => {
                                  e.currentTarget.src = '/images/badges/default-badge.svg';
                                }}
                              />
                            ) : (
                              <div className="h-16 w-16 mx-auto bg-gradient-to-br from-neon-cyan to-neon-pink rounded-full flex items-center justify-center">
                                <Trophy className="h-8 w-8 text-white" />
                              </div>
                            )}
                          </div>
                          <h3 className="font-semibold text-white mb-1">{badge.badge_name}</h3>
                          <p className="text-sm text-gray-300 mb-2">{badge.badge_description}</p>
                          <Badge variant="secondary" className="text-xs">
                            {new Date(badge.earned_at).toLocaleDateString()}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-galaxy-darkPurple border-galaxy-purple">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Gift className="h-6 w-6 text-neon-cyan" />
                  Loot Boxes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LootBoxList 
                  lootBoxes={lootBoxes} 
                  refreshData={refreshData}
                />
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;
