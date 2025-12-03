import { useState } from "react";
import { Heart, MessageCircle, Share, MapPin, Clock, MoreVertical, Filter, Search, Bookmark, UserPlus, TrendingUp, Zap, Calendar, Users, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import RankBadge from "./RankBadge";
import QuickGuide from "./QuickGuide";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useScreenSize } from "./ui/use-screen-size";
import { useApp, SevaPost } from "./AppContext";
import { toast } from "sonner@2.0.3";

// Home Screen Component

const categoryColors = {
  Food: "bg-green-100 text-green-800",
  Education: "bg-blue-100 text-blue-800", 
  Health: "bg-red-100 text-red-800",
  Shelter: "bg-purple-100 text-purple-800",
  Other: "bg-gray-100 text-gray-800"
};

const categoryFilters = ["All", "Food", "Education", "Health", "Shelter", "Other"];

interface HomeScreenProps {
  onNavigate?: (screen: string) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { isDesktop, isMobile } = useScreenSize();
  const { state, likePost, addComment } = useApp();
  const { posts, currentUser } = state;
  
  const [commentInputs, setCommentInputs] = useState<{[key: string]: string}>({});
  const [showComments, setShowComments] = useState<{[key: string]: boolean}>({});
  const [selectedPost, setSelectedPost] = useState<SevaPost | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("recent");
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);

  // Filter and sort posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchTerm === "" || 
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === "All" || post.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case "likes":
        return b.likes - a.likes;
      case "impact":
        return b.helpedPeople - a.helpedPeople;
      case "comments":
        return b.comments.length - a.comments.length;
      default:
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
  });

  const handleLike = (postId: string) => {
    likePost(postId);
    const post = posts.find(p => p.id === postId);
    if (post && !post.likedBy.includes(currentUser.id)) {
      toast.success("Post liked! ❤️");
    }
  };

  const handleComment = (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (content) {
      addComment(postId, content);
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    }
  };

  const handleShare = (post: SevaPost) => {
    const shareText = `Check out this amazing seva by ${post.user.name}!\n\n"${post.content}"\n\n${post.helpedPeople} people helped 🙏\n\nJoin HindaviSwarajya to share your seva too!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Amazing Seva - HindaviSwarajya',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Post details copied to clipboard!');
    }
  };

  const handleSavePost = (postId: string) => {
    setSavedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
    toast.success(savedPosts.includes(postId) ? "Post removed from saved" : "Post saved!");
  };

  const handleFollowUser = (userId: string) => {
    setFollowedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
    const user = posts.find(p => p.userId === userId)?.user;
    toast.success(followedUsers.includes(userId) ? `Unfollowed ${user?.name}` : `Following ${user?.name}!`);
  };

  const toggleComments = (postId: string) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const PostDetailDialog = ({ post }: { post: SevaPost }) => (
    <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Seva Details</DialogTitle>
          <DialogDescription>
            View detailed information about this seva activity
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* User Header */}
          <div className="flex items-center gap-3">
            <ImageWithFallback
              src={post.user.avatar}
              alt={post.user.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{post.user.name}</h3>
                <RankBadge rank={post.user.rank} size="sm" showLabel={true} />
              </div>
              <p className="text-sm text-gray-600">{post.user.location}</p>
            </div>
            <Button
              size="sm"
              onClick={() => handleFollowUser(post.userId)}
              className={followedUsers.includes(post.userId) ? "bg-gray-200 text-gray-700" : "bg-[#FF6F00] hover:bg-[#E65100]"}
            >
              <UserPlus className="w-4 h-4 mr-1" />
              {followedUsers.includes(post.userId) ? "Following" : "Follow"}
            </Button>
          </div>

          {/* Content */}
          <div>
            <p className="leading-relaxed mb-3">{post.content}</p>
            
            <div className="flex items-center gap-2 mb-3">
              <Badge className={categoryColors[post.category]}>{post.category}</Badge>
              <Badge className="text-[#FF6F00] border border-[#FF6F00] bg-transparent">
                {post.helpedPeople} people helped
              </Badge>
            </div>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {post.tags.map((tag, index) => (
                  <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Image */}
          {post.image && (
            <div className="rounded-lg overflow-hidden">
              <ImageWithFallback
                src={post.image}
                alt="Seva activity"
                className="w-full max-h-96 object-cover"
              />
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-6 py-3 border-y border-gray-100">
            <div className="flex items-center gap-1">
              <Heart className="w-5 h-5 text-red-500" />
              <span>{post.likes} likes</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-5 h-5 text-blue-500" />
              <span>{post.comments.length} comments</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span>{post.helpedPeople} impact</span>
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-3">
            <h4 className="font-medium">Comments</h4>
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex gap-2">
                <ImageWithFallback
                  src={comment.userAvatar}
                  alt={comment.userName}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{comment.userName}</span>
                      <span className="text-xs text-gray-500">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Comment */}
            <div className="flex gap-2">
              <ImageWithFallback
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Add a comment..."
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                />
                <Button 
                  onClick={() => handleComment(post.id)}
                  disabled={!commentInputs[post.id]?.trim()}
                  className="bg-[#FF6F00] hover:bg-[#E65100]"
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const SidebarWidget = () => (
    <div className="space-y-4">
      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-4">
          <h3 className="font-medium mb-3 text-[#FF6F00]">Today's Impact</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">New Seva Posts</span>
              <span className="font-medium text-[#FF6F00]">{posts.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">People Helped</span>
              <span className="font-medium text-[#FF6F00]">{posts.reduce((sum, post) => sum + post.helpedPeople, 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Active Sevaks</span>
              <span className="font-medium text-[#FF6F00]">{state.users.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Likes</span>
              <span className="font-medium text-[#FF6F00]">{posts.reduce((sum, post) => sum + post.likes, 0)}</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Upcoming Events Widget */}
      {state.events && state.events.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-[#FF6F00]">Upcoming Events</h3>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('events')}
                  className="text-xs text-[#FF6F00] hover:underline"
                >
                  View All
                </button>
              )}
            </div>
            <div className="space-y-3">
              {state.events
                .filter(e => e.status === 'upcoming')
                .slice(0, 2)
                .map((event) => (
                  <div
                    key={event.id}
                    onClick={() => onNavigate && onNavigate('events')}
                    className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-[#FF6F00] mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{event.title}</p>
                        <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Users className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {event.volunteersRegistered.length}/{event.volunteersNeeded}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Trending Tags */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="p-4">
          <h3 className="font-medium mb-3 text-[#FF6F00]">Trending Tags</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(posts.flatMap(post => post.tags))).slice(0, 8).map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchTerm(`#${tag}`)}
                className="text-xs bg-[#FFF3E0] text-[#FF6F00] px-2 py-1 rounded-full hover:bg-[#FFE0B2] transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Top Helpers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="p-4">
          <h3 className="font-medium mb-3 text-[#FF6F00]">Top Helpers This Week</h3>
          <div className="space-y-3">
            {posts.slice(0, 3).map((post, index) => (
              <div key={post.id} className="flex items-center gap-2">
                <div className="text-xs font-medium text-[#FF6F00] w-4">#{index + 1}</div>
                <ImageWithFallback
                  src={post.user.avatar}
                  alt={post.user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{post.user.name}</p>
                  <p className="text-xs text-gray-500">{post.helpedPeople} helped</p>
                </div>
                <RankBadge rank={post.user.rank} size="sm" showLabel={false} />
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Inspirational Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card className="p-4 bg-gradient-to-br from-[#FFF3E0] to-orange-50 border-[#FF6F00]/20">
          <h3 className="font-medium mb-2 text-[#FF6F00]">Daily Inspiration</h3>
          <blockquote className="text-sm text-gray-700 leading-relaxed">
            "गवार राज्यापेक्षा स्वराज्य बरे"
          </blockquote>
          <p className="text-xs text-gray-500 mt-1">Self-rule is better than foreign rule</p>
        </Card>
      </motion.div>

      {/* Quick Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="p-4 text-center">
          <h3 className="font-medium mb-2 text-[#FF6F00]">New Here?</h3>
          <p className="text-sm text-gray-600 mb-3">Learn how to make the most of the platform</p>
          <QuickGuide />
        </Card>
      </motion.div>
    </div>
  );

  return (
    <div className={`${isMobile ? 'pb-20' : ''} bg-gray-50 min-h-screen`}>
      {/* Header */}
      <div className={`bg-white border-b border-gray-200 px-4 lg:px-6 py-4 ${isDesktop ? '' : 'sticky top-0 z-30'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className={`${isDesktop ? 'text-2xl' : 'text-xl'} text-[#FF6F00]`}>
                {isMobile ? 'हिंदवी स्वराज्य' : 'Seva Feed'}
              </h1>
              <p className="text-sm text-gray-600">
                {isMobile ? 'Seva Feed' : 'Latest community service activities'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Seva</p>
            <p className={`${isDesktop ? 'text-xl' : 'text-lg'} text-[#FF6F00]`}>
              {posts.reduce((sum, post) => sum + post.helpedPeople, 0)} helps
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search seva posts, users, tags..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {isDesktop && (
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Advanced
              </Button>
            )}
          </div>

          {isDesktop && (
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="likes">Most Liked</SelectItem>
                  <SelectItem value="impact">Highest Impact</SelectItem>
                  <SelectItem value="comments">Most Discussed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryFilters.map((filter) => (
                    <SelectItem key={filter} value={filter}>{filter}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs for Mobile */}
      {isMobile && (
        <div className="bg-white px-4 py-3 border-b border-gray-200">
          <Tabs value={sortBy} onValueChange={setSortBy}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="recent" className="text-xs">Recent</TabsTrigger>
              <TabsTrigger value="likes" className="text-xs">Popular</TabsTrigger>
              <TabsTrigger value="impact" className="text-xs">Impact</TabsTrigger>
              <TabsTrigger value="comments" className="text-xs">Discussed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Main Content */}
      <div className={isDesktop ? "flex gap-6 px-6 py-6" : "px-4 py-4"}>
        {/* Posts Feed */}
        <div className={isDesktop ? "flex-1 max-w-2xl" : "space-y-4"}>
          {/* Create Event CTA Card */}
          {onNavigate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-[#FF6F00] to-[#E65100] text-white p-6 mb-4 hover:shadow-lg transition-shadow cursor-pointer overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Organize a Seva Event</h3>
                        <p className="text-sm text-white/90">Create impact at scale</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-white/90 mb-4 text-sm">
                    Plan seminars, cleaning drives, food distribution, medical camps, and more. Bring your community together for greater impact!
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                      <Calendar className="w-3 h-3" />
                      <span>Schedule Events</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                      <Users className="w-3 h-3" />
                      <span>Recruit Volunteers</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                      <TrendingUp className="w-3 h-3" />
                      <span>Track Impact</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => onNavigate('create-event')}
                    className="w-full bg-white text-[#FF6F00] hover:bg-gray-100"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {filteredPosts.length === 0 ? (
            <Card className="p-8 text-center">
              <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium mb-2">
                {searchTerm ? "No posts found" : "No seva posts yet"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? "Try different keywords or check your spelling"
                  : "Be the first to share your seva and inspire others!"
                }
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className={`p-4 lg:p-6 bg-white ${isDesktop ? 'hover:shadow-md transition-shadow' : ''}`}>
                      {/* User Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <ImageWithFallback
                            src={post.user.avatar}
                            alt={post.user.name}
                            className={`${isDesktop ? 'w-14 h-14' : 'w-12 h-12'} rounded-full object-cover`}
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className={`${isDesktop ? 'text-lg' : ''} font-medium cursor-pointer hover:text-[#FF6F00]`}>
                                {post.user.name}
                              </h3>
                              <RankBadge rank={post.user.rank} size="sm" showLabel={false} />
                              {followedUsers.includes(post.userId) && (
                                <Badge className="text-xs bg-gray-200 text-gray-700">Following</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin className="w-3 h-3" />
                              <span>{post.user.location}</span>
                              <span>•</span>
                              <Clock className="w-3 h-3" />
                              <span>{post.timestamp}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleSavePost(post.id)}
                            className="p-1"
                          >
                            <Bookmark className={`w-4 h-4 ${savedPosts.includes(post.id) ? 'fill-[#FF6F00] text-[#FF6F00]' : 'text-gray-400'}`} />
                          </motion.button>
                          <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer" />
                        </div>
                      </div>

                      {/* Content */}
                      <p className={`mb-3 leading-relaxed ${isDesktop ? 'text-base' : ''} cursor-pointer`} 
                         onClick={() => setSelectedPost(post)}>
                        {post.content}
                      </p>

                      {/* Category Tag */}
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${categoryColors[post.category]}`}>
                          {post.category}
                        </span>
                        <span className="text-xs text-[#FF6F00] font-medium">
                          {post.helpedPeople} people helped
                        </span>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex gap-1">
                            {post.tags.slice(0, 2).map((tag, index) => (
                              <button
                                key={index}
                                onClick={() => setSearchTerm(`#${tag}`)}
                                className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded hover:bg-[#FFF3E0] hover:text-[#FF6F00] transition-colors"
                              >
                                #{tag}
                              </button>
                            ))}
                            {post.tags.length > 2 && (
                              <span className="text-xs text-gray-500">+{post.tags.length - 2}</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Image */}
                      {post.image && (
                        <div className="mb-3 rounded-lg overflow-hidden cursor-pointer" 
                             onClick={() => setSelectedPost(post)}>
                          <ImageWithFallback
                            src={post.image}
                            alt="Seva activity"
                            className={`w-full ${isDesktop ? 'h-64' : 'h-48'} object-cover hover:scale-105 transition-transform`}
                          />
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-6">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleLike(post.id)}
                            className="flex items-center gap-1 text-gray-600 hover:text-[#FF6F00] transition-colors"
                          >
                            <Heart className={`w-5 h-5 ${post.likedBy.includes(currentUser.id) ? "fill-[#FF6F00] text-[#FF6F00]" : ""}`} />
                            <span className="text-sm">{post.likes}</span>
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleComments(post.id)}
                            className="flex items-center gap-1 text-gray-600 hover:text-[#FF6F00] transition-colors"
                          >
                            <MessageCircle className="w-5 h-5" />
                            <span className="text-sm">{post.comments.length}</span>
                          </motion.button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleFollowUser(post.userId)}
                            className="text-xs"
                          >
                            <UserPlus className="w-4 h-4 mr-1" />
                            {followedUsers.includes(post.userId) ? "Following" : "Follow"}
                          </Button>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleShare(post)}
                            className="flex items-center gap-1 text-gray-600 hover:text-[#FF6F00] transition-colors"
                          >
                            <Share className="w-5 h-5" />
                            <span className="text-sm">Share</span>
                          </motion.button>
                        </div>
                      </div>

                      {/* Comments Section */}
                      <AnimatePresence>
                        {showComments[post.id] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 border-t border-gray-100 pt-4 overflow-hidden"
                          >
                            {/* Comment Input */}
                            <div className="flex gap-2 mb-3">
                              <ImageWithFallback
                                src={currentUser.avatar}
                                alt={currentUser.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div className="flex-1 flex gap-2">
                                <Input
                                  placeholder="Add a comment..."
                                  value={commentInputs[post.id] || ''}
                                  onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                  onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                                  className="flex-1"
                                />
                                <Button 
                                  onClick={() => handleComment(post.id)}
                                  disabled={!commentInputs[post.id]?.trim()}
                                  className="bg-[#FF6F00] hover:bg-[#E65100]"
                                  size="sm"
                                >
                                  Post
                                </Button>
                              </div>
                            </div>

                            {/* Comments List */}
                            <div className="space-y-3">
                              {post.comments.slice(0, 3).map((comment) => (
                                <motion.div
                                  key={comment.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="flex gap-2"
                                >
                                  <ImageWithFallback
                                    src={comment.userAvatar}
                                    alt={comment.userName}
                                    className="w-6 h-6 rounded-full object-cover"
                                  />
                                  <div className="flex-1">
                                    <div className="bg-gray-50 rounded-lg p-2">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-medium">{comment.userName}</span>
                                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                                      </div>
                                      <p className="text-sm">{comment.content}</p>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                              {post.comments.length > 3 && (
                                <button 
                                  onClick={() => setSelectedPost(post)}
                                  className="text-sm text-[#FF6F00] hover:underline"
                                >
                                  View all {post.comments.length} comments
                                </button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Desktop Sidebar */}
        {isDesktop && (
          <div className="w-80">
            <SidebarWidget />
          </div>
        )}
      </div>

      {/* Post Detail Dialog */}
      {selectedPost && <PostDetailDialog post={selectedPost} />}
    </div>
  );
}