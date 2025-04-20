
import { FileText, Image, Camera, Upload, MapPin, Star, Share2, Tag } from "lucide-react";
import { MissionType } from "@/hooks/useMissionsTypes";

interface MissionTypeIconProps {
  type: MissionType;
}

const MissionTypeIcon = ({ type }: MissionTypeIconProps) => {
  switch (type) {
    case "form":
    case "survey":
      return <FileText className="w-5 h-5 text-neon-lime" />;
    case "photo":
      return <Image className="w-5 h-5 text-neon-cyan" />;
    case "video":
      return <Camera className="w-5 h-5 text-neon-pink" />;
    case "social":
    case "social_share":
      return <Share2 className="w-5 h-5 text-yellow-400" />;
    case "checkin":
    case "visit":
      return <MapPin className="w-5 h-5 text-neon-lime" />;
    case "coupon":
      return <Tag className="w-5 h-5 text-neon-cyan" />;
    case "review":
      return <Star className="w-5 h-5 text-neon-pink" />;
    default:
      return <Star className="w-5 h-5 text-neon-lime" />;
  }
};

export default MissionTypeIcon;
