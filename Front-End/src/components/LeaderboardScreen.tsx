import { useState } from "react";
import { Trophy, Crown, Medal, TrendingUp, Award, ArrowLeft, Filter } from "lucide-react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import RankBadge from "./RankBadge";
import { useApp } from "./AppContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface LeaderboardScreenProps {
  onBack: () => void;
}

export default function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  const { state } = useApp();
  const { users, currentUser } = state;
  const [timeFilter, setTimeFilter] = useState("alltime");

  // Sort users by seva points
  const sortedUsers = [...users].sort((a, b) => b.sevaPoints - a.sevaPoints);

  // Get top 3 users
  const topThree = sortedUsers.slice(0, 3);
  const restOfUsers = sortedUsers.slice(3);

  // Find current user rank
  const currentUserRank = sortedUsers.findIndex(u => u.id === currentUser.id) + 1;

  const podiumPositions = [
    { user: topThree[1], position: 2, icon: Medal, color: "text-gray-400", bgColor: "bg-gray-100", height: "h-32" },
    { user: topThree[0], position: 1, icon: Crown, color: "text-yellow-500", bgColor: "bg-yellow-50", height: "h-40" },
    { user: topThree[2], position: 3, icon: Award, color: "text-orange-400", bgColor: "bg-orange-50", height: "h-24" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#FF6F00] to-[#F57C00] px-4 py-6 sticky top-0 z-30">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl text-white">Leaderboard</h1>
            <p className="text-sm text-white/90">Top Sevaks & Contributors</p>
          </div>
          <Trophy className="w-8 h-8 text-white" />
        </div>
      </div>

      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Tabs defaultValue="points" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="points">Seva Points</TabsTrigger>
              <TabsTrigger value="helped">People Helped</TabsTrigger>
              <TabsTrigger value="posts">Most Posts</TabsTrigger>
            </TabsList>
            <TabsContent value="points" className="mt-6">
              {/* Top 3 Podium */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-6 mb-6">
                  <h3 className="text-center font-medium text-[#FF6F00] mb-6">Top Contributors</h3>
                  <div className="flex items-end justify-center gap-4">
                    {podiumPositions.map((item, index) => {
                      if (!item.user) return null;
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={item.position}
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                          className="flex flex-col items-center"
                        >
                          <div className="relative mb-2">
                            <ImageWithFallback
                              src={item.user.avatar}
                              alt={item.user.name}
                              className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                            <div className={`absolute -top-2 -right-2 ${item.bgColor} ${item.color} rounded-full p-1.5`}>
                              <Icon className="w-4 h-4" />
                            </div>
                          </div>
                          <p className="font-medium text-sm text-center mb-1">{item.user.name}</p>
                          <RankBadge rank={item.user.rank} size="sm" showLabel={false} />
                          <div className={`${item.bgColor} ${item.height} w-24 mt-3 rounded-t-lg flex flex-col items-center justify-center`}>
                            <p className="text-2xl font-bold">{item.position}</p>
                            <p className="text-xs font-medium">{item.user.sevaPoints}</p>
                            <p className="text-xs text-gray-600">points</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>

              {/* Current User Rank */}
              {currentUserRank > 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="p-4 mb-4 bg-[#FFF3E0] border-[#FF6F00]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#FF6F00] text-white rounded-full flex items-center justify-center font-medium">
                        {currentUserRank}
                      </div>
                      <ImageWithFallback
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">You</p>
                        <p className="text-xs text-gray-600">{currentUser.sevaPoints} points</p>
                      </div>
                      <RankBadge rank={currentUser.rank} size="sm" showLabel={true} />
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Rest of Rankings */}
              <div className="space-y-2">
                {restOfUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                  >
                    <Card className={`p-4 ${user.id === currentUser.id ? 'bg-[#FFF3E0] border-[#FF6F00]' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-medium text-gray-700">
                          {index + 4}
                        </div>
                        <ImageWithFallback
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{user.name}</p>
                            {user.id === currentUser.id && (
                              <span className="text-xs bg-[#FF6F00] text-white px-2 py-0.5 rounded">You</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">{user.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-[#FF6F00]">{user.sevaPoints}</p>
                          <p className="text-xs text-gray-600">points</p>
                        </div>
                        <RankBadge rank={user.rank} size="sm" showLabel={false} />
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="helped" className="mt-6">
              <div className="space-y-2">
                {[...users].sort((a, b) => b.totalHelped - a.totalHelped).map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`p-4 ${user.id === currentUser.id ? 'bg-[#FFF3E0] border-[#FF6F00]' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${index < 3 ? 'bg-[#FF6F00] text-white' : 'bg-gray-100 text-gray-700'} rounded-full flex items-center justify-center font-medium`}>
                          {index + 1}
                        </div>
                        <ImageWithFallback
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{user.name}</p>
                            {user.id === currentUser.id && (
                              <span className="text-xs bg-[#FF6F00] text-white px-2 py-0.5 rounded">You</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">{user.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">{user.totalHelped}</p>
                          <p className="text-xs text-gray-600">helped</p>
                        </div>
                        <RankBadge rank={user.rank} size="sm" showLabel={false} />
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="posts" className="mt-6">
              <div className="space-y-2">
                {[...users].sort((a, b) => b.postsCount - a.postsCount).map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`p-4 ${user.id === currentUser.id ? 'bg-[#FFF3E0] border-[#FF6F00]' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${index < 3 ? 'bg-[#FF6F00] text-white' : 'bg-gray-100 text-gray-700'} rounded-full flex items-center justify-center font-medium`}>
                          {index + 1}
                        </div>
                        <ImageWithFallback
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{user.name}</p>
                            {user.id === currentUser.id && (
                              <span className="text-xs bg-[#FF6F00] text-white px-2 py-0.5 rounded">You</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">{user.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-blue-600">{user.postsCount}</p>
                          <p className="text-xs text-gray-600">posts</p>
                        </div>
                        <RankBadge rank={user.rank} size="sm" showLabel={false} />
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Rank Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-4 bg-gradient-to-br from-[#FFF3E0] to-orange-50 border-[#FF6F00]/20">
            <h3 className="font-medium text-[#FF6F00] mb-3">Rank Levels</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RankBadge rank="Sevak" size="sm" showLabel={false} />
                  <span>Sevak</span>
                </div>
                <span className="text-gray-600">0 - 9 points</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RankBadge rank="Mavla" size="sm" showLabel={false} />
                  <span>Mavla</span>
                </div>
                <span className="text-gray-600">10 - 99 points</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RankBadge rank="Talveer" size="sm" showLabel={false} />
                  <span>Talveer</span>
                </div>
                <span className="text-gray-600">100 - 249 points</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RankBadge rank="Yoddha" size="sm" showLabel={false} />
                  <span>Yoddha</span>
                </div>
                <span className="text-gray-600">250 - 999 points</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RankBadge rank="Shiledar" size="sm" showLabel={false} />
                  <span>Shiledar</span>
                </div>
                <span className="text-gray-600">1,000 - 4,999 points</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RankBadge rank="Bargir" size="sm" showLabel={false} />
                  <span>Bargir</span>
                </div>
                <span className="text-gray-600">5,000 - 9,999 points</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RankBadge rank="Daryaveer" size="sm" showLabel={false} />
                  <span>Daryaveer</span>
                </div>
                <span className="text-gray-600">10,000 - 24,999 points</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RankBadge rank="Gadkari" size="sm" showLabel={false} />
                  <span>Gadkari</span>
                </div>
                <span className="text-gray-600">25,000 - 49,999 points</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RankBadge rank="Senapati" size="sm" showLabel={false} />
                  <span>Senapati</span>
                </div>
                <span className="text-gray-600">50,000 - 99,999 points</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RankBadge rank="Chhava" size="sm" showLabel={false} />
                  <span>Chhava</span>
                </div>
                <span className="text-gray-600">100,000+ points</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}