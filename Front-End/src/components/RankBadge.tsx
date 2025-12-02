import { Crown, Shield, Star, Zap, Trophy } from "lucide-react";

export type Rank = "mavla" | "shiledar" | "senapati" | "sardar" | "chhatrapati_senapati";

interface RankBadgeProps {
  rank: Rank;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const rankData = {
  mavla: {
    name: "Mavla",
    icon: Shield,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-300",
    level: 1,
  },
  shiledar: {
    name: "Shiledar",
    icon: Zap,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    borderColor: "border-orange-300",
    level: 2,
  },
  senapati: {
    name: "Senapati", 
    icon: Star,
    color: "text-[#FF6F00]",
    bgColor: "bg-[#FFF3E0]",
    borderColor: "border-[#FF6F00]",
    level: 3,
  },
  sardar: {
    name: "Sardar",
    icon: Trophy,
    color: "text-[#DAA520]", 
    bgColor: "bg-yellow-50",
    borderColor: "border-[#DAA520]",
    level: 4,
  },
  chhatrapati_senapati: {
    name: "Chhatrapati's Senapati",
    icon: Crown,
    color: "text-[#B71C1C]",
    bgColor: "bg-red-50",
    borderColor: "border-[#B71C1C]",
    level: 5,
  },
};

export default function RankBadge({ rank, size = "md", showLabel = true }: RankBadgeProps) {
  const data = rankData[rank];
  const Icon = data.icon;
  
  const sizeClasses = {
    sm: {
      container: "w-8 h-8",
      icon: "w-4 h-4",
      text: "text-xs",
    },
    md: {
      container: "w-12 h-12",
      icon: "w-6 h-6", 
      text: "text-sm",
    },
    lg: {
      container: "w-16 h-16",
      icon: "w-8 h-8",
      text: "text-base",
    },
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`
          ${sizeClasses[size].container} 
          ${data.bgColor} 
          ${data.borderColor} 
          border-2 rounded-full 
          flex items-center justify-center
          relative overflow-hidden
        `}
      >
        {/* Shield pattern background */}
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path
              d="M12 2L2 7l10 15 10-15-10-5z"
              fill="currentColor"
              className={data.color}
            />
          </svg>
        </div>
        
        <Icon className={`${sizeClasses[size].icon} ${data.color} relative z-10`} />
      </div>
      
      {showLabel && (
        <span className={`${sizeClasses[size].text} font-medium ${data.color}`}>
          {data.name}
        </span>
      )}
    </div>
  );
}