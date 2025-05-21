export const getBadgeAnimationForMissionType = (missionType: string): string => {
  // First try with SVG paths (prefer these over Lottie)
  if (missionType.includes('photo')) return '/images/badges/photo-badge.svg';
  if (missionType.includes('form')) return '/images/badges/form-badge.svg';
  if (missionType.includes('video')) return '/images/badges/video-badge.svg';
  if (missionType.includes('survey')) return '/images/badges/survey-badge.svg';
  if (missionType.includes('review')) return '/images/badges/review-badge.svg';
  if (missionType.includes('coupon')) return '/images/badges/coupon-badge.svg';
  if (missionType.includes('social')) return '/images/badges/social-badge.svg';
  if (missionType.includes('checkin') || missionType.includes('check-in')) 
    return '/images/badges/checkin-badge.svg';
  
  // Fallback to Lottie animations
  if (missionType.includes('photo')) return 'https://assets10.lottiefiles.com/packages/lf20_qm8eqtyw.json';
  if (missionType.includes('form')) return 'https://assets1.lottiefiles.com/packages/lf20_fnjha2ed.json';
  if (missionType.includes('video')) return 'https://assets3.lottiefiles.com/packages/lf20_2cwdcjsd.json';
  if (missionType.includes('survey')) return 'https://assets7.lottiefiles.com/packages/lf20_kw2yp2rh.json';
  if (missionType.includes('review')) return 'https://assets3.lottiefiles.com/packages/lf20_bnfvh5kf.json';
  if (missionType.includes('coupon')) return 'https://assets10.lottiefiles.com/packages/lf20_uomoou11.json';
  if (missionType.includes('social')) return 'https://assets9.lottiefiles.com/packages/lf20_wloxwm9w.json';
  if (missionType.includes('checkin') || missionType.includes('check-in')) 
    return 'https://assets3.lottiefiles.com/packages/lf20_9yi1lpr7.json';
  
  // Default badge if nothing matches
  return '/images/badges/default-badge.svg';
};

export const generateBadgeName = (missionTitle: string): string => {
  return `${missionTitle} Badge`;
};

export const generateBadgeDescription = (missionTitle: string): string => {
  const templates = [
    `Parabéns! Você completou a missão "${missionTitle}" com sucesso.`,
    `Conquista desbloqueada por completar a missão "${missionTitle}".`,
    `Badge especial concedido por sua excelência na missão "${missionTitle}".`,
    `Sua dedicação na missão "${missionTitle}" foi reconhecida com esta badge.`,
    `Esta badge celebra sua conquista na missão "${missionTitle}".`
  ];
  
  // Pick a random template
  return templates[Math.floor(Math.random() * templates.length)];
};

export const isLottieAnimation = (url?: string): boolean => {
  if (!url) return false;
  return url.includes('.json') || url.includes('lottiefiles.com');
};

export const isImageFile = (url?: string): boolean => {
  if (!url) return false;
  return url.endsWith('.svg') || url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.webp');
};

export const getFallbackBadgeUrl = (missionType?: string): string => {
  // Fallback to static image based on mission type
  if (missionType) {
    if (missionType.includes('photo')) return '/images/badges/photo-badge.svg';
    if (missionType.includes('form')) return '/images/badges/form-badge.svg';
    if (missionType.includes('video')) return '/images/badges/video-badge.svg';
    if (missionType.includes('survey')) return '/images/badges/survey-badge.svg';
    if (missionType.includes('review')) return '/images/badges/review-badge.svg';
    if (missionType.includes('coupon')) return '/images/badges/coupon-badge.svg';
    if (missionType.includes('social')) return '/images/badges/social-badge.svg';
    if (missionType.includes('checkin') || missionType.includes('check-in')) 
      return '/images/badges/checkin-badge.svg';
  }
  
  // Default fallback
  return '/images/badges/default-badge.svg';
};
