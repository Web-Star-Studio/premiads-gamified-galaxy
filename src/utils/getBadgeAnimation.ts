
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
  if (!missionType) return "/images/badges/default-badge.svg";
  
  const type = missionType.toLowerCase();
  
  // Return SVG paths first as they're more likely to work
  if (type.includes('photo')) return "/images/badges/photo-badge.svg";
  if (type.includes('form')) return "/images/badges/form-badge.svg";
  if (type.includes('video')) return "/images/badges/video-badge.svg";
  if (type.includes('survey')) return "/images/badges/survey-badge.svg";
  if (type.includes('review')) return "/images/badges/review-badge.svg";
  if (type.includes('coupon')) return "/images/badges/coupon-badge.svg";
  if (type.includes('social')) return "/images/badges/social-badge.svg";
  if (type.includes('checkin') || type.includes('check-in')) return "/images/badges/checkin-badge.svg";
  
  // Fallback to Lottie animations if SVGs aren't available
  if (type.includes('photo')) return "https://assets10.lottiefiles.com/packages/lf20_qm8eqtyw.json";
  if (type.includes('form')) return "https://assets1.lottiefiles.com/packages/lf20_fnjha2ed.json";
  if (type.includes('video')) return "https://assets3.lottiefiles.com/packages/lf20_2cwdcjsd.json";
  if (type.includes('survey')) return "https://assets7.lottiefiles.com/packages/lf20_kw2yp2rh.json";
  if (type.includes('review')) return "https://assets3.lottiefiles.com/packages/lf20_bnfvh5kf.json";
  if (type.includes('coupon')) return "https://assets10.lottiefiles.com/packages/lf20_uomoou11.json";
  if (type.includes('social')) return "https://assets9.lottiefiles.com/packages/lf20_wloxwm9w.json";
  if (type.includes('checkin') || type.includes('check-in')) return "https://assets3.lottiefiles.com/packages/lf20_9yi1lpr7.json";
  
  // Default badge
  return "/images/badges/default-badge.svg";
};

// Check if URL is a Lottie animation file
export const isLottieAnimation = (url: string | null): boolean => {
  if (!url) return false;
  return url.endsWith('.json') || url.includes('lottiefiles.com');
};

// Check if URL is an image file (SVG, PNG, JPG)
export const isImageFile = (url: string | null): boolean => {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  return lowerUrl.endsWith('.svg') || 
         lowerUrl.endsWith('.png') || 
         lowerUrl.endsWith('.jpg') || 
         lowerUrl.endsWith('.jpeg') ||
         lowerUrl.startsWith('/images/');
};

// Get a fallback URL if the badge image cannot be loaded
export const getFallbackBadgeUrl = (missionType?: string): string => {
  // Default badge SVG
  return missionType ? 
    `/images/badges/${missionType.toLowerCase().replace(/[^a-z0-9]/g, '-')}-badge.svg` : 
    "/images/badges/default-badge.svg";
};
