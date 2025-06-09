
import React from 'react';
import { motion } from 'framer-motion';
import { ProgressiveLoader, SectionLoader } from '@/components/progressive/ProgressiveLoader';
import { MissionsSuspense } from '@/components/progressive/SuspenseBoundaries';
import { LazyMissionsCarousel, LazyActiveMissions } from '@/components/lazy/LazyComponents';
import { useMissions } from '@/hooks/useMissions';

const OptimizedMissionsSection = () => {
  const { missions, loading, selectedMission, setSelectedMission } = useMissions({});

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse bg-muted h-48 rounded-lg" />
        <div className="animate-pulse bg-muted h-64 rounded-lg" />
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-2"
      >
        <SectionLoader>
          <MissionsSuspense>
            <LazyMissionsCarousel 
              missions={missions} 
              onSelectMission={setSelectedMission}
            />
          </MissionsSuspense>
        </SectionLoader>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="lg:col-span-2"
      >
        <ProgressiveLoader delay={300} useIntersection>
          <MissionsSuspense>
            <LazyActiveMissions />
          </MissionsSuspense>
        </ProgressiveLoader>
      </motion.div>
    </>
  );
};

export default OptimizedMissionsSection;
