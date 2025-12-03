import { motion } from 'motion/react';
import { Zap, Trophy } from 'lucide-react';
import { RANK_SYSTEM, UserRank } from './AppContext';

interface RankProgressBarProps {
  currentRank: UserRank;
  currentPoints: number;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export default function RankProgressBar({
  currentRank,
  currentPoints,
  size = 'md',
  showDetails = true,
}: RankProgressBarProps) {
  const currentRankIndex = RANK_SYSTEM.findIndex(r => r.name === currentRank);
  const currentRankInfo = RANK_SYSTEM[currentRankIndex];
  const nextRankInfo = RANK_SYSTEM[currentRankIndex + 1];

  // If max rank, show completion
  if (!nextRankInfo) {
    return (
      <div className={`${size === 'sm' ? 'p-3' : size === 'lg' ? 'p-6' : 'p-4'} bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border-2 border-yellow-200`}>
        <div className="flex items-center justify-center gap-2 text-yellow-700">
          <Trophy className="w-6 h-6" />
          <span className="font-medium">Maximum Rank Achieved!</span>
          <Trophy className="w-6 h-6" />
        </div>
      </div>
    );
  }

  const pointsNeeded = nextRankInfo.pointsRequired - currentRankInfo.pointsRequired;
  const pointsEarned = currentPoints - currentRankInfo.pointsRequired;
  const progress = Math.min((pointsEarned / pointsNeeded) * 100, 100);
  const pointsToNext = nextRankInfo.pointsRequired - currentPoints;

  const heightClass = size === 'sm' ? 'h-2' : size === 'lg' ? 'h-4' : 'h-3';
  const textSizeClass = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm';

  return (
    <div className={size === 'sm' ? 'space-y-2' : size === 'lg' ? 'space-y-4' : 'space-y-3'}>
      {/* Header */}
      {showDetails && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`${textSizeClass} text-gray-600`}>Progress to</span>
            <div className="flex items-center gap-1">
              <span className={textSizeClass} style={{ color: nextRankInfo.color }}>
                {nextRankInfo.icon}
              </span>
              <span className={`${textSizeClass} font-medium`} style={{ color: nextRankInfo.color }}>
                {nextRankInfo.name}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-orange-600">
            <Zap className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
            <span className={`${textSizeClass} font-medium`}>
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      )}

      {/* Progress Bar Container */}
      <div className="relative">
        {/* Background */}
        <div className={`w-full ${heightClass} bg-gray-200 rounded-full overflow-hidden`}>
          {/* Progress Fill */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`${heightClass} bg-gradient-to-r from-orange-500 via-orange-600 to-yellow-500 rounded-full relative overflow-hidden`}
          >
            {/* Shine Effect */}
            <motion.div
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          </motion.div>
        </div>

        {/* Current Rank Marker */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2"
        >
          <div
            className={`${
              size === 'sm' ? 'w-6 h-6 text-xs' : size === 'lg' ? 'w-10 h-10 text-lg' : 'w-8 h-8 text-sm'
            } rounded-full border-2 border-white shadow-md flex items-center justify-center`}
            style={{
              backgroundColor: currentRankInfo.color,
            }}
          >
            <span className="text-white">{currentRankInfo.icon}</span>
          </div>
        </motion.div>

        {/* Next Rank Marker */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          className="absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2"
        >
          <div
            className={`${
              size === 'sm' ? 'w-6 h-6 text-xs' : size === 'lg' ? 'w-10 h-10 text-lg' : 'w-8 h-8 text-sm'
            } rounded-full border-2 border-white shadow-md flex items-center justify-center`}
            style={{
              backgroundColor: progress >= 100 ? nextRankInfo.color : '#9CA3AF',
            }}
          >
            <span className="text-white">{nextRankInfo.icon}</span>
          </div>
        </motion.div>
      </div>

      {/* Details */}
      {showDetails && (
        <div className="flex items-center justify-between">
          <span className={`${textSizeClass} text-gray-600`}>
            {currentPoints.toLocaleString()} / {nextRankInfo.pointsRequired.toLocaleString()} points
          </span>
          {pointsToNext > 0 && (
            <span className={`${textSizeClass} font-medium text-orange-600`}>
              {pointsToNext.toLocaleString()} to go
            </span>
          )}
        </div>
      )}

      {/* Milestone Message */}
      {progress >= 75 && progress < 100 && showDetails && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-center"
        >
          <p className={`${textSizeClass} text-orange-700 font-medium`}>
            🔥 Almost there! Just {pointsToNext} more points to {nextRankInfo.name}!
          </p>
        </motion.div>
      )}
    </div>
  );
}
