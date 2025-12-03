import { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { Card } from "./ui/card";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  color: string;
  delay?: number;
}

export default function StatsCard({ icon: Icon, label, value, color, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Card className="p-4 text-center hover:shadow-md transition-shadow">
        <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} />
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
        <p className="text-xs text-gray-600">{label}</p>
      </Card>
    </motion.div>
  );
}
