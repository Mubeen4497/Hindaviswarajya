import { useEffect } from "react";
import { motion } from "motion/react";
import { Heart, Sparkles } from "lucide-react";
import logoImage from 'figma:asset/96f14b6013fa7443febe54311b23cd3f8d928624.png';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#FF6F00] to-[#F57C00]"
    >
      <div className="text-center px-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="mb-8 flex justify-center"
        >
          <img 
            src={logoImage} 
            alt="Hindavi Swarajya Logo" 
            className="w-full max-w-md h-auto"
          />
        </motion.div>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl text-white/90"
        >
          "महाराजांचे स्वप्न, आमचे कर्तव्य"
        </motion.p>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-8"
        >
          <div className="w-16 h-1 bg-white/50 rounded-full mx-auto">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.8, duration: 1 }}
              className="h-full bg-white rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}