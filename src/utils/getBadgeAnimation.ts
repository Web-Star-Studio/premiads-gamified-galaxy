// Map mission type to appropriate Lottie animation
export const getBadgeAnimationForMissionType = (missionType?: string): string => {
  // Default animation if no type is provided
  if (!missionType) return "https://assets7.lottiefiles.com/private_files/lf30_bfzkfm07.json";
  
  const type = missionType.toLowerCase();
  
  // Map different mission types to appropriate animations
  if (type.includes("photo") || type === "photo") {
    return "https://assets10.lottiefiles.com/packages/lf20_qm8eqtyw.json"; // Camera animation
  }
  
  if (type.includes("form") || type === "form") {
    return "https://assets1.lottiefiles.com/packages/lf20_fnjha2ed.json"; // Form/document animation
  }
  
  if (type.includes("video") || type === "video") {
    return "https://assets3.lottiefiles.com/packages/lf20_2cwdcjsd.json"; // Video animation
  }
  
  if (type.includes("survey") || type === "survey") {
    return "https://assets7.lottiefiles.com/packages/lf20_kw2yp2rh.json"; // Survey animation
  }
  
  if (type.includes("review") || type === "review") {
    return "https://assets3.lottiefiles.com/packages/lf20_bnfvh5kf.json"; // Stars/Review animation
  }
  
  if (type.includes("coupon") || type === "coupon") {
    return "https://assets10.lottiefiles.com/packages/lf20_uomoou11.json"; // Coupon/Ticket animation
  }
  
  if (type.includes("social") || type === "social") {
    return "https://assets9.lottiefiles.com/packages/lf20_wloxwm9w.json"; // Social media animation
  }
  
  if (type.includes("checkin") || type === "checkin" || type.includes("check-in")) {
    return "https://assets3.lottiefiles.com/packages/lf20_9yi1lpr7.json"; // Location/check-in animation
  }
  
  // Default animation for other types
  return "https://assets7.lottiefiles.com/private_files/lf30_bfzkfm07.json";
};

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
