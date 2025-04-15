
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
