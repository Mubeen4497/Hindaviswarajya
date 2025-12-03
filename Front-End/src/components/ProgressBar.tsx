import { motion } from "motion/react";

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  color?: string;
}

export default function ProgressBar({ 
  current, 
  max, 
  label, 
  showPercentage = true,
  color = "#FF6F00" 
}: ProgressBarProps) {
  const percentage = Math.min((current / max) * 100, 100);
  
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">{label}</span>
          {showPercentage && (
            <span className="text-sm font-medium" style={{ color }}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      
      {!showPercentage && (
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">{current.toLocaleString()}</span>
          <span className="text-xs text-gray-500">{max.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}
