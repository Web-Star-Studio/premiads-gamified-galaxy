
import React from "react";
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-galaxy-deepPurple border-galaxy-purple">
        <DialogHeader>
          <DialogTitle>Submeter Missão</DialogTitle>
          <DialogDescription>
            {selectedMission?.title} - {selectedMission?.brand || "PremiAds"}
          </DialogDescription>
        </DialogHeader>
        
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
      </DialogContent>
    </Dialog>
  );
};

export default MissionDialog;
