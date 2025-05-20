
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

// Get badge animation URL based on mission type
export const getBadgeAnimationForMissionType = (missionType: string): string => {
  if (!missionType) return "https://assets7.lottiefiles.com/private_files/lf30_bfzkfm07.json";
  
  const type = missionType.toLowerCase();
  
  if (type.includes('photo')) return "https://assets10.lottiefiles.com/packages/lf20_qm8eqtyw.json";
  if (type.includes('form')) return "https://assets1.lottiefiles.com/packages/lf20_fnjha2ed.json";
  if (type.includes('video')) return "https://assets3.lottiefiles.com/packages/lf20_2cwdcjsd.json";
  if (type.includes('survey')) return "https://assets7.lottiefiles.com/packages/lf20_kw2yp2rh.json";
  if (type.includes('review')) return "https://assets3.lottiefiles.com/packages/lf20_bnfvh5kf.json";
  if (type.includes('coupon')) return "https://assets10.lottiefiles.com/packages/lf20_uomoou11.json";
  if (type.includes('social')) return "https://assets9.lottiefiles.com/packages/lf20_wloxwm9w.json";
  if (type.includes('checkin') || type.includes('check-in')) return "https://assets3.lottiefiles.com/packages/lf20_9yi1lpr7.json";
  
  // Default animation
  return "https://assets7.lottiefiles.com/private_files/lf30_bfzkfm07.json";
};
