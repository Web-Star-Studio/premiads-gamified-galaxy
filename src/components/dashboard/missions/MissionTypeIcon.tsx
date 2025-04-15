
import { FileText, Image, Camera, Upload, MapPin, Star } from "lucide-react";
import { MissionType } from "@/hooks/useMissionsTypes";

interface MissionTypeIconProps {
  type: MissionType;
}

const MissionTypeIcon = ({ type }: MissionTypeIconProps) => {
  switch (type) {
    case "survey":
      return <FileText className="w-5 h-5 text-neon-lime" />;
    case "photo":
      return <Image className="w-5 h-5 text-neon-cyan" />;
    case "video":
      return <Camera className="w-5 h-5 text-neon-pink" />;
    case "social_share":
      return <Upload className="w-5 h-5 text-yellow-400" />;
    case "visit":
      return <MapPin className="w-5 h-5 text-neon-lime" />;
    default:
      return <Star className="w-5 h-5 text-neon-lime" />;
  }
};

export default MissionTypeIcon;
