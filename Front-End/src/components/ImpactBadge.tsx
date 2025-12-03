import { motion } from "motion/react";
import { Users, TrendingUp } from "lucide-react";

interface ImpactBadgeProps {
  count: number;
  label?: string;
  animated?: boolean;
}

export default function ImpactBadge({ count, label = "helped", animated = true }: ImpactBadgeProps) {
  const Component = animated ? motion.div : "div";
  
  const animationProps = animated ? {
    initial: { scale: 0 },
    animate: { scale: 1 },
    whileHover: { scale: 1.05 },
    transition: { type: "spring", stiffness: 300 }
  } : {};

  return (
    <Component
      {...animationProps}
      className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#FF6F00] to-[#F57C00] text-white px-3 py-1.5 rounded-full shadow-sm"
    >
      <Users className="w-4 h-4" />
      <span className="font-medium">{count.toLocaleString()}</span>
      <span className="text-xs opacity-90">{label}</span>
      <TrendingUp className="w-3 h-3 opacity-75" />
    </Component>
  );
}
