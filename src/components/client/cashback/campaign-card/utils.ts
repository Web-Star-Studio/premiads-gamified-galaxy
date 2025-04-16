
// Format dates
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

// Default logo and image for campaigns without them
export const defaultLogo = "https://via.placeholder.com/80x80?text=Logo";
export const defaultImage = "https://via.placeholder.com/500x200?text=Cashback+Offer";

// Placeholder images for demo purposes
export const placeholderImages = [
  "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=500&h=200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500&h=200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&h=200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1572584642822-6f8de0243c93?w=500&h=200&fit=crop&q=80"
];

// Get a deterministic image based on campaign id
export const getImage = (campaignId: string, advertiserImage?: string): string => {
  const index = campaignId.charCodeAt(0) % placeholderImages.length;
  return advertiserImage || placeholderImages[index];
};
