import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckCircle, Lock, Sparkles, Trophy, Gift, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { RankInfo, RANK_SYSTEM, UserRank } from './AppContext';

interface RankDetailModalProps {
  rank: RankInfo | null;
  currentRank: UserRank;
  currentPoints: number;
  onClose: () => void;
}

export default function RankDetailModal({ rank, currentRank, currentPoints, onClose }: RankDetailModalProps) {
  if (!rank) return null;

  const currentRankIndex = RANK_SYSTEM.findIndex(r => r.name === currentRank);
  const targetRankIndex = RANK_SYSTEM.findIndex(r => r.name === rank.name);
  const isCurrentRank = currentRank === rank.name;
  const isAchieved = currentRankIndex >= targetRankIndex;
  const isNext = targetRankIndex === currentRankIndex + 1;
  const pointsNeeded = Math.max(0, rank.pointsRequired - currentPoints);
  
  return (
    <Dialog open={!!rank} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="text-5xl"
              >
                {rank.icon}
              </motion.div>
              <div>
                <DialogTitle className="text-2xl" style={{ color: rank.color }}>
                  {rank.name}
                </DialogTitle>
                <DialogDescription>
                  {rank.pointsRequired} Seva Points Required
                </DialogDescription>
              </div>
            </div>
            <div className="flex gap-2">
              {isCurrentRank && (
                <Badge className="bg-green-600 text-white">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Current Rank
                </Badge>
              )}
              {isAchieved && !isCurrentRank && (
                <Badge className="bg-blue-600 text-white">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Achieved
                </Badge>
              )}
              {!isAchieved && isNext && (
                <Badge className="bg-orange-600 text-white">
                  <Zap className="w-3 h-3 mr-1" />
                  Next Rank
                </Badge>
              )}
              {!isAchieved && !isNext && (
                <Badge variant="outline" className="text-gray-600">
                  <Lock className="w-3 h-3 mr-1" />
                  Locked
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Lore */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-lg border-2 border-orange-100"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-orange-600" />
              <h3 className="font-medium text-orange-900">The Legend</h3>
            </div>
            <p className="text-gray-700 italic leading-relaxed">
              "{rank.lore}"
            </p>
          </motion.div>

          {/* Progress (if not achieved) */}
          {!isAchieved && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-50 p-6 rounded-lg border border-blue-200"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-blue-900">Your Progress</h3>
                <span className="text-sm text-blue-600">
                  {currentPoints} / {rank.pointsRequired} Points
                </span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-3 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((currentPoints / rank.pointsRequired) * 100, 100)}%` }}
                  transition={{ delay: 0.3, duration: 1, type: "spring" }}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {Math.round((currentPoints / rank.pointsRequired) * 100)}% Complete
                </span>
                {pointsNeeded > 0 && (
                  <span className="font-medium text-blue-700">
                    {pointsNeeded} points needed
                  </span>
                )}
              </div>
            </motion.div>
          )}

          {/* Perks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5" style={{ color: rank.color }} />
              <h3 className="font-medium" style={{ color: rank.color }}>Rank Perks</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {rank.perks.map((perk, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className={`flex items-start gap-2 p-3 rounded-lg ${
                    isAchieved ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  {isAchieved ? (
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Lock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${isAchieved ? 'text-green-900' : 'text-gray-600'}`}>
                    {perk}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Unlocks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Gift className="w-5 h-5" style={{ color: rank.color }} />
              <h3 className="font-medium" style={{ color: rank.color }}>Features Unlocked</h3>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {rank.unlocks.map((unlock, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className={`flex items-start gap-2 p-3 rounded-lg ${
                    isAchieved ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  {isAchieved ? (
                    <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Lock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${isAchieved ? 'text-purple-900 font-medium' : 'text-gray-600'}`}>
                    {unlock}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* How to Earn Points (if not achieved) */}
          {!isAchieved && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg border border-orange-200"
            >
              <h3 className="font-medium text-orange-900 mb-4">How to Earn Seva Points</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span><strong>Create seva posts:</strong> 5 points per person helped</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span><strong>Volunteer at events:</strong> 10-50 points per event</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span><strong>Help requests:</strong> 15 points per request fulfilled</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span><strong>Organize events:</strong> 25-100 points per event</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span><strong>Monthly challenges:</strong> Bonus points for completing tasks</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            {isNext && (
              <Button
                className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white"
                size="lg"
              >
                <Zap className="w-4 h-4 mr-2" />
                Aim for {rank.name}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
