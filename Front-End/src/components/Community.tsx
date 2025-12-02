import { useState } from "react";
import { MessageCircle, Heart, BookOpen, Calendar, Users, Pin, Search, Filter, Plus, Eye, Share2, MoreVertical, MapPin, ChevronRight, Clock, Bookmark } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import RankBadge from "./RankBadge";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useScreenSize } from "./ui/use-screen-size";
import { useApp } from "./AppContext";
import { toast } from "sonner@2.0.3";

interface Discussion {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    rank: string;
    location: string;
  };
  category: "General" | "Teachings" | "Events" | "Support";
  timestamp: string;
  replies: number;
  likes: number;
  views: number;
  isPinned?: boolean;
  tags: string[];
  lastReply?: {
    author: string;
    timestamp: string;
  };
}

interface Teaching {
  id: string;
  title: string;
  content: string;
  quote: string;
  author: {
    name: string;
    avatar: string;
    rank: string;
  };
  category: "Leadership" | "Values" | "History" | "Inspiration";
  timestamp: string;
  likes: number;
  saves: number;
  image?: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: {
    name: string;
    avatar: string;
  };
  attendees: number;
  maxAttendees: number;
  category: "Seva" | "Cultural" | "Educational" | "Social";
  image?: string;
  isJoined?: boolean;
}

const mockDiscussions: Discussion[] = [
  {
    id: "disc-1",
    title: "How can we organize more effective seva drives in our local communities?",
    content: "I've been thinking about ways to make our seva activities more impactful and reach more people in need. What strategies have worked well in your areas?",
    author: {
      name: "Vikrant Jadhav",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rank: "shiledar",
      location: "Nashik, Maharashtra"
    },
    category: "General",
    timestamp: "2 hours ago",
    replies: 23,
    likes: 45,
    views: 156,
    isPinned: true,
    tags: ["seva", "community", "organization"],
    lastReply: {
      author: "Priya Shinde",
      timestamp: "30 min ago"
    }
  },
  {
    id: "disc-2",
    title: "Understanding Maharaj's philosophy on Swarajya in modern context",
    content: "How do we apply Chhatrapati Shivaji Maharaj's principles of self-governance and independence in today's world?",
    author: {
      name: "Dr. Rajesh Kulkarni",
      avatar: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=100&h=100&fit=crop&crop=face",
      rank: "sardar",
      location: "Pune, Maharashtra"
    },
    category: "Teachings",
    timestamp: "5 hours ago",
    replies: 18,
    likes: 67,
    views: 234,
    tags: ["swarajya", "philosophy", "maharaj"],
    lastReply: {
      author: "Sneha Desai",
      timestamp: "1 hour ago"
    }
  },
  {
    id: "disc-3",
    title: "Best practices for organizing community kitchens during festivals",
    content: "As we approach the festival season, I'd love to hear from experienced organizers about running efficient community kitchens that serve the maximum number of people.",
    author: {
      name: "Anita Patil",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      rank: "mavla",
      location: "Kolhapur, Maharashtra"
    },
    category: "Events",
    timestamp: "1 day ago",
    replies: 12,
    likes: 28,
    views: 89,
    tags: ["festivals", "community-kitchen", "organization"]
  }
];

const mockTeachings: Teaching[] = [
  {
    id: "teach-1",
    title: "The Essence of True Leadership",
    content: "Chhatrapati Shivaji Maharaj demonstrated that true leadership comes from serving your people first. A leader's strength is measured not by how many follow them, but by how many they uplift and empower. In today's world, this principle guides us to be servant leaders in our communities.",
    quote: "राजा प्रजाहित चिंतक असावा, ना की प्रजा राजाहित चिंतक असावी",
    author: {
      name: "Pandit Gajanan Shastri",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rank: "chhatrapati_senapati"
    },
    category: "Leadership",
    timestamp: "1 day ago",
    likes: 234,
    saves: 89,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&h=400"
  },
  {
    id: "teach-2",
    title: "Dharma in Daily Actions",
    content: "Every act of seva, no matter how small, contributes to the greater dharmic order. When we help others, we fulfill our duty towards society and move closer to the ideal of Swarajya. Each small action creates ripples that can transform communities.",
    quote: "धर्मो रक्षति रक्षितः",
    author: {
      name: "Mata Jijabai Scholarly Circle",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
      rank: "sardar"
    },
    category: "Values",
    timestamp: "2 days ago",
    likes: 156,
    saves: 67
  },
  {
    id: "teach-3",
    title: "Unity in Diversity: Maharaj's Vision",
    content: "Shivaji Maharaj's court welcomed people from all backgrounds - Hindu, Muslim, from different regions and castes. His vision of Swarajya was inclusive, where merit and devotion to the motherland mattered more than birth or religion.",
    quote: "सर्वांना समान न्याय, सर्वांना समान आदर",
    author: {
      name: "Prof. Vishwas Patil",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rank: "sardar"
    },
    category: "History",
    timestamp: "3 days ago",
    likes: 189,
    saves: 92
  }
];

const mockEvents: Event[] = [
  {
    id: "event-1",
    title: "Community Food Distribution Drive",
    description: "Join us for a large-scale food distribution event to help families in flood-affected areas of Kolhapur district. We aim to serve 500+ families.",
    date: "2024-08-30",
    time: "09:00 AM",
    location: "Kolhapur, Maharashtra",
    organizer: {
      name: "Maharashtra Seva Sangh",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    attendees: 67,
    maxAttendees: 100,
    category: "Seva",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&h=400",
    isJoined: true
  },
  {
    id: "event-2",
    title: "Shivaji Maharaj History Seminar",
    description: "Learn about the strategic brilliance and administrative reforms of Chhatrapati Shivaji Maharaj from renowned historians and scholars.",
    date: "2024-09-02",
    time: "02:00 PM",
    location: "Pune, Maharashtra",
    organizer: {
      name: "Maratha History Society",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    attendees: 23,
    maxAttendees: 50,
    category: "Educational",
    isJoined: false
  },
  {
    id: "event-3",
    title: "Traditional Arts Workshop",
    description: "Learn traditional Maharashtrian arts including Warli painting, folk dance, and music. Perfect for preserving our cultural heritage.",
    date: "2024-09-05",
    time: "10:00 AM",
    location: "Mumbai, Maharashtra",
    organizer: {
      name: "Cultural Heritage Foundation",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
    },
    attendees: 15,
    maxAttendees: 30,
    category: "Cultural",
    isJoined: false
  }
];

export default function Community() {
  const { isDesktop, isMobile } = useScreenSize();
  const { state } = useApp();
  const { currentUser } = state;
  
  const [activeTab, setActiveTab] = useState("discussions");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: "",
    category: "",
    tags: ""
  });

  const [likedTeachings, setLikedTeachings] = useState<string[]>([]);
  const [savedTeachings, setSavedTeachings] = useState<string[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<string[]>(["event-1"]);

  // Metropolis font family constant
  const METROPOLIS_FONT = "'Metropolis', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif";

  const handleCreateDiscussion = () => {
    if (!newDiscussion.title.trim() || !newDiscussion.content.trim() || !newDiscussion.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Discussion created successfully! 🎉");
    setNewDiscussion({ title: "", content: "", category: "", tags: "" });
    setShowCreateDialog(false);
  };

  const handleLikeTeaching = (id: string) => {
    setLikedTeachings(prev => 
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
    toast.success(likedTeachings.includes(id) ? "Like removed" : "Teaching liked! ❤️");
  };

  const handleSaveTeaching = (id: string) => {
    setSavedTeachings(prev => 
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
    toast.success(savedTeachings.includes(id) ? "Removed from saved" : "Teaching saved! 📖");
  };

  const handleJoinEvent = (id: string) => {
    setJoinedEvents(prev => 
      prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
    );
    toast.success(joinedEvents.includes(id) ? "Left event" : "Event joined! 🎉");
  };

  const CreateDiscussionDialog = () => (
    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
      <DialogTrigger asChild>
        <Button 
          className={`
            bg-saffron-gradient hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200
            ${isMobile ? 'h-10 px-4 text-sm' : 'h-12 px-6'}
          `}
          style={{
            fontFamily: METROPOLIS_FONT,
            fontWeight: '500',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <Plus className={`${isMobile ? 'w-4 h-4' : 'w-4 h-4'} mr-2`} />
          {isMobile ? "New" : "New Discussion"}
        </Button>
      </DialogTrigger>
      <DialogContent 
        className={`${isMobile ? 'max-w-[95vw] max-h-[85vh] mx-2' : 'max-w-2xl'} overflow-y-auto`}
        style={{ borderRadius: 'var(--radius-xl)' }}
      >
        <DialogHeader className="space-y-3">
          <DialogTitle 
            style={{
              fontFamily: METROPOLIS_FONT,
              fontSize: isMobile ? '18px' : '20px',
              fontWeight: '600',
              lineHeight: '1.4'
            }}
          >
            Start a New Discussion
          </DialogTitle>
          <DialogDescription 
            style={{
              fontFamily: METROPOLIS_FONT,
              fontSize: '16px',
              fontWeight: '400',
              lineHeight: '1.6',
              color: 'var(--muted-foreground)'
            }}
          >
            Create a new discussion topic to engage with the community and share your thoughts on seva, teachings, or community events.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 mt-6">
          <div>
            <label 
              className="block mb-3"
              style={{
                fontFamily: METROPOLIS_FONT,
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--foreground)'
              }}
            >
              Title *
            </label>
            <Input
              placeholder="What would you like to discuss?"
              value={newDiscussion.title}
              onChange={(e) => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
              className={`input-modern ${isMobile ? "h-12 text-base" : "h-12"}`}
              style={{
                fontFamily: METROPOLIS_FONT,
                fontSize: '16px',
                fontWeight: '400'
              }}
            />
          </div>
          
          <div>
            <label 
              className="block mb-3"
              style={{
                fontFamily: METROPOLIS_FONT,
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--foreground)'
              }}
            >
              Category *
            </label>
            <Select 
              value={newDiscussion.category} 
              onValueChange={(value) => setNewDiscussion(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger 
                className={`input-modern ${isMobile ? "h-12" : "h-12"}`}
                style={{
                  fontFamily: METROPOLIS_FONT,
                  fontSize: '16px',
                  fontWeight: '400'
                }}
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent style={{ borderRadius: 'var(--radius-lg)' }}>
                <SelectItem value="General">General Discussion</SelectItem>
                <SelectItem value="Teachings">Maharaj's Teachings</SelectItem>
                <SelectItem value="Events">Community Events</SelectItem>
                <SelectItem value="Support">Help & Support</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label 
              className="block mb-3"
              style={{
                fontFamily: METROPOLIS_FONT,
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--foreground)'
              }}
            >
              Description *
            </label>
            <Textarea
              placeholder="Share your thoughts and questions..."
              value={newDiscussion.content}
              onChange={(e) => setNewDiscussion(prev => ({ ...prev, content: e.target.value }))}
              className={`input-modern min-h-[120px] ${isMobile ? 'text-base' : ''}`}
              style={{
                fontFamily: METROPOLIS_FONT,
                fontSize: '16px',
                fontWeight: '400'
              }}
            />
          </div>

          <div>
            <label 
              className="block mb-3"
              style={{
                fontFamily: METROPOLIS_FONT,
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--foreground)'
              }}
            >
              Tags (Optional)
            </label>
            <Input
              placeholder="Add tags separated by commas"
              value={newDiscussion.tags}
              onChange={(e) => setNewDiscussion(prev => ({ ...prev, tags: e.target.value }))}
              className={`input-modern ${isMobile ? "h-12 text-base" : "h-12"}`}
              style={{
                fontFamily: METROPOLIS_FONT,
                fontSize: '16px',
                fontWeight: '400'
              }}
            />
          </div>

          <div className={`flex gap-3 pt-4 ${isMobile ? 'flex-col' : ''}`}>
            <Button 
              variant="outline" 
              className={`${isMobile ? 'w-full h-12' : 'flex-1 h-12'} btn-secondary-modern`}
              onClick={() => setShowCreateDialog(false)}
              style={{
                fontFamily: METROPOLIS_FONT,
                fontWeight: '500'
              }}
            >
              Cancel
            </Button>
            <Button 
              className={`${isMobile ? 'w-full h-12' : 'flex-1 h-12'} btn-primary-modern`}
              onClick={handleCreateDiscussion}
              style={{
                fontFamily: METROPOLIS_FONT,
                fontWeight: '500'
              }}
            >
              Create Discussion
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className={`bg-gray-50 min-h-screen ${isMobile ? 'pb-20' : ''}`}>
      {/* Add Metropolis Font Import */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Metropolis:wght@300;400;500;600;700;800;900&display=swap');
        `}
      </style>

      {/* Header */}
      <div className={`bg-white border-b border-gray-200 ${isMobile ? 'sticky top-0 z-40' : ''}`}>
        <div className={`px-4 py-6 ${isMobile ? 'pb-4' : 'lg:px-6'}`}>
          <div className={`flex items-center justify-between ${isMobile ? 'mb-4' : 'mb-6'}`}>
            <div>
              <h1 
                className={`text-gray-900 ${isMobile ? 'text-lg' : 'text-2xl'} mb-2`}
                style={{
                  fontFamily: METROPOLIS_FONT,
                  fontSize: isMobile ? '18px' : '24px',
                  fontWeight: '600',
                  lineHeight: '1.3'
                }}
              >
                🏛️ Community
              </h1>
              <p 
                className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}
                style={{
                  fontFamily: METROPOLIS_FONT,
                  fontSize: isMobile ? '12px' : '14px',
                  fontWeight: '400',
                  lineHeight: '1.5'
                }}
              >
                Connect, Learn, and Grow Together in the Spirit of Swarajya
              </p>
            </div>
            <CreateDiscussionDialog />
          </div>

          {/* Search */}
          <div className={`flex gap-3 items-center ${isMobile ? 'mb-0' : 'mb-0'}`}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder={isMobile ? "Search..." : "Search discussions, teachings, events..."} 
                className={`pl-10 input-modern ${isMobile ? 'h-10 text-base' : 'h-12'}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  fontFamily: METROPOLIS_FONT,
                  fontSize: '16px',
                  fontWeight: '400'
                }}
              />
            </div>
            {!isMobile && (
              <Button 
                variant="outline" 
                className="btn-secondary-modern h-12"
                style={{
                  fontFamily: METROPOLIS_FONT,
                  fontWeight: '500'
                }}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${isMobile ? 'px-4 py-4' : 'flex gap-8 px-6 py-6'}`}>
        <div className={`${isMobile ? 'w-full' : 'flex-1 max-w-4xl'}`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tab Navigation */}
            <TabsList 
              className={`grid w-full grid-cols-3 ${isMobile ? 'h-12 mb-4' : 'h-14 mb-6'}`}
              style={{
                backgroundColor: 'var(--muted)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-1)'
              }}
            >
              <TabsTrigger 
                value="discussions" 
                className={`flex items-center gap-2 ${isMobile ? 'text-xs px-2' : 'text-sm px-4'} transition-all duration-200`}
                style={{
                  fontFamily: METROPOLIS_FONT,
                  fontWeight: '500',
                  borderRadius: 'var(--radius-md)',
                  fontSize: isMobile ? '12px' : '14px'
                }}
              >
                <MessageCircle className={isMobile ? "w-3 h-3" : "w-4 h-4"} />
                <span className={isMobile ? "hidden sm:inline" : ""}>Discussions</span>
              </TabsTrigger>
              <TabsTrigger 
                value="teachings" 
                className={`flex items-center gap-2 ${isMobile ? 'text-xs px-2' : 'text-sm px-4'} transition-all duration-200`}
                style={{
                  fontFamily: METROPOLIS_FONT,
                  fontWeight: '500',
                  borderRadius: 'var(--radius-md)',
                  fontSize: isMobile ? '12px' : '14px'
                }}
              >
                <BookOpen className={isMobile ? "w-3 h-3" : "w-4 h-4"} />
                <span className={isMobile ? "hidden sm:inline" : ""}>Teachings</span>
              </TabsTrigger>
              <TabsTrigger 
                value="events" 
                className={`flex items-center gap-2 ${isMobile ? 'text-xs px-2' : 'text-sm px-4'} transition-all duration-200`}
                style={{
                  fontFamily: METROPOLIS_FONT,
                  fontWeight: '500',
                  borderRadius: 'var(--radius-md)',
                  fontSize: isMobile ? '12px' : '14px'
                }}
              >
                <Calendar className={isMobile ? "w-3 h-3" : "w-4 h-4"} />
                <span className={isMobile ? "hidden sm:inline" : ""}>Events</span>
              </TabsTrigger>
            </TabsList>

            {/* Discussions Tab */}
            <TabsContent value="discussions" className={`space-y-4 mt-0 ${isMobile ? '' : 'mt-6'}`}>
              {mockDiscussions.map((discussion) => (
                <Card 
                  key={discussion.id} 
                  className={`
                    card-modern ${isMobile ? 'p-4' : 'p-6'} 
                    hover:shadow-md transition-all duration-200 cursor-pointer
                  `}
                >
                  <div className={`flex items-start gap-4 ${isMobile ? 'gap-3' : 'gap-4'}`}>
                    <ImageWithFallback
                      src={discussion.author.avatar}
                      alt={discussion.author.name}
                      className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full object-cover`}
                      style={{ borderRadius: 'var(--radius-2xl)' }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className={`flex items-start justify-between ${isMobile ? 'mb-2' : 'mb-3'}`}>
                        <div className="flex-1 min-w-0">
                          <div className={`flex items-center gap-2 ${isMobile ? 'mb-1' : 'mb-2'}`}>
                            {discussion.isPinned && (
                              <Pin 
                                className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`}
                                style={{ color: 'var(--saffron)' }} 
                              />
                            )}
                            <h3 
                              className={`font-medium hover:text-[--saffron] cursor-pointer line-clamp-2 ${isMobile ? 'text-sm leading-tight' : ''}`}
                              style={{
                                fontFamily: METROPOLIS_FONT,
                                fontSize: isMobile ? '14px' : '16px',
                                fontWeight: '500',
                                lineHeight: isMobile ? '1.4' : '1.5',
                                color: 'var(--foreground)'
                              }}
                            >
                              {discussion.title}
                            </h3>
                          </div>
                          <div 
                            className={`flex items-center gap-2 text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'} mb-2`}
                            style={{
                              fontFamily: METROPOLIS_FONT,
                              fontSize: isMobile ? '12px' : '14px',
                              fontWeight: '400'
                            }}
                          >
                            <span className="truncate">{discussion.author.name}</span>
                            <RankBadge rank={discussion.author.rank as any} size="sm" showLabel={false} />
                            <span>•</span>
                            <span className="whitespace-nowrap">{discussion.timestamp}</span>
                          </div>
                        </div>
                        {!isMobile && <MoreVertical className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />}
                      </div>

                      <p 
                        className={`text-gray-700 leading-relaxed line-clamp-2 ${isMobile ? 'text-sm mb-3' : 'mb-4'}`}
                        style={{
                          fontFamily: METROPOLIS_FONT,
                          fontSize: isMobile ? '14px' : '16px',
                          fontWeight: '400',
                          lineHeight: '1.6'
                        }}
                      >
                        {discussion.content}
                      </p>

                      <div className={`flex items-center gap-2 flex-wrap ${isMobile ? 'mb-3' : 'mb-4'}`}>
                        <Badge 
                          variant="secondary" 
                          className={isMobile ? "text-xs" : "text-xs"}
                          style={{
                            backgroundColor: 'var(--saffron-bg)',
                            color: 'var(--saffron)',
                            borderRadius: 'var(--radius-md)',
                            fontFamily: METROPOLIS_FONT,
                            fontWeight: '500'
                          }}
                        >
                          {discussion.category}
                        </Badge>
                        {discussion.tags.slice(0, isMobile ? 2 : 3).map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className={`${isMobile ? 'text-xs' : 'text-xs'}`}
                            style={{ 
                              borderRadius: 'var(--radius-md)',
                              fontFamily: METROPOLIS_FONT,
                              fontWeight: '400'
                            }}
                          >
                            #{tag}
                          </Badge>
                        ))}
                        {discussion.tags.length > (isMobile ? 2 : 3) && (
                          <span 
                            className="text-xs text-gray-500"
                            style={{
                              fontFamily: METROPOLIS_FONT,
                              fontSize: '12px'
                            }}
                          >
                            +{discussion.tags.length - (isMobile ? 2 : 3)}
                          </span>
                        )}
                      </div>

                      <div className={`flex items-center justify-between ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        <div 
                          className={`flex items-center gap-4 text-gray-600 ${isMobile ? 'gap-3' : 'gap-6'}`}
                          style={{
                            fontFamily: METROPOLIS_FONT,
                            fontSize: isMobile ? '12px' : '14px',
                            fontWeight: '400'
                          }}
                        >
                          <span className="flex items-center gap-1">
                            <MessageCircle className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                            {discussion.replies}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                            {discussion.likes}
                          </span>
                          {!isMobile && (
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {discussion.views}
                            </span>
                          )}
                        </div>
                        {discussion.lastReply && !isMobile && (
                          <div 
                            className="text-xs text-gray-500 text-right"
                            style={{
                              fontFamily: METROPOLIS_FONT,
                              fontSize: '12px'
                            }}
                          >
                            Last reply by {discussion.lastReply.author} • {discussion.lastReply.timestamp}
                          </div>
                        )}
                        {isMobile && (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            {/* Teachings Tab */}
            <TabsContent value="teachings" className={`space-y-4 mt-0 ${isMobile ? '' : 'mt-6'}`}>
              {mockTeachings.map((teaching) => (
                <Card 
                  key={teaching.id} 
                  className={`card-modern ${isMobile ? 'p-4' : 'p-6'} hover:shadow-md transition-all duration-200`}
                >
                  {teaching.image && (
                    <div className={`${isMobile ? 'mb-4' : 'mb-6'} rounded-lg overflow-hidden`}>
                      <ImageWithFallback
                        src={teaching.image}
                        alt={teaching.title}
                        className={`w-full ${isMobile ? 'h-40' : 'h-56'} object-cover`}
                        style={{ borderRadius: 'var(--radius-lg)' }}
                      />
                    </div>
                  )}
                  
                  <div className={`flex items-start gap-4 ${isMobile ? 'gap-3' : 'gap-4'}`}>
                    <ImageWithFallback
                      src={teaching.author.avatar}
                      alt={teaching.author.name}
                      className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full object-cover`}
                      style={{ borderRadius: 'var(--radius-2xl)' }}
                    />
                    <div className="flex-1">
                      <div className={`flex items-center justify-between ${isMobile ? 'mb-2' : 'mb-3'}`}>
                        <div>
                          <h3 
                            className={`font-medium ${isMobile ? 'text-sm' : 'text-base'} mb-2`}
                            style={{
                              fontFamily: METROPOLIS_FONT,
                              fontSize: isMobile ? '14px' : '16px',
                              fontWeight: '600',
                              lineHeight: '1.4',
                              color: 'var(--foreground)'
                            }}
                          >
                            {teaching.title}
                          </h3>
                          <div 
                            className={`flex items-center gap-2 text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}
                            style={{
                              fontFamily: METROPOLIS_FONT,
                              fontSize: isMobile ? '12px' : '14px',
                              fontWeight: '400'
                            }}
                          >
                            <span className="truncate">{teaching.author.name}</span>
                            <RankBadge rank={teaching.author.rank as any} size="sm" showLabel={false} />
                            <span>•</span>
                            <span>{teaching.timestamp}</span>
                          </div>
                        </div>
                        <Badge 
                          className={`${isMobile ? 'text-xs' : 'text-xs'}`}
                          style={{
                            backgroundColor: 'var(--saffron-bg)',
                            color: 'var(--saffron)',
                            border: `1px solid var(--saffron)`,
                            borderRadius: 'var(--radius-md)',
                            fontFamily: METROPOLIS_FONT,
                            fontWeight: '500'
                          }}
                        >
                          {teaching.category}
                        </Badge>
                      </div>

                      <p 
                        className={`text-gray-700 leading-relaxed ${isMobile ? 'text-sm mb-4' : 'mb-5'}`}
                        style={{
                          fontFamily: METROPOLIS_FONT,
                          fontSize: isMobile ? '14px' : '16px',
                          fontWeight: '400',
                          lineHeight: '1.6'
                        }}
                      >
                        {teaching.content}
                      </p>

                      <div 
                        className={`border-l-4 rounded-r-lg ${isMobile ? 'p-3 mb-4' : 'p-4 mb-5'}`}
                        style={{
                          background: 'linear-gradient(135deg, var(--saffron-100) 0%, var(--saffron-200) 100%)',
                          borderLeftColor: 'var(--saffron)',
                          borderRadius: '0 var(--radius-lg) var(--radius-lg) 0'
                        }}
                      >
                        <p 
                          className={`font-medium italic ${isMobile ? 'text-sm' : 'text-base'}`}
                          style={{
                            fontFamily: METROPOLIS_FONT,
                            fontSize: isMobile ? '14px' : '16px',
                            fontWeight: '500',
                            color: 'var(--saffron)',
                            lineHeight: '1.5'
                          }}
                        >
                          "{teaching.quote}"
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className={`flex items-center gap-4 ${isMobile ? 'gap-3' : 'gap-4'}`}>
                          <button 
                            onClick={() => handleLikeTeaching(teaching.id)}
                            className={`
                              flex items-center gap-1 text-gray-600 hover:text-[--saffron] transition-colors 
                              ${isMobile ? 'text-xs' : 'text-sm'}
                            `}
                            style={{
                              fontFamily: METROPOLIS_FONT,
                              fontSize: isMobile ? '12px' : '14px',
                              fontWeight: '400'
                            }}
                          >
                            <Heart 
                              className={`
                                ${isMobile ? 'w-4 h-4' : 'w-4 h-4'} 
                                ${likedTeachings.includes(teaching.id) ? 'fill-[--saffron] text-[--saffron]' : ''}
                              `} 
                            />
                            {teaching.likes + (likedTeachings.includes(teaching.id) ? 1 : 0)}
                          </button>
                          <button 
                            onClick={() => handleSaveTeaching(teaching.id)}
                            className={`
                              flex items-center gap-1 text-gray-600 hover:text-[--saffron] transition-colors 
                              ${isMobile ? 'text-xs' : 'text-sm'}
                            `}
                            style={{
                              fontFamily: METROPOLIS_FONT,
                              fontSize: isMobile ? '12px' : '14px',
                              fontWeight: '400'
                            }}
                          >
                            <Bookmark 
                              className={`
                                ${isMobile ? 'w-4 h-4' : 'w-4 h-4'} 
                                ${savedTeachings.includes(teaching.id) ? 'fill-[--saffron] text-[--saffron]' : ''}
                              `} 
                            />
                            {teaching.saves + (savedTeachings.includes(teaching.id) ? 1 : 0)}
                          </button>
                        </div>
                        <Button 
                          variant="ghost" 
                          size={isMobile ? "sm" : "sm"} 
                          className={`hover:bg-saffron-100 hover:text-saffron ${isMobile ? "text-xs px-3" : "px-4"}`}
                          style={{
                            fontFamily: METROPOLIS_FONT,
                            fontWeight: '500'
                          }}
                        >
                          <Share2 className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} mr-1`} />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className={`mt-0 ${isMobile ? '' : 'mt-6'}`}>
              <div className={`${isMobile ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-2 gap-6'}`}>
                {mockEvents.map((event) => (
                  <Card 
                    key={event.id} 
                    className={`card-modern ${isMobile ? 'p-4' : 'p-5'} hover:shadow-md transition-all duration-200`}
                  >
                    {event.image && (
                      <div className={`${isMobile ? 'mb-4' : 'mb-5'} rounded-lg overflow-hidden`}>
                        <ImageWithFallback
                          src={event.image}
                          alt={event.title}
                          className={`w-full ${isMobile ? 'h-36' : 'h-44'} object-cover`}
                          style={{ borderRadius: 'var(--radius-lg)' }}
                        />
                      </div>
                    )}

                    <div className={isMobile ? 'space-y-3' : 'space-y-4'}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 
                            className={`font-medium ${isMobile ? 'text-sm line-clamp-2' : 'text-base'} mb-2`}
                            style={{
                              fontFamily: METROPOLIS_FONT,
                              fontSize: isMobile ? '14px' : '16px',
                              fontWeight: '600',
                              lineHeight: '1.4',
                              color: 'var(--foreground)'
                            }}
                          >
                            {event.title}
                          </h3>
                          <Badge 
                            variant="secondary" 
                            className={isMobile ? "text-xs" : "text-xs"}
                            style={{
                              backgroundColor: 'var(--saffron-bg)',
                              color: 'var(--saffron)',
                              borderRadius: 'var(--radius-md)',
                              fontFamily: METROPOLIS_FONT,
                              fontWeight: '500'
                            }}
                          >
                            {event.category}
                          </Badge>
                        </div>
                      </div>

                      <p 
                        className={`text-gray-700 leading-relaxed line-clamp-2 ${isMobile ? 'text-xs' : 'text-sm'}`}
                        style={{
                          fontFamily: METROPOLIS_FONT,
                          fontSize: isMobile ? '12px' : '14px',
                          fontWeight: '400',
                          lineHeight: '1.6'
                        }}
                      >
                        {event.description}
                      </p>

                      <div 
                        className={`space-y-2 text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}
                        style={{
                          fontFamily: METROPOLIS_FONT,
                          fontSize: isMobile ? '12px' : '14px',
                          fontWeight: '400'
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                          <span>{event.date} at {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                          <span>{event.attendees}/{event.maxAttendees} attending</span>
                        </div>
                      </div>

                      <div 
                        className={`flex items-center justify-between pt-3 border-t ${isMobile ? 'pt-3' : 'pt-4'}`}
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <div className="flex items-center gap-2">
                          <ImageWithFallback
                            src={event.organizer.avatar}
                            alt={event.organizer.name}
                            className={`${isMobile ? 'w-6 h-6' : 'w-7 h-7'} rounded-full object-cover`}
                            style={{ borderRadius: 'var(--radius-2xl)' }}
                          />
                          <span 
                            className={`text-gray-600 truncate ${isMobile ? 'text-xs' : 'text-sm'}`}
                            style={{
                              fontFamily: METROPOLIS_FONT,
                              fontSize: isMobile ? '12px' : '14px',
                              fontWeight: '400'
                            }}
                          >
                            {event.organizer.name}
                          </span>
                        </div>
                        <Button 
                          size={isMobile ? "sm" : "sm"}
                          variant={joinedEvents.includes(event.id) ? "outline" : "default"}
                          className={`
                            ${joinedEvents.includes(event.id) ? "btn-secondary-modern" : "btn-primary-modern"} 
                            ${isMobile ? 'text-xs px-3 h-8' : 'px-4 h-9'}
                          `}
                          onClick={() => handleJoinEvent(event.id)}
                          style={{
                            fontFamily: METROPOLIS_FONT,
                            fontWeight: '500'
                          }}
                        >
                          {joinedEvents.includes(event.id) ? "Joined" : "Join Event"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - Desktop Only */}
        {!isMobile && (
          <div className="w-80 space-y-6">
            {/* Community Stats */}
            <Card 
              className="card-modern p-6"
              style={{
                background: 'linear-gradient(135deg, var(--saffron-100) 0%, var(--saffron-200) 100%)'
              }}
            >
              <h3 
                className="text-lg mb-4"
                style={{
                  fontFamily: METROPOLIS_FONT,
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--saffron)'
                }}
              >
                🏛️ Community Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span 
                    className="text-sm text-gray-700"
                    style={{
                      fontFamily: METROPOLIS_FONT,
                      fontSize: '14px',
                      fontWeight: '400'
                    }}
                  >
                    Active Discussions
                  </span>
                  <span 
                    className="font-semibold"
                    style={{
                      fontFamily: METROPOLIS_FONT,
                      fontWeight: '600',
                      color: 'var(--saffron)'
                    }}
                  >
                    1,247
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span 
                    className="text-sm text-gray-700"
                    style={{
                      fontFamily: METROPOLIS_FONT,
                      fontSize: '14px',
                      fontWeight: '400'
                    }}
                  >
                    Teachings Shared
                  </span>
                  <span 
                    className="font-semibold"
                    style={{
                      fontFamily: METROPOLIS_FONT,
                      fontWeight: '600',
                      color: 'var(--saffron)'
                    }}
                  >
                    892
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span 
                    className="text-sm text-gray-700"
                    style={{
                      fontFamily: METROPOLIS_FONT,
                      fontSize: '14px',
                      fontWeight: '400'
                    }}
                  >
                    Upcoming Events
                  </span>
                  <span 
                    className="font-semibold"
                    style={{
                      fontFamily: METROPOLIS_FONT,
                      fontWeight: '600',
                      color: 'var(--saffron)'
                    }}
                  >
                    23
                  </span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="card-modern p-6">
              <h3 
                className="text-lg mb-4"
                style={{
                  fontFamily: METROPOLIS_FONT,
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--foreground)'
                }}
              >
                ⚡ Quick Actions
              </h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full btn-secondary-modern justify-start"
                  style={{
                    fontFamily: METROPOLIS_FONT,
                    fontWeight: '500'
                  }}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse All Teachings
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full btn-secondary-modern justify-start"
                  style={{
                    fontFamily: METROPOLIS_FONT,
                    fontWeight: '500'
                  }}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  View Event Calendar
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full btn-secondary-modern justify-start"
                  style={{
                    fontFamily: METROPOLIS_FONT,
                    fontWeight: '500'
                  }}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Find Local Groups
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}