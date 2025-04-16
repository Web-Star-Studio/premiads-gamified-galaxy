
export const formatTimeRemaining = (dateStr: string) => {
  const endDate = new Date(dateStr);
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  
  if (diff <= 0) return "Encerrado";
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days > 0) {
    return `${days} dias`;
  }
  
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
};

export const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "common": return "text-gray-300";
    case "uncommon": return "text-neon-lime";
    case "rare": return "text-neon-cyan";
    case "legendary": return "text-neon-pink";
    default: return "text-gray-300";
  }
};
