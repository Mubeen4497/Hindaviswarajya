import { Utensils, BookOpen, Heart, Home, Sparkles } from "lucide-react";
import { SevaCategory } from "./AppContext";

interface CategoryIconProps {
  category: SevaCategory;
  className?: string;
}

const categoryIcons = {
  Food: Utensils,
  Education: BookOpen,
  Health: Heart,
  Shelter: Home,
  Other: Sparkles,
};

export default function CategoryIcon({ category, className = "w-4 h-4" }: CategoryIconProps) {
  const Icon = categoryIcons[category];
  return <Icon className={className} />;
}
