
// Generate a descriptive badge name based on mission title
export const generateBadgeName = (missionTitle: string): string => {
  if (!missionTitle) return "Achievement Badge";
  
  if (missionTitle.toLowerCase().includes("badge")) {
    return missionTitle;
  }
  
  return `${missionTitle} Badge`;
};

// Generate a badge description based on mission title
export const generateBadgeDescription = (missionTitle?: string): string => {
  if (!missionTitle) return "Conquista especial desbloqueada por completar uma missão";
  
  // Generate a slightly random description for variety
  const templates = [
    `Parabéns! Você completou a missão "${missionTitle}" com sucesso.`,
    `Conquista desbloqueada por completar a missão "${missionTitle}".`,
    `Badge especial concedido por sua excelência na missão "${missionTitle}".`,
    `Sua dedicação na missão "${missionTitle}" foi reconhecida com esta badge.`,
    `Esta badge celebra sua conquista na missão "${missionTitle}".`
  ];
  
  // Pick a random template
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
};
