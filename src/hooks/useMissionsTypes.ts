
export type MissionType = "survey" | "photo" | "video" | "social_share" | "visit";

export const missionTypeLabels: Record<MissionType, string> = {
  survey: "Pesquisa",
  photo: "Foto",
  video: "Vídeo",
  social_share: "Redes Sociais",
  visit: "Check-in"
};

export const getMissionTypeDescription = (type: MissionType): string => {
  switch (type) {
    case "survey":
      return "Responda a uma pesquisa simples sobre suas preferências ou experiências";
    case "photo":
      return "Tire e envie uma foto relacionada ao produto ou experiência";
    case "video":
      return "Grave e envie um vídeo curto mostrando o produto ou experiência";
    case "social_share":
      return "Compartilhe em suas redes sociais usando uma hashtag específica";
    case "visit":
      return "Visite uma localização física e faça check-in no local";
    default:
      return "Complete esta missão seguindo as instruções detalhadas";
  }
};

export const getMissionIcon = (type: MissionType): string => {
  switch (type) {
    case "survey":
      return "FileText";
    case "photo":
      return "Image";
    case "video":
      return "Camera";
    case "social_share":
      return "Upload";
    case "visit":
      return "MapPin";
    default:
      return "Target";
  }
};

// Filter missions by type
export const filterMissionsByType = (missions: any[], type: MissionType | "all") => {
  if (type === "all") return missions;
  return missions.filter(mission => mission.type === type);
};

// Get mission difficulty based on points
export const getMissionDifficulty = (points: number): string => {
  if (points <= 50) return "Fácil";
  if (points <= 150) return "Médio";
  return "Difícil";
};

// Get estimated completion time based on mission type
export const getEstimatedTime = (type: MissionType): string => {
  switch (type) {
    case "survey":
      return "10 min";
    case "photo":
      return "15 min";
    case "video":
      return "30 min";
    case "social_share":
      return "5 min";
    case "visit":
      return "1 hora";
    default:
      return "20 min";
  }
};
