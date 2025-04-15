
import { useState } from "react";
import { Mission, UseMissionsOptions } from "./missions/types";
import { useMissionsFetch } from "./missions/useMissionsFetch";
import { useMissionSubmit } from "./missions/useMissionSubmit";
import { useMissionFilters } from "./missions/useMissionFilters";
import { MissionType } from "./useMissionsTypes";

export type { Mission, MissionStatus } from "./missions/types";

export const useMissions = (options: UseMissionsOptions = {}) => {
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [filter, setFilter] = useState(options.initialFilter || "available");
  
  const { loading, missions, setMissions, error } = useMissionsFetch();
  const { submitMission, submissionLoading } = useMissionSubmit(setMissions);
  const { 
    findMissionsByBusinessType,
    findMissionsByGender,
    findMissionsByAge,
    findMissionsByRegion,
    getMissionTypeLabel
  } = useMissionFilters(missions);
  
  // Filter missions based on status
  const filteredMissions = missions.filter(mission => {
    if (filter === "available") return mission.status === "available";
    if (filter === "in_progress") return mission.status === "in_progress";
    if (filter === "pending") return mission.status === "pending_approval";
    if (filter === "completed") return mission.status === "completed";
    return true;
  });

  return {
    loading: loading || submissionLoading,
    error,
    missions: filteredMissions,
    allMissions: missions,
    selectedMission,
    setSelectedMission,
    setFilter,
    currentFilter: filter,
    submitMission,
    findMissionsByBusinessType,
    findMissionsByGender,
    findMissionsByAge,
    findMissionsByRegion,
    getMissionTypeLabel
  };
};
