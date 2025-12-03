import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Crown, Zap } from 'lucide-react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { RankInfo } from './AppContext';

interface RankCelebrationProps {
  rank: RankInfo;
  show: boolean;
  onClose: () => void;
}

export default function RankCelebration({ rank, show, onClose }: RankCelebrationProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; delay: number; color: string }>>([]);

  useEffect(() => {
    if (show) {
      // Generate confetti pieces
      const pieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: ['#FF6F00', '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1'][Math.floor(Math.random() * 5)]
      }));
      setConfetti(pieces);
    }
  }, [show]);

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-lg border-4 border-yellow-400 bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 overflow-hidden">
        {/* Confetti */}
        <AnimatePresence>
          {show && confetti.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{ y: -20, opacity: 1, rotate: 0 }}
              animate={{
                y: 600,
                opacity: 0,
                rotate: 360,
              }}
              transition={{
                duration: 2 + Math.random(),
                delay: piece.delay,
                ease: 'easeIn',
              }}
              style={{
                position: 'absolute',
                left: `${piece.x}%`,
                width: '10px',
                height: '10px',
                backgroundColor: piece.color,
                zIndex: 100,
              }}
              className="rounded"
            />
          ))}
        </AnimatePresence>

        {/* Content */}
        <div className="relative z-10 py-8 text-center">
          {/* Crown/Trophy Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 10,
              delay: 0.2,
            }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
                className="text-8xl"
              >
                {rank.icon}
              </motion.div>
              {/* Sparkles around icon */}
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: [0, Math.cos(i * Math.PI / 2) * 50, 0],
                    y: [0, Math.sin(i * Math.PI / 2) * 50, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Rank Up Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Rank Up!
            </h2>
            <p className="text-gray-600 mb-4">Congratulations! You've achieved a new rank</p>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.6,
              }}
              className="inline-block"
            >
              <div
                className="text-4xl font-bold px-6 py-3 rounded-lg border-2 shadow-lg"
                style={{
                  color: rank.color,
                  borderColor: rank.color,
                  background: `linear-gradient(135deg, ${rank.color}15, ${rank.color}05)`,
                }}
              >
                {rank.name}
              </div>
            </motion.div>
          </motion.div>

          {/* Lore */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-6 px-4"
          >
            <p className="text-sm text-gray-700 italic leading-relaxed">
              "{rank.lore}"
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-3 gap-4 mb-8 px-4"
          >
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
              <p className="text-xs text-gray-600 mb-1">Points</p>
              <p className="text-lg font-bold" style={{ color: rank.color }}>
                {rank.pointsRequired}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <Crown className="w-6 h-6 text-purple-500 mx-auto mb-1" />
              <p className="text-xs text-gray-600 mb-1">Perks</p>
              <p className="text-lg font-bold" style={{ color: rank.color }}>
                {rank.perks.length}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <Zap className="w-6 h-6 text-orange-500 mx-auto mb-1" />
              <p className="text-xs text-gray-600 mb-1">Unlocks</p>
              <p className="text-lg font-bold" style={{ color: rank.color }}>
                {rank.unlocks.length}
              </p>
            </div>
          </motion.div>

          {/* Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <Button
              onClick={onClose}
              size="lg"
              className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white shadow-lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Awesome! Let's Continue
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
