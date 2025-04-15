
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import MissionSubmissionForm from "./MissionSubmissionForm";
import { Mission } from "@/hooks/useMissions";

interface MissionDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedMission: Mission | null;
  loading: boolean;
  onSubmitMission: (submissionData: any) => void;
}

const MissionDialog = ({ isOpen, setIsOpen, selectedMission, loading, onSubmitMission }: MissionDialogProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="bg-galaxy-deepPurple border-galaxy-purple sm:max-w-[550px] max-h-[90vh] overflow-y-auto fancy-scrollbar">
            <DialogHeader>
              <DialogTitle className="text-xl">Submeter Missão</DialogTitle>
              <DialogDescription className="text-gray-300">
                {selectedMission?.title} - {selectedMission?.brand || "PremiAds"}
              </DialogDescription>
            </DialogHeader>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <MissionSubmissionForm 
                mission={selectedMission} 
                loading={loading} 
                onSubmit={(data) => {
                  if (data === null) {
                    setIsOpen(false);
                  } else {
                    onSubmitMission(data);
                  }
                }} 
              />
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default MissionDialog;
