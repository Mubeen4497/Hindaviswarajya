import { useState } from "react";
import { Edit, MapPin, Calendar, Award, Heart, MessageCircle, TrendingUp, ArrowLeft, LogOut } from "lucide-react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import RankBadge from "./RankBadge";
import { useApp } from "./AppContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner@2.0.3";
import { useScreenSize } from "./ui/use-screen-size";

// Profile Screen Component

// Helper functions for rank management
const getRankName = (rank: string) => {
  const names = {
    Sevak: "Sevak",
    Karyakarta: "Karyakarta",
    Nayak: "Nayak",
    Sardar: "Sardar",
    Senapati: "Senapati"
  };
  return names[rank as keyof typeof names] || rank;
};

const getNextRank = (currentRank: string) => {
  const ranks = ["Sevak", "Karyakarta", "Nayak", "Sardar", "Senapati"];
  const index = ranks.indexOf(currentRank);
  return index < ranks.length - 1 ? ranks[index + 1] : null;
};

interface ProfileScreenProps {
  onBack: () => void;
}

export default function ProfileScreen({ onBack }: ProfileScreenProps) {
  const { state, updateUserProfile, logout } = useApp();
  const { currentUser, posts } = state;
  const { isDesktop } = useScreenSize();
  
  if (!currentUser) return null;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editLocation, setEditLocation] = useState(currentUser.location);
  const [editBio, setEditBio] = useState(currentUser.bio || "");

  const userPosts = posts.filter(post => post.userId === currentUser.id);
  const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0);
  const totalComments = userPosts.reduce((sum, post) => sum + post.comments.length, 0);

  const handleSaveProfile = () => {
    updateUserProfile({
      name: editName,
      location: editLocation,
      bio: editBio,
    });
    setIsEditOpen(false);
  };

  
  const stats = [
    { label: "Seva Posts", value: currentUser.postsCount, icon: TrendingUp, color: "text-[#FF6F00]" },
    { label: "People Helped", value: currentUser.totalHelped, icon: Award, color: "text-green-600" },
    { label: "Total Likes", value: totalLikes, icon: Heart, color: "text-red-500" },
    { label: "Seva Points", value: currentUser.sevaPoints, icon: Award, color: "text-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#FF6F00] to-[#F57C00] px-4 py-6 sticky top-0 z-30">
        <div className="flex items-center gap-3 mb-4">
          {isDesktop ? (
            <>
              <h1 className="text-xl text-white">My Profile</h1>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl text-white">My Profile</h1>
            </>
          )}
        </div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-4"
        >
          <ImageWithFallback
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl text-white">{currentUser.name}</h2>
              <RankBadge rank={currentUser.rank} size="md" showLabel={false} />
            </div>
            <div className="flex items-center gap-1 text-white/90 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{currentUser.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <RankBadge rank={currentUser.rank} size="sm" showLabel={true} />
              <span className="text-sm text-white/90">• {currentUser.sevaPoints} points</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-white text-[#FF6F00] hover:bg-white/90">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>Update your profile information below.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="mt-2"
                    placeholder="Tell us about yourself and your seva journey..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} className="flex-1 bg-[#FF6F00] hover:bg-[#E65100]">
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
            </Dialog>
            <Button 
              size="sm" 
              variant="outline"
              onClick={logout}
              className="bg-white text-red-600 border-white hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* Bio */}
        {currentUser.bio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4 mb-6">
              <h3 className="font-medium text-[#FF6F00] mb-2">About</h3>
              <p className="text-gray-700">{currentUser.bio}</p>
            </Card>
          </motion.div>
        )}

        {/* Rank Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="p-4 mb-6 bg-gradient-to-br from-[#FFF3E0] to-[#FFE0B2]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium text-[#FF6F00] mb-1">Current Rank</h3>
                <p className="text-2xl font-semibold text-gray-800">{getRankName(currentUser.rank)}</p>
              </div>
              <RankBadge rank={currentUser.rank} size="lg" showLabel={false} />
            </div>
            {getNextRank(currentUser.rank) ? (
              <>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress to {getRankName(getNextRank(currentUser.rank)!)}</span>
                  <span className="font-medium text-[#FF6F00]">{currentUser.sevaPoints} points</span>
                </div>
                <div className="w-full bg-white/50 rounded-full h-2">
                  <div 
                    className="bg-[#FF6F00] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((currentUser.sevaPoints / 1000) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {Math.max(1000 - currentUser.sevaPoints, 0)} more points to reach {getRankName(getNextRank(currentUser.rank)!)}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-600">🎉 You've achieved the highest rank!</p>
            )}
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          {stats.map((stat, index) => (
            <Card key={stat.label} className="p-4 text-center">
              <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
              <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-600">{stat.label}</p>
            </Card>
          ))}
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 mb-6">
            <h3 className="font-medium text-[#FF6F00] mb-3">Achievements</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                <Award className="w-5 h-5 text-[#FF6F00]" />
                <div>
                  <p className="text-xs text-gray-600">First Seva</p>
                  <p className="text-sm font-medium">Unlocked</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                <Heart className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-xs text-gray-600">100 Likes</p>
                  <p className="text-sm font-medium">Unlocked</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-xs text-gray-600">100+ Helped</p>
                  <p className="text-sm font-medium">Unlocked</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Posts Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="posts">My Posts ({userPosts.length})</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="space-y-4 mt-4">
              {userPosts.length === 0 ? (
                <Card className="p-8 text-center">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No posts yet</h3>
                  <p className="text-gray-600 mb-4">Start sharing your seva activities!</p>
                </Card>
              ) : (
                userPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-4">
                      <p className="mb-3">{post.content}</p>
                      {post.image && (
                        <div className="rounded-lg overflow-hidden mb-3">
                          <ImageWithFallback
                            src={post.image}
                            alt="Seva activity"
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex gap-4">
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {post.comments.length}
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            {post.helpedPeople}
                          </span>
                        </div>
                        <span className="text-xs">{post.timestamp}</span>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </TabsContent>
            <TabsContent value="activity" className="mt-4">
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <Calendar className="w-5 h-5 text-[#FF6F00]" />
                    <div>
                      <p className="text-sm font-medium">Joined HindaviSwarajya</p>
                      <p className="text-xs text-gray-600">{currentUser.joinedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <Award className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Reached {getRankName(currentUser.rank)} rank</p>
                      <p className="text-xs text-gray-600">Recent</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Helped {currentUser.totalHelped} people</p>
                      <p className="text-xs text-gray-600">Lifetime impact</p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}