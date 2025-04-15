
import { Mission } from "./types";
import { MissionType, missionTypeLabels } from "@/hooks/useMissionsTypes";

export const useMissionFilters = (missions: Mission[]) => {
  // Find missions based on business type
  const findMissionsByBusinessType = (businessType: string) => {
    return missions.filter(mission => 
      mission.business_type?.toLowerCase().includes(businessType.toLowerCase())
    );
  };

  // Find missions for specific gender
  const findMissionsByGender = (gender: string) => {
    return missions.filter(mission => 
      mission.target_audience_gender === gender || mission.target_audience_gender === 'all'
    );
  };

  // Find missions by age range
  const findMissionsByAge = (age: number) => {
    return missions.filter(mission => 
      (mission.target_audience_age_min === null || mission.target_audience_age_min <= age) &&
      (mission.target_audience_age_max === null || mission.target_audience_age_max >= age)
    );
  };

  // Find missions by region
  const findMissionsByRegion = (region: string) => {
    return missions.filter(mission => 
      mission.target_audience_region?.toLowerCase().includes(region.toLowerCase())
    );
  };

  // Get mission type label
  const getMissionTypeLabel = (type: MissionType) => missionTypeLabels[type] || type;

  return {
    findMissionsByBusinessType,
    findMissionsByGender,
    findMissionsByAge,
    findMissionsByRegion,
    getMissionTypeLabel
  };
};
