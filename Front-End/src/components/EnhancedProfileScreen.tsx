import { useState } from 'react';
import { Edit, MapPin, Calendar, Award, Heart, MessageCircle, TrendingUp, ArrowLeft, LogOut, Trophy, Zap, Crown, Sparkles, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import RankBadge from './RankBadge';
import RankProgressBar from './RankProgressBar';
import RankDetailModal from './RankDetailModal';
import RankCelebration from './RankCelebration';
import { useApp, RANK_SYSTEM, RankInfo } from './AppContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import { useScreenSize } from './ui/use-screen-size';

interface EnhancedProfileScreenProps {
  onBack: () => void;
}

export default function EnhancedProfileScreen({ onBack }: EnhancedProfileScreenProps) {
  const { state, updateUserProfile, logout } = useApp();
  const { currentUser, posts } = state;
  const { isDesktop, isMobile } = useScreenSize();
  
  if (!currentUser) return null;

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editLocation, setEditLocation] = useState(currentUser.location);
  const [editBio, setEditBio] = useState(currentUser.bio || '');
  const [selectedRankDetail, setSelectedRankDetail] = useState<RankInfo | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const userPosts = posts.filter(post => post.userId === currentUser.id);
  const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0);
  const totalComments = userPosts.reduce((sum, post) => sum + post.comments.length, 0);

  const currentRankIndex = RANK_SYSTEM.findIndex(r => r.name === currentUser.rank);
  const currentRankInfo = RANK_SYSTEM[currentRankIndex];
  const nextRankInfo = RANK_SYSTEM[currentRankIndex + 1];

  const handleSaveProfile = () => {
    updateUserProfile({
      name: editName,
      location: editLocation,
      bio: editBio,
    });
    setIsEditOpen(false);
  };

  const stats = [
    { label: 'Seva Posts', value: currentUser.postsCount, icon: TrendingUp, color: 'text-[#FF6F00]', gradient: 'from-orange-500 to-orange-600' },
    { label: 'People Helped', value: currentUser.totalHelped, icon: Award, color: 'text-green-600', gradient: 'from-green-500 to-emerald-600' },
    { label: 'Seva Points', value: currentUser.sevaPoints, icon: Zap, color: 'text-purple-600', gradient: 'from-purple-500 to-purple-600' },
    { label: 'Total Likes', value: totalLikes, icon: Heart, color: 'text-red-500', gradient: 'from-red-500 to-pink-600' },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30 ${isMobile ? 'pb-20' : ''}`}>
      {/* Header */}
      <div className="bg-gradient-to-br from-[#FF6F00] to-[#E65100] px-4 lg:px-6 py-6 sticky top-0 z-30 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {isMobile && (
              <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <h1 className={`${isDesktop ? 'text-2xl' : 'text-xl'} text-white font-medium`}>
              {isDesktop ? 'My Seva Journey' : 'Profile'}
            </h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-white hover:bg-white/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-4"
        >
          <div className="relative">
            <ImageWithFallback
              src={currentUser.avatar}
              alt={currentUser.name}
              className={`${isDesktop ? 'w-24 h-24' : 'w-20 h-20'} rounded-full object-cover border-4 border-white shadow-lg`}
            />
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-1 -right-1"
            >
              <div
                className="w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xl"
                style={{ backgroundColor: currentRankInfo.color }}
              >
                {currentRankInfo.icon}
              </div>
            </motion.div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className={`${isDesktop ? 'text-2xl' : 'text-xl'} text-white`}>{currentUser.name}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditOpen(true)}
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>

            <RankBadge rank={currentUser.rank} size={isDesktop ? 'md' : 'sm'} showLabel={true} className="mb-3" />

            <div className="flex items-center gap-3 text-white/90 text-sm mb-2">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{currentUser.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {currentUser.joinedDate}</span>
              </div>
            </div>

            {currentUser.bio && (
              <p className="text-white/80 text-sm line-clamp-2">{currentUser.bio}</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className={isDesktop ? 'max-w-6xl mx-auto px-6 py-6' : 'px-4 py-4'}>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 hover:shadow-lg transition-shadow">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} w-fit mb-3`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <p className={`text-2xl lg:text-3xl font-bold mb-1 ${stat.color}`}>
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-xs lg:text-sm text-gray-600">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Rank Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 mb-6 bg-gradient-to-br from-white to-orange-50/50 border-2 border-orange-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium mb-1">Rank Progression</h3>
                <p className="text-sm text-gray-600">
                  Keep serving to unlock higher ranks and exclusive perks
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedRankDetail(currentRankInfo)}
                className="border-orange-500 text-orange-600 hover:bg-orange-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>
            <RankProgressBar
              currentRank={currentUser.rank}
              currentPoints={currentUser.sevaPoints}
              size={isDesktop ? 'lg' : 'md'}
              showDetails={true}
            />
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="journey" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="journey">Journey</TabsTrigger>
            <TabsTrigger value="ladder">Ladder</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Rank Journey Tab */}
          <TabsContent value="journey">
            <Card className="p-6">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#FF6F00]" />
                Your Rank Journey
              </h3>
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {currentUser.rankHistory.slice().reverse().map((history, index) => {
                    const rankInfo = RANK_SYSTEM.find(r => r.name === history.rank);
                    if (!rankInfo) return null;
                    
                    return (
                      <motion.div
                        key={history.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-orange-50/50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                      >
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-md border-2 border-white"
                          style={{ backgroundColor: rankInfo.color }}
                        >
                          {rankInfo.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium" style={{ color: rankInfo.color }}>
                              {rankInfo.name}
                            </span>
                            {index === 0 && (
                              <Badge className="bg-green-600 text-white text-xs">Current</Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">
                            Achieved on {history.achievedDate} • {history.points} points
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedRankDetail(rankInfo)}
                          className="text-orange-600"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </Card>
          </TabsContent>

          {/* Rank Ladder Tab */}
          <TabsContent value="ladder">
            <Card className="p-6">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#FF6F00]" />
                All Ranks
              </h3>
              <div className="space-y-2">
                {RANK_SYSTEM.map((rank, index) => {
                  const isCurrentRank = rank.name === currentUser.rank;
                  const isAchieved = currentRankIndex >= index;
                  const isNext = index === currentRankIndex + 1;

                  return (
                    <motion.div
                      key={rank.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        isCurrentRank
                          ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-300 shadow-lg'
                          : isAchieved
                          ? 'bg-green-50/50 border-green-200'
                          : isNext
                          ? 'bg-blue-50/50 border-blue-200'
                          : 'bg-gray-50/50 border-gray-200'
                      } hover:shadow-md`}
                      onClick={() => setSelectedRankDetail(rank)}
                    >
                      <div className="relative">
                        <div
                          className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-md border-2 border-white ${
                            !isAchieved ? 'opacity-50 grayscale' : ''
                          }`}
                          style={{ backgroundColor: rank.color }}
                        >
                          {rank.icon}
                        </div>
                        {isCurrentRank && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -top-1 -right-1"
                          >
                            <Sparkles className="w-5 h-5 text-yellow-500" />
                          </motion.div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-lg" style={{ color: rank.color }}>
                            {rank.name}
                          </span>
                          {isCurrentRank && (
                            <Badge className="bg-orange-600 text-white">You are here</Badge>
                          )}
                          {isNext && (
                            <Badge className="bg-blue-600 text-white">Next</Badge>
                          )}
                          {isAchieved && !isCurrentRank && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              ✓ Unlocked
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-1">{rank.lore}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{rank.pointsRequired.toLocaleString()} points</span>
                          <span>•</span>
                          <span>{rank.perks.length} perks</span>
                          <span>•</span>
                          <span>{rank.unlocks.length} features</span>
                        </div>
                      </div>

                      <Eye className="w-5 h-5 text-gray-400" />
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard">
            <Card className="p-6">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#FF6F00]" />
                Community Leaderboard
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Top seva warriors making the biggest impact in our community
              </p>
              <div className="space-y-3">
                {state.users
                  .filter(u => u.sevaPoints > 0)
                  .sort((a, b) => b.sevaPoints - a.sevaPoints)
                  .map((user, index) => {
                    const userRankInfo = RANK_SYSTEM.find(r => r.name === user.rank);
                    const isCurrentUser = user.id === currentUser.id;
                    
                    return (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                          isCurrentUser
                            ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-300 shadow-lg'
                            : 'bg-white border-gray-100 hover:shadow-md'
                        }`}
                      >
                        {/* Rank Number */}
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                          {index === 0 && (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-xl shadow-lg">
                              🥇
                            </div>
                          )}
                          {index === 1 && (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-xl shadow-lg">
                              🥈
                            </div>
                          )}
                          {index === 2 && (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-xl shadow-lg">
                              🥉
                            </div>
                          )}
                          {index > 2 && (
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                              #{index + 1}
                            </div>
                          )}
                        </div>

                        {/* User Avatar */}
                        <div className="relative flex-shrink-0">
                          <ImageWithFallback
                            src={user.avatar}
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                          />
                          {userRankInfo && (
                            <div
                              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white shadow flex items-center justify-center text-xs"
                              style={{ backgroundColor: userRankInfo.color }}
                            >
                              {userRankInfo.icon}
                            </div>
                          )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-medium truncate ${
                              isCurrentUser ? 'text-[#FF6F00]' : 'text-gray-900'
                            }`}>
                              {user.name}
                              {isCurrentUser && ' (You)'}
                            </span>
                            {isCurrentUser && (
                              <Badge className="bg-orange-600 text-white text-xs">You</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              <span>{user.sevaPoints.toLocaleString()} pts</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              <span>{user.totalHelped.toLocaleString()} helped</span>
                            </div>
                            {userRankInfo && (
                              <>
                                <span>•</span>
                                <span style={{ color: userRankInfo.color }} className="font-medium">
                                  {userRankInfo.name}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Badge for top 3 */}
                        {index < 3 && (
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Trophy
                              className={`w-6 h-6 ${
                                index === 0
                                  ? 'text-yellow-500'
                                  : index === 1
                                  ? 'text-gray-400'
                                  : 'text-orange-400'
                              }`}
                            />
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
              </div>

              {/* Your Position Summary */}
              {(() => {
                const sortedUsers = state.users
                  .filter(u => u.sevaPoints > 0)
                  .sort((a, b) => b.sevaPoints - a.sevaPoints);
                const yourPosition = sortedUsers.findIndex(u => u.id === currentUser.id) + 1;
                const totalUsers = sortedUsers.length;
                
                if (yourPosition > 0) {
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border-2 border-orange-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Your Ranking</p>
                          <p className="text-2xl font-bold text-[#FF6F00]">
                            #{yourPosition} <span className="text-sm font-normal text-gray-600">of {totalUsers}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          {yourPosition > 1 && sortedUsers[yourPosition - 2] && (
                            <>
                              <p className="text-xs text-gray-600 mb-1">Points to next rank</p>
                              <p className="text-lg font-bold text-orange-600">
                                {(sortedUsers[yourPosition - 2].sevaPoints - currentUser.sevaPoints).toLocaleString()}
                              </p>
                            </>
                          )}
                          {yourPosition === 1 && (
                            <div className="flex items-center gap-2 text-yellow-600">
                              <Crown className="w-6 h-6" />
                              <span className="font-bold">Top Warrior!</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                }
                return null;
              })()}
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <div className="space-y-4">
              {userPosts.length === 0 ? (
                <Card className="p-8 text-center">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No seva posts yet</h3>
                  <p className="text-gray-600 text-sm">
                    Start sharing your community service activities to earn seva points!
                  </p>
                </Card>
              ) : (
                userPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex gap-4">
                        {post.image && (
                          <ImageWithFallback
                            src={post.image}
                            alt="Post"
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <p className="mb-2 line-clamp-2">{post.content}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              <span>{post.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>{post.comments.length}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Award className="w-4 h-4" />
                              <span>{post.helpedPeople} helped</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows={3}
                placeholder="Tell us about your seva journey..."
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveProfile} className="flex-1 bg-[#FF6F00] hover:bg-[#E65100]">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditOpen(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rank Detail Modal */}
      <RankDetailModal
        rank={selectedRankDetail}
        currentRank={currentUser.rank}
        currentPoints={currentUser.sevaPoints}
        onClose={() => setSelectedRankDetail(null)}
      />

      {/* Celebration (for testing) */}
      {showCelebration && currentRankInfo && (
        <RankCelebration
          rank={currentRankInfo}
          show={showCelebration}
          onClose={() => setShowCelebration(false)}
        />
      )}
    </div>
  );
}