import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { Button } from "./ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring" }}
        className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4"
      >
        <Icon className="w-10 h-10 text-gray-400" />
      </motion.div>
      
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-sm">{description}</p>
      
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-[#FF6F00] hover:bg-[#E65100]"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
