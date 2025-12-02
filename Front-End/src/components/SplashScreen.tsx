import { useState, useEffect } from "react";
import { motion } from "motion/react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowText(true), 1000);
    const timer2 = setTimeout(onComplete, 3500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#FF6F00] to-[#E65100] flex items-center justify-center z-50 pointer-events-none">
      <div className="text-center px-6 pointer-events-auto">
        {/* (logo removed) */}

        {/* Text Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 20 }}
          transition={{ duration: 2 }}
          className="text-white text-center"
        >
          <h1 className="text-3xl mb-4 tracking-wide">
            हिंदवी स्वराज्य
          </h1>
          <h2 className="text-xl mb-2">
            HindaviSwarajya
          </h2>
          <p className="text-lg opacity-90 max-w-md mx-auto leading-relaxed">
            "महाराजांचे स्वप्न, आमचे कर्तव्य"
          </p>
          <p className="text-base opacity-75 mt-2">
            Maharaj's Dream, Our Duty
          </p>
        </motion.div>

        {/* Loading indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showText ? 1 : 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <div className="flex justify-center">
            <div className="w-8 h-1 bg-white rounded-full animate-pulse"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}