import { useState } from "react";
import { MapPin, Clock, User, ArrowRight, CheckCircle, Search, SlidersHorizontal, Plus, Heart, AlertTriangle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useScreenSize } from "./ui/use-screen-size";
import { useApp, HelpRequest } from "./AppContext";
import { toast } from "sonner";

const categories = ["Food", "Education", "Health", "Shelter", "Other"] as const;
const urgencyLevels = ["Low", "Medium", "High", "Emergency"] as const;

// Metropolis font family constant
const METROPOLIS_FONT = "'Metropolis', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif";

const categoryColors = {
  Food: "bg-green-100 text-green-800 border-green-300",
  Education: "bg-blue-100 text-blue-800 border-blue-300",
  Health: "bg-red-100 text-red-800 border-red-300",
  Shelter: "bg-purple-100 text-purple-800 border-purple-300",
  Other: "bg-gray-100 text-gray-800 border-gray-300"
}

const urgencyColors = {
  Low: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-orange-100 text-orange-800",
  Emergency: "bg-red-100 text-red-800"
};

interface NewRequestForm {
  title: string;
  description: string;
  category: typeof categories[number] | "";
  urgency: typeof urgencyLevels[number] | "";
  location: string;
  peopleNeeded: string;
  deadline: string;
  contactInfo: string;
}

export default function HelpRequests() {
  const { isDesktop, isMobile } = useScreenSize();
  const { state, addHelpRequest, joinHelpRequest } = useApp();
  const { helpRequests, currentUser } = state;
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newRequest, setNewRequest] = useState<NewRequestForm>({
    title: "",
    description: "",
    category: "",
    urgency: "",
    location: "",
    peopleNeeded: "",
    deadline: "",
    contactInfo: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter requests
  const filteredRequests = helpRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesCategory = false;
    
    if (selectedCategory === "All") {
      matchesCategory = true;
    } else if (selectedCategory === "Emergency") {
      matchesCategory = request.urgency === "Emergency";
    } else if (selectedCategory === "Nearby") {
      // Filter by location matching user's location
      matchesCategory = currentUser?.location && request.location.toLowerCase().includes(currentUser.location.toLowerCase());
    } else {
      matchesCategory = request.category === selectedCategory;
    }
    
    return matchesSearch && matchesCategory;
  });

  const emergencyRequests = filteredRequests.filter(req => req.urgency === "Emergency");
  const otherRequests = filteredRequests.filter(req => req.urgency !== "Emergency");

  const handleJoinRequest = (requestId: string) => {
    const request = helpRequests.find(r => r.id === requestId);
    if (request && !request.helpersJoined.includes(currentUser.id)) {
      joinHelpRequest(requestId);
      toast.success("Successfully joined the help request! 🙏", {
        description: "The requester will be notified of your participation."
      });
    } else {
      toast.info("You have already joined this request");
    }
  };

  const handleCreateRequest = async () => {
    if (!newRequest.title.trim() || !newRequest.description.trim() || !newRequest.category || 
        !newRequest.urgency || !newRequest.location.trim() || !newRequest.peopleNeeded) {
      toast.error("Please fill in all fields");
      return;
    }

    if (parseInt(newRequest.peopleNeeded) < 1) {
      toast.error("Please enter a valid number of people needed");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      addHelpRequest({
        title: newRequest.title,
        description: newRequest.description,
        category: newRequest.category as any,
        urgency: newRequest.urgency as any,
        location: newRequest.location,
        requesterId: currentUser.id,
        requester: {
          name: currentUser.name,
          avatar: currentUser.avatar,
          verified: true
        },
        peopleNeeded: parseInt(newRequest.peopleNeeded)
      });

      setNewRequest({
        title: "",
        description: "",
        category: "",
        urgency: "",
        location: "",
        peopleNeeded: ""
      });
      setShowCreateDialog(false);

      toast.success("Help request created successfully! 🎉", {
        description: "Your request is now visible to the community."
      });

    } catch (error) {
      toast.error("Failed to create help request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCreateRequestDialog = () => (
    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
      <DialogTrigger asChild>
        <Button 
          className={`
            bg-#FFF3E0:shadow-lg hover:-translate-y-0.5 transition-all duration-200
            ${isMobile ? 'h-11 px-4 text-sm' : 'h-12 px-6'}
          `}
          style={{
            fontFamily: METROPOLIS_FONT,
            fontWeight: '500',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <Plus className={`${isMobile ? 'w-4 h-4' : 'w-4 h-4'} mr-2`} />
          {isMobile ? "Create" : "Create Request"}
        </Button>
      </DialogTrigger>
      <DialogContent 
        className={`${isMobile ? 'max-w-[95vw] max-h-[90vh] mx-2' : 'max-w-2xl'} overflow-y-auto`}
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
            Create Help Request
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
            Fill out the form below to create a new help request for your community. Be specific about what help you need.
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
              placeholder="Brief title for your request"
              value={newRequest.title}
              onChange={(e) => setNewRequest(prev => ({ ...prev, title: e.target.value }))}
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
              Description *
            </label>
            <Textarea
              placeholder="Describe what help you need in detail..."
              value={newRequest.description}
              onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
              className={`input-modern min-h-[120px] ${isMobile ? 'text-base' : ''}`}
              style={{
                fontFamily: METROPOLIS_FONT,
                fontSize: '16px',
                fontWeight: '400'
              }}
            />
          </div>

          <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-2 gap-4'}`}>
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
                value={newRequest.category} 
                onValueChange={(value: any) => setNewRequest(prev => ({ ...prev, category: value }))}
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
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
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
                Urgency *
              </label>
              <Select 
                value={newRequest.urgency} 
                onValueChange={(value: any) => setNewRequest(prev => ({ ...prev, urgency: value }))}
              >
                <SelectTrigger 
                  className={`input-modern ${isMobile ? "h-12" : "h-12"}`}
                  style={{
                    fontFamily: METROPOLIS_FONT,
                    fontSize: '16px',
                    fontWeight: '400'
                  }}
                >
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent style={{ borderRadius: 'var(--radius-lg)' }}>
                  {urgencyLevels.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
              Location *
            </label>
            <Input
              placeholder="Where is help needed?"
              value={newRequest.location}
              onChange={(e) => setNewRequest(prev => ({ ...prev, location: e.target.value }))}
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
              People Needed *
            </label>
            <Input
              type="number"
              min="1"
              placeholder="How many helpers needed?"
              value={newRequest.peopleNeeded}
              onChange={(e) => setNewRequest(prev => ({ ...prev, peopleNeeded: e.target.value }))}
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
              onClick={handleCreateRequest}
              disabled={isSubmitting}
              style={{
                fontFamily: METROPOLIS_FONT,
                fontWeight: '500'
              }}
            >
              {isSubmitting ? "Creating..." : "Create Request"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className={`${isMobile ? 'pb-20' : ''} bg-gray-50 min-h-screen`}>
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
                <span className="inline-flex items-center">
                  <AlertTriangle className="inline-block mr-2 w-5 h-5 text-saffron-600" aria-label="Help Requests" />
                  Help Requests
                </span>
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
                Verified Seva Opportunities from Your Community
              </p>
            </div>
            <div className="text-right">
              <p 
                className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}
                style={{
                  fontFamily: METROPOLIS_FONT,
                  fontSize: isMobile ? '12px' : '14px',
                  fontWeight: '400'
                }}
              >
                Active Requests
              </p>
              <p 
                className={`${isMobile ? 'text-lg' : 'text-xl'}`}
                style={{
                  fontFamily: METROPOLIS_FONT,
                  fontSize: isMobile ? '18px' : '20px',
                  fontWeight: '600',
                  color: 'var(--saffron)'
                }}
              >
                {helpRequests.length}
              </p>
            </div>
          </div>

          {/* Search and Create Button */}
          <div className={`flex gap-3 items-center ${isMobile ? 'mb-0' : 'mb-0'}`}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder={isMobile ? "Search requests..." : "Search help requests..."} 
                className={`pl-10 input-modern ${isMobile ? 'h-11 text-base' : 'h-12'}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  fontFamily: METROPOLIS_FONT,
                  fontSize: '16px',
                  fontWeight: '400'
                }}
              />
            </div>
            {renderCreateRequestDialog()}
            {!isMobile && (
              <Button 
                className="btn-secondary-modern h-12"
                style={{
                  fontFamily: METROPOLIS_FONT,
                  fontWeight: '500'
                }}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className={`px-4 py-3 ${isMobile ? '' : 'lg:px-6'}`}>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {["All", "Emergency", "Food", "Education", "Health", "Shelter", "Nearby"].map((filter) => (
              <Button
                key={filter}
                size="sm"
                className={`
                  whitespace-nowrap flex-shrink-0 transition-all duration-200
                  ${selectedCategory === filter 
                    ? "btn-primary-modern text-white" 
                    : "btn-secondary-modern"
                  }
                  ${isMobile ? 'h-9 px-3 text-sm' : 'h-10 px-4'}
                `}
                onClick={() => setSelectedCategory(filter)}
                style={{
                  fontFamily: METROPOLIS_FONT,
                  fontWeight: '500',
                  fontSize: isMobile ? '14px' : '14px'
                }}
              >
                {filter === "Emergency" && selectedCategory === filter && "🚨 "}
                {filter}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={isDesktop ? "flex gap-8 px-6 py-6" : "px-4 py-4"}>
        {/* Help Requests */}
        <div className={isDesktop ? "flex-1 max-w-4xl" : "space-y-4"}>
          {/* Emergency Alerts */}
          {emergencyRequests.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <h2 
                  className="text-red-700"
                  style={{
                    fontFamily: METROPOLIS_FONT,
                    fontSize: isMobile ? '16px' : '18px',
                    fontWeight: '600',
                    lineHeight: '1.4'
                  }}
                >
                  🚨 Emergency Requests
                </h2>
                <Badge 
                  className="bg-red-100 text-red-800"
                  style={{
                    fontFamily: METROPOLIS_FONT,
                    fontWeight: '500'
                  }}
                >
                  {emergencyRequests.length}
                </Badge>
              </div>
              <div className={`${isDesktop ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : 'space-y-4'}`}>
                {emergencyRequests.map((request) => (
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    onJoin={handleJoinRequest}
                    currentUserId={currentUser.id}
                    isEmergency={true}
                    isMobile={isMobile}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Regular Requests */}
          <div>
            <h2 
              className="mb-4"
              style={{
                fontFamily: METROPOLIS_FONT,
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: '600',
                lineHeight: '1.4',
                color: 'var(--foreground)'
              }}
            >
              {selectedCategory === "All" ? "All Help Requests" : `${selectedCategory} Requests`}
            </h2>
            {otherRequests.length === 0 ? (
              <Card 
                className={`card-modern ${isMobile ? 'p-6' : 'p-8'} text-center`}
              >
                <div className="mb-4">
                  <Heart 
                    className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} mx-auto text-gray-300 mb-3`} 
                  />
                  <h3 
                    className="mb-2"
                    style={{
                      fontFamily: METROPOLIS_FONT,
                      fontSize: isMobile ? '16px' : '18px',
                      fontWeight: '600',
                      color: 'var(--foreground)'
                    }}
                  >
                    No help requests found
                  </h3>
                  <p 
                    className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-base'} mb-4`}
                    style={{
                      fontFamily: METROPOLIS_FONT,
                      fontSize: isMobile ? '14px' : '16px',
                      fontWeight: '400',
                      lineHeight: '1.6'
                    }}
                  >
                    {searchTerm ? "Try different keywords or create a new request." : "Be the first to create a help request and make a difference!"}
                  </p>
                </div>
                {renderCreateRequestDialog()}
              </Card>
            ) : (
              <div className={`${isDesktop ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : 'space-y-4'}`}>
                {otherRequests.map((request) => (
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    onJoin={handleJoinRequest}
                    currentUserId={currentUser.id}
                    isEmergency={false}
                    isMobile={isMobile}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Sidebar */}
        {isDesktop && (
          <div className="w-80 space-y-6">
            {/* Quick Actions */}
            <Card 
              className="card-modern p-6"
              style={{
                background: 'linear-gradient(135deg, var(--saffron-100) 0%, var(--saffron-200) 100%)'
              }}
            >
              <h3 
                className="mb-4"
                style={{
                  fontFamily: METROPOLIS_FONT,
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--saffron)'
                }}
              >
                ⚡ Quick Actions
              </h3>
              <div className="space-y-3">
                <Button 
                  className="w-full btn-secondary-modern justify-start"
                  style={{
                    fontFamily: METROPOLIS_FONT,
                    fontWeight: '500'
                  }}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Find Nearby Requests
                </Button>
                <Button 
                  className="w-full btn-secondary-modern justify-start"
                  style={{
                    fontFamily: METROPOLIS_FONT,
                    fontWeight: '500'
                  }}
                >
                  <User className="w-4 h-4 mr-2" />
                  My Joined Requests
                </Button>
                <Button 
                  className="w-full btn-secondary-modern justify-start"
                  style={{
                    fontFamily: METROPOLIS_FONT,
                    fontWeight: '500'
                  }}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Emergency Alerts
                </Button>
              </div>
            </Card>

            {/* Stats */}
            <Card className="card-modern p-6">
              <h3 
                className="mb-4"
                style={{
                  fontFamily: METROPOLIS_FONT,
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--foreground)'
                }}
              >
                📊 This Week's Impact
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span 
                    className="text-gray-600"
                    style={{
                      fontFamily: METROPOLIS_FONT,
                      fontSize: '14px',
                      fontWeight: '400'
                    }}
                  >
                    Total Requests
                  </span>
                  <span 
                    className="font-semibold"
                    style={{
                      fontFamily: METROPOLIS_FONT,
                      fontWeight: '600',
                      color: 'var(--saffron)'
                    }}
                  >
                    {helpRequests.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span 
                    className="text-gray-600"
                    style={{
                      fontFamily: METROPOLIS_FONT,
                      fontSize: '14px',
                      fontWeight: '400'
                    }}
                  >
                    Emergency Requests
                  </span>
                  <span 
                    className="font-semibold text-red-600"
                    style={{
                      fontFamily: METROPOLIS_FONT,
                      fontWeight: '600'
                    }}
                  >
                    {helpRequests.filter(r => r.urgency === "Emergency").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span 
                    className="text-gray-600"
                    style={{
                      fontFamily: METROPOLIS_FONT,
                      fontSize: '14px',
                      fontWeight: '400'
                    }}
                  >
                    My Contributions
                  </span>
                  <span 
                    className="font-semibold"
                    style={{
                      fontFamily: METROPOLIS_FONT,
                      fontWeight: '600',
                      color: 'var(--saffron)'
                    }}
                  >
                    {helpRequests.filter(r => r.helpersJoined.includes(currentUser.id)).length}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// RequestCard Component
function RequestCard({ 
  request, 
  onJoin, 
  currentUserId, 
  isEmergency,
  isMobile
}: { 
  request: HelpRequest; 
  onJoin: (id: string) => void; 
  currentUserId: string;
  isEmergency: boolean;
  isMobile: boolean;
}) {
  const hasJoined = request.helpersJoined.includes(currentUserId);
  const isOwnRequest = request.requesterId === currentUserId;
  const progressPercentage = Math.min((request.helpersJoined.length / request.peopleNeeded) * 100, 100);
  
  return (
    <Card 
      className={`
        card-modern ${isMobile ? 'p-4' : 'p-5'} 
        hover:shadow-md transition-all duration-200 cursor-pointer
        ${isEmergency ? 'bg-red-50 border-red-200 shadow-lg' : ''}
      `}
    >
      {/* Header */}
      <div className={`flex items-start justify-between ${isMobile ? 'mb-3' : 'mb-4'}`}>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge 
            className={categoryColors[request.category]}
            style={{
              fontFamily: "'Metropolis', system-ui, sans-serif",
              fontWeight: '500',
              borderRadius: 'var(--radius-md)'
            }}
          >
            {request.category}
          </Badge>
          <Badge 
            className={urgencyColors[request.urgency]}
            style={{
              fontFamily: "'Metropolis', system-ui, sans-serif",
              fontWeight: '500',
              borderRadius: 'var(--radius-md)'
            }}
          >
            {isEmergency ? '🚨 ' : ''}{request.urgency}
          </Badge>
        </div>
        <div 
          className={`text-gray-500 flex items-center gap-1 ${isMobile ? 'text-xs' : 'text-xs'}`}
          style={{
            fontFamily: "'Metropolis', system-ui, sans-serif",
            fontSize: '12px',
            fontWeight: '400'
          }}
        >
          <Clock className={`${isMobile ? 'w-3 h-3' : 'w-3 h-3'}`} />
          {request.timePosted}
        </div>
      </div>

      {/* Title and Description */}
      <h3 
        className={`${isMobile ? 'text-sm mb-2' : 'text-base mb-3'} ${isEmergency ? 'text-red-800' : 'text-gray-900'}`}
        style={{
          fontFamily: "'Metropolis', system-ui, sans-serif",
          fontSize: isMobile ? '14px' : '16px',
          fontWeight: '600',
          lineHeight: '1.4'
        }}
      >
        {request.title}
      </h3>
      <p 
        className={`text-gray-700 leading-relaxed line-clamp-2 ${isMobile ? 'text-xs mb-3' : 'text-sm mb-4'}`}
        style={{
          fontFamily: "'Metropolis', system-ui, sans-serif",
          fontSize: isMobile ? '12px' : '14px',
          fontWeight: '400',
          lineHeight: '1.6'
        }}
      >
        {request.description}
      </p>

      {/* Location and Requester */}
      <div className={`flex items-center justify-between ${isMobile ? 'mb-3' : 'mb-4'}`}>
        <div 
          className={`flex items-center gap-1 text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}
          style={{
            fontFamily: "'Metropolis', system-ui, sans-serif",
            fontSize: isMobile ? '12px' : '14px',
            fontWeight: '400'
          }}
        >
          <MapPin className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
          <span className="truncate">{request.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <ImageWithFallback
            src={request.requester.avatar}
            alt={request.requester.name}
            className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} rounded-full object-cover`}
            style={{ borderRadius: 'var(--radius-2xl)' }}
          />
          <span 
            className={`text-gray-600 truncate ${isMobile ? 'text-xs' : 'text-sm'}`}
            style={{
              fontFamily: "'Metropolis', system-ui, sans-serif",
              fontSize: isMobile ? '12px' : '14px',
              fontWeight: '400'
            }}
          >
            {request.requester.name}
          </span>
          {request.requester.verified && (
            <CheckCircle className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-green-500`} />
          )}
        </div>
      </div>

      {/* Progress and Action */}
      <div 
        className={`flex items-center justify-between pt-3 border-t`}
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-3 flex-1">
          <div 
            className={`flex items-center gap-1 ${isMobile ? 'text-xs' : 'text-sm'}`}
            style={{
              fontFamily: "'Metropolis', system-ui, sans-serif",
              fontSize: isMobile ? '12px' : '14px',
              fontWeight: '400'
            }}
          >
            <User className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-gray-500`} />
            <span className="text-gray-600">
              {request.helpersJoined.length}/{request.peopleNeeded}
            </span>
          </div>
          <div className={`${isMobile ? 'w-16 h-1.5' : 'w-20 h-2'} bg-gray-200 rounded-full`}>
            <div 
              className={`h-full rounded-full transition-all duration-300 ${isEmergency ? 'bg-red-500' : 'bg-saffron-gradient'}`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {isOwnRequest ? (
          <Badge 
            className="bg-gray-100 text-gray-800"
            style={{
              fontFamily: "'Metropolis', system-ui, sans-serif",
              fontWeight: '500',
              borderRadius: 'var(--radius-md)'
            }}
          >
            Your Request
          </Badge>
        ) : (
          <Button 
            size={isMobile ? "sm" : "sm"}
            onClick={() => onJoin(request.id)}
            disabled={hasJoined}
            className={`
              flex items-center gap-1 transition-all duration-200
              ${isEmergency 
                ? "bg-red-500 hover:bg-red-600 text-white" 
                : "btn-primary-modern"
              } 
              ${hasJoined ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'}
              ${isMobile ? 'text-xs px-3 h-8' : 'text-sm px-4 h-9'}
            `}
            style={{
              fontFamily: "'Metropolis', system-ui, sans-serif",
              fontWeight: '500',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            {hasJoined ? "Joined" : "Offer Help"}
            {!hasJoined && <ArrowRight className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />}
          </Button>
        )}
      </div>
    </Card>
  );
}