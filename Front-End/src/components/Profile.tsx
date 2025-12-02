import { useState, FC } from "react";
import {
  Edit,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  Share2,
  Settings,
  Camera,
  Trophy
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import RankBadge from "./RankBadge";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useApp } from "./AppContext";
import { toast } from "sonner";

const getRankName = (rank: string) => {
  const names = {
    mavla: "Mavla",
    shiledar: "Shiledar",
    senapati: "Senapati",
    sardar: "Sardar",
    chhatrapati_senapati: "Chhatrapati's Senapati"
  };
  return names[rank as keyof typeof names] || rank;
};

const getNextRank = (currentRank: string) => {
  const ranks = ["mavla", "shiledar", "senapati", "sardar", "chhatrapati_senapati"];
  const index = ranks.indexOf(currentRank);
  return index < ranks.length - 1 ? ranks[index + 1] : null;
};

const EditProfileDialog: FC<{
  open: boolean;
  setOpen: (v: boolean) => void;
  editForm: any;
  setEditForm: any;
  handleSave: () => void;
}> = ({ open, setOpen, editForm, setEditForm, handleSave }) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button variant="ghost" size="sm" className="p-1">
        <Edit className="w-4 h-4" />
      </Button>
    </DialogTrigger>

    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogDescription>
          Update your profile information including name, bio, and location.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Name</label>
          <Input
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Bio</label>
          <Textarea
            value={editForm.bio}
            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
            className="min-h-[80px]"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Location</label>
          <Input
            value={editForm.location}
            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="flex-1 bg-[#FF6F00] hover:bg-[#E65100]" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default function Profile() {
  const { state, dispatch, getRankProgress } = useApp();
  const { currentUser, posts, helpRequests } = state;

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: currentUser.name,
    bio: currentUser.bio,
    location: currentUser.location
  });

  const rankProgress = getRankProgress();
  const nextRank = getNextRank(currentUser.currentRank);

  const userPosts = posts.filter(p => p.userId === currentUser.id);
  const joinedRequests = helpRequests.filter(r => r.helpersJoined.includes(currentUser.id));

  const maxCategoryCount = Math.max(...currentUser.categories.map(c => c.count), 1);

  const handleSaveProfile = () => {
    dispatch({
      type: "UPDATE_USER",
      payload: editForm
    });
    setShowEditDialog(false);
    toast.success("Profile updated successfully!");
  };

  const handleShare = () => {
    const shareText = `Check out my seva journey on HindaviSwarajya!

Rank: ${getRankName(currentUser.currentRank)}
People Helped: ${currentUser.totalHelped}
Seva Points: ${currentUser.sevaPoints}

Join me in serving the community!`;

    if (navigator.share) {
      navigator.share({
        title: "My Seva Journey - HindaviSwarajya",
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Profile details copied to clipboard!");
    }
  };

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="bg-white border-b px-4 py-4 sticky top-0 z-30 flex justify-between">
        <h1 className="text-xl text-[#FF6F00]">Profile</h1>
        <Button variant="ghost" size="sm"><Settings className="w-5 h-5" /></Button>
      </div>

      {/* Profile Header */}
      <div className="px-4 py-6">
        <Card className="p-6">
          <div className="flex items-start gap-4">

            {/* Avatar */}
            <div className="relative">
              <ImageWithFallback
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="absolute -bottom-2 -right-2">
                <RankBadge rank={currentUser.currentRank} size="sm" />
              </div>
              <button className="absolute -top-1 -right-1 bg-[#FF6F00] text-white rounded-full p-1">
                <Camera className="w-3 h-3" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-medium">{currentUser.name}</h2>
                <EditProfileDialog
                  open={showEditDialog}
                  setOpen={setShowEditDialog}
                  editForm={editForm}
                  setEditForm={setEditForm}
                  handleSave={handleSaveProfile}
                />
              </div>

              <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4" /> {currentUser.location}
              </div>

              <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                <Calendar className="w-4 h-4" />
                Sevak since {currentUser.joinDate}
              </div>

              <p className="text-sm text-gray-700">{currentUser.bio}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Rank Progress */}
      <div className="px-4 pb-4">
        <Card className="p-4">

          <div className="flex justify-between mb-3">
            <h3 className="font-medium">Rank Progress</h3>
            <Button variant="ghost" size="sm" className="text-[#FF6F00]" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-1" /> Share
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <RankBadge rank={currentUser.currentRank} size="md" />

              {nextRank && (
                <>
                  <div className="flex-1 mx-4">
                    <Progress value={rankProgress.progress} className="h-2" />
                  </div>
                  <RankBadge rank={nextRank as any} size="md" />
                </>
              )}
            </div>

            <div className="text-center">
              {nextRank ? (
                <>
                  <p className="text-sm text-gray-600">
                    {rankProgress.next - rankProgress.current} more seva points to reach{" "}
                    <span className="text-[#FF6F00] font-medium">{getRankName(nextRank)}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Current: {rankProgress.current} / {rankProgress.next}
                  </p>
                </>
              ) : (
                <div className="flex justify-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <p className="text-sm text-[#FF6F00] font-medium">
                    Highest rank achieved!
                  </p>
                </div>
              )}
            </div>
          </div>

        </Card>
      </div>

      {/* Stats Grid */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-4">

          <Card className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-[#FF6F00] mx-auto mb-2" />
            <p className="text-2xl font-medium text-[#FF6F00]">{currentUser.totalHelped}</p>
            <p className="text-sm text-gray-600">People Helped</p>
          </Card>

          <Card className="p-4 text-center">
            <Calendar className="w-6 h-6 text-[#FF6F00] mx-auto mb-2" />
            <p className="text-2xl font-medium text-[#FF6F00]">{currentUser.activeDays}</p>
            <p className="text-sm text-gray-600">Active Days</p>
          </Card>

          <Card className="p-4 text-center">
            <Award className="w-6 h-6 text-[#FF6F00] mx-auto mb-2" />
            <p className="text-2xl font-medium text-[#FF6F00]">{currentUser.sevaPoints}</p>
            <p className="text-sm text-gray-600">Seva Points</p>
          </Card>

        </div>
      </div>

      {/* Activity Summary */}
      <div className="px-4 pb-4">
        <Card className="p-4">
          <h3 className="font-medium mb-3">Activity Summary</h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <SummaryItem label="Seva Posts" value={userPosts.length} />
            <SummaryItem label="Help Requests Joined" value={joinedRequests.length} />
            <SummaryItem
              label="Total Likes Received"
              value={userPosts.reduce((sum, p) => sum + p.likes, 0)}
            />
            <SummaryItem
              label="Comments Made"
              value={posts.reduce(
                (sum, post) =>
                  sum + post.comments.filter((c) => c.userId === currentUser.id).length,
                0
              )}
            />
          </div>
        </Card>
      </div>

      {/* Seva Categories */}
      <div className="px-4 pb-4">
        <Card className="p-4">
          <h3 className="font-medium mb-3">Seva Categories</h3>

          <div className="space-y-3">
            {currentUser.categories.map((category) => (
              <div key={category.name} className="flex justify-between">
                <span className="text-sm">{category.name}</span>

                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 h-2 rounded-full">
                    <div
                      className="bg-[#FF6F00] h-2 rounded-full"
                      style={{
                        width: `${(category.count / maxCategoryCount) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-[#FF6F00] w-8">
                    {category.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Achievements */}
      <div className="px-4 pb-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-[#FF6F00]" />
            <h3 className="font-medium">Recent Achievements</h3>
          </div>

          <div className="space-y-2">
            {currentUser.achievements.map((ach, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FF6F00] rounded-full"></div>
                <span className="text-sm text-gray-700">{ach}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Actions */}
      <div className="px-4 pb-4 space-y-3">
        <Button
          className="w-full bg-[#FF6F00] hover:bg-[#E65100] text-white"
          onClick={() => toast.info("Seva history feature coming soon!")}
        >
          View My Seva History
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => toast.info("Leaderboard coming soon!")}>
            Leaderboard
          </Button>
          <Button variant="outline" onClick={() => toast.info("Invite feature coming soon!")}>
            Invite Friends
          </Button>
        </div>
      </div>

      {/* Maharaj Quote */}
      <div className="px-4 pb-4">
        <Card className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <p className="text-[#FF6F00] font-medium text-center text-sm">
            "जो वाढविल धर्म सकळांचा सो वाढविल राज्य आपणासि"
          </p>
          <p className="text-gray-600 text-xs text-center">
            "He who nurtures all religions, expands his own kingdom"
          </p>
        </Card>
      </div>

    </div>
  );
}

const SummaryItem = ({ label, value }: { label: string; value: number }) => (
  <div className="flex justify-between">
    <span className="text-gray-600">{label}</span>
    <span className="font-medium text-[#FF6F00]">{value}</span>
  </div>
);
