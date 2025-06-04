
import React from 'react';
import { 
  Camera, 
  FileText, 
  Video, 
  MessageSquare, 
  Star, 
  Tag, 
  Share2, 
  MapPin,
  Award
} from 'lucide-react';

interface MissionTypeIconProps {
  type: string;
  className?: string;
}

const MissionTypeIcon: React.FC<MissionTypeIconProps> = ({ type, className = "w-5 h-5" }) => {
  const getIcon = () => {
    const iconType = type.toLowerCase();
    
    if (iconType.includes('photo') || iconType.includes('image')) {
      return <Camera className={className} />;
    }
    if (iconType.includes('form') || iconType.includes('survey')) {
      return <FileText className={className} />;
    }
    if (iconType.includes('video')) {
      return <Video className={className} />;
    }
    if (iconType.includes('review') || iconType.includes('comment')) {
      return <MessageSquare className={className} />;
    }
    if (iconType.includes('rating')) {
      return <Star className={className} />;
    }
    if (iconType.includes('coupon') || iconType.includes('discount')) {
      return <Tag className={className} />;
    }
    if (iconType.includes('social') || iconType.includes('share')) {
      return <Share2 className={className} />;
    }
    if (iconType.includes('checkin') || iconType.includes('check-in') || iconType.includes('location')) {
      return <MapPin className={className} />;
    }
    
    return <Award className={className} />;
  };

  return getIcon();
};

export default MissionTypeIcon;
