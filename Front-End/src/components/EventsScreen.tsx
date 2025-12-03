import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Filter, Search, Zap, Tag, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import RankBadge from './RankBadge';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useScreenSize } from './ui/use-screen-size';
import { useApp, SevaEvent, EventType } from './AppContext';
import { toast } from 'sonner@2.0.3';

// Metropolis font family constant
const METROPOLIS_FONT = "'Metropolis', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif";

interface EventsScreenProps {
  onBack: () => void;
  onCreateEvent?: () => void;
}

const eventTypeColors: { [key in EventType]: string } = {
  'Seminar': 'bg-blue-100 text-blue-800',
  'Cleaning Drive': 'bg-green-100 text-green-800',
  'Food Distribution': 'bg-orange-100 text-orange-800',
  'Medical Camp': 'bg-red-100 text-red-800',
  'Blood Donation': 'bg-pink-100 text-pink-800',
  'Tree Plantation': 'bg-emerald-100 text-emerald-800',
  'Awareness Campaign': 'bg-purple-100 text-purple-800',
  'Workshop': 'bg-indigo-100 text-indigo-800',
  'Other': 'bg-gray-100 text-gray-800'
};

const statusColors = {
  'upcoming': 'bg-blue-100 text-blue-800',
  'ongoing': 'bg-green-100 text-green-800',
  'completed': 'bg-gray-100 text-gray-800',
  'cancelled': 'bg-red-100 text-red-800'
};

export default function EventsScreen({ onBack, onCreateEvent }: EventsScreenProps) {
  const { isDesktop, isMobile } = useScreenSize();
  const { state, registerForEvent, cancelEventRegistration } = useApp();
  const { events, currentUser } = state;

  const [selectedEvent, setSelectedEvent] = useState<SevaEvent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState<'all' | 'registered' | 'organizing'>('all');

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesSearch = searchTerm === '' || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    const matchesType = filterType === 'all' || event.eventType === filterType;

    const matchesViewMode = 
      viewMode === 'all' ? true :
      viewMode === 'registered' ? event.volunteersRegistered.includes(currentUser.id) :
      viewMode === 'organizing' ? event.organizerId === currentUser.id : true;
    
    return matchesSearch && matchesStatus && matchesType && matchesViewMode;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleRegister = (eventId: string) => {
    registerForEvent(eventId);
    const event = events.find(e => e.id === eventId);
    if (event) {
      toast.success(`Registered for ${event.title}! 🎉`);
    }
  };

  const handleUnregister = (eventId: string) => {
    cancelEventRegistration(eventId);
    const event = events.find(e => e.id === eventId);
    if (event) {
      toast.success(`Unregistered from ${event.title}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const daysUntilEvent = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const EventCard = ({ event }: { event: SevaEvent }) => {
    const isRegistered = event.volunteersRegistered.includes(currentUser.id);
    const isOrganizer = event.organizerId === currentUser.id;
    const spotsLeft = event.volunteersNeeded - event.volunteersRegistered.length;
    const daysLeft = daysUntilEvent(event.date);

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        {/* Event Image */}
        {event.image && (
          <div className="relative h-48 overflow-hidden">
            <ImageWithFallback
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 flex gap-2">
              <Badge className={statusColors[event.status]}>
                {event.status}
              </Badge>
              {isOrganizer && (
                <Badge className="bg-[#FF6F00] text-white">
                  Organizer
                </Badge>
              )}
              {isRegistered && !isOrganizer && (
                <Badge className="bg-green-600 text-white">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Registered
                </Badge>
              )}
            </div>
            {daysLeft <= 7 && daysLeft > 0 && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-red-600 text-white">
                  {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left
                </Badge>
              </div>
            )}
          </div>
        )}

        <div className="p-4 lg:p-6">
          {/* Event Type */}
          <div className="flex items-center gap-2 mb-3">
            <Badge className={eventTypeColors[event.eventType]}>
              {event.eventType}
            </Badge>
            <Badge variant="outline" className="text-[#FF6F00] border-[#FF6F00]">
              {event.category}
            </Badge>
          </div>

          {/* Event Title */}
          <h3 
            className="text-lg font-medium mb-2 cursor-pointer hover:text-[#FF6F00] transition-colors"
            onClick={() => setSelectedEvent(event)}
          >
            {event.title}
          </h3>

          {/* Event Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {event.description}
          </p>

          {/* Event Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-[#FF6F00]" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-[#FF6F00]" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-[#FF6F00]" />
              <span>{event.location}</span>
            </div>
          </div>

          {/* Organizer */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
            <ImageWithFallback
              src={event.organizer.avatar}
              alt={event.organizer.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{event.organizer.name}</p>
              <p className="text-xs text-gray-500">Organizer</p>
            </div>
            <RankBadge rank={event.organizer.rank} size="sm" showLabel={false} />
          </div>

          {/* Volunteers Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-[#FF6F00]" />
                <span className="font-medium">
                  {event.volunteersRegistered.length} / {event.volunteersNeeded} Volunteers
                </span>
              </div>
              {spotsLeft > 0 && spotsLeft <= 5 && (
                <span className="text-xs text-red-600 font-medium">
                  Only {spotsLeft} spots left!
                </span>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#FF6F00] h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min((event.volunteersRegistered.length / event.volunteersNeeded) * 100, 100)}%`
                }}
              />
            </div>
          </div>

          {/* Tags */}
          {event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {event.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={() => setSelectedEvent(event)}
              variant="outline"
              className="flex-1"
            >
              View Details
            </Button>
            {!isOrganizer && (
              isRegistered ? (
                <Button
                  onClick={() => handleUnregister(event.id)}
                  variant="outline"
                  className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                >
                  Unregister
                </Button>
              ) : (
                <Button
                  onClick={() => handleRegister(event.id)}
                  className="flex-1 bg-[#FF6F00] hover:bg-[#E65100] text-white"
                  disabled={spotsLeft === 0}
                >
                  {spotsLeft === 0 ? 'Full' : 'Register'}
                </Button>
              )
            )}
            {isOrganizer && (
              <Button
                onClick={() => setSelectedEvent(event)}
                className="flex-1 bg-[#FF6F00] hover:bg-[#E65100] text-white"
              >
                Manage
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  };

  const EventDetailDialog = () => {
    if (!selectedEvent) return null;

    const isRegistered = selectedEvent.volunteersRegistered.includes(currentUser.id);
    const isOrganizer = selectedEvent.organizerId === currentUser.id;
    const spotsLeft = selectedEvent.volunteersNeeded - selectedEvent.volunteersRegistered.length;
    const registeredUsers = state.users.filter(u => selectedEvent.volunteersRegistered.includes(u.id));

    return (
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedEvent.title}
              {isOrganizer && (
                <Badge className="bg-[#FF6F00] text-white">You're the Organizer</Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedEvent.eventType} • {selectedEvent.category}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Event Image */}
            {selectedEvent.image && (
              <div className="rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            {/* Event Status */}
            <div className="flex items-center gap-2">
              <Badge className={statusColors[selectedEvent.status]}>
                {selectedEvent.status}
              </Badge>
              {isRegistered && !isOrganizer && (
                <Badge className="bg-green-600 text-white">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  You're Registered
                </Badge>
              )}
            </div>

            {/* Description */}
            <div>
              <h4 className="font-medium mb-2 text-[#FF6F00]">About this Event</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {selectedEvent.description}
              </p>
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-3 text-[#FF6F00]">Event Details</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-[#FF6F00] mt-0.5" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-gray-600">{formatDate(selectedEvent.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Clock className="w-4 h-4 text-[#FF6F00] mt-0.5" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-gray-600">{selectedEvent.time}</p>
                      {selectedEvent.duration && (
                        <p className="text-xs text-gray-500">Duration: {selectedEvent.duration}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-[#FF6F00] mt-0.5" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-gray-600">{selectedEvent.location}</p>
                      <p className="text-xs text-gray-500">{selectedEvent.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3 text-[#FF6F00]">Organizer</h4>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <ImageWithFallback
                    src={selectedEvent.organizer.avatar}
                    alt={selectedEvent.organizer.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{selectedEvent.organizer.name}</p>
                    <div className="flex items-center gap-2">
                      <RankBadge rank={selectedEvent.organizer.rank} size="sm" showLabel={true} />
                    </div>
                  </div>
                </div>
                {selectedEvent.contactInfo && (
                  <div className="mt-3 text-sm">
                    <p className="font-medium mb-1">Contact</p>
                    <p className="text-gray-600">{selectedEvent.contactInfo}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Requirements */}
            {selectedEvent.requirements && (
              <div>
                <h4 className="font-medium mb-2 text-[#FF6F00]">What to Bring</h4>
                <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                  {selectedEvent.requirements}
                </p>
              </div>
            )}

            {/* Volunteers */}
            <div>
              <h4 className="font-medium mb-3 text-[#FF6F00] flex items-center gap-2">
                <Users className="w-4 h-4" />
                Volunteers ({selectedEvent.volunteersRegistered.length} / {selectedEvent.volunteersNeeded})
              </h4>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>{spotsLeft} spots remaining</span>
                  <span>{Math.round((selectedEvent.volunteersRegistered.length / selectedEvent.volunteersNeeded) * 100)}% filled</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#FF6F00] h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min((selectedEvent.volunteersRegistered.length / selectedEvent.volunteersNeeded) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>

              {/* Registered Volunteers List (for organizers) */}
              {isOrganizer && registeredUsers.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Registered Volunteers</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {registeredUsers.map((user) => (
                      <div key={user.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <ImageWithFallback
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.location}</p>
                        </div>
                        <RankBadge rank={user.rank} size="sm" showLabel={false} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!isOrganizer && registeredUsers.length > 0 && (
                <div className="flex -space-x-2">
                  {registeredUsers.slice(0, 5).map((user) => (
                    <ImageWithFallback
                      key={user.id}
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-white"
                    />
                  ))}
                  {registeredUsers.length > 5 && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium">
                      +{registeredUsers.length - 5}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tags */}
            {selectedEvent.tags.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 text-[#FF6F00]">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              {!isOrganizer && (
                isRegistered ? (
                  <Button
                    onClick={() => {
                      handleUnregister(selectedEvent.id);
                      setSelectedEvent(null);
                    }}
                    variant="outline"
                    className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                  >
                    Unregister from Event
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      handleRegister(selectedEvent.id);
                      setSelectedEvent(null);
                    }}
                    className="flex-1 bg-[#FF6F00] hover:bg-[#E65100] text-white"
                    disabled={spotsLeft === 0}
                  >
                    {spotsLeft === 0 ? 'Event Full' : 'Register as Volunteer'}
                  </Button>
                )
              )}
              {isOrganizer && (
                <Button
                  className="flex-1 bg-[#FF6F00] hover:bg-[#E65100] text-white"
                  disabled
                >
                  Edit Event (Coming Soon)
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const stats = {
    total: events.length,
    registered: events.filter(e => e.volunteersRegistered.includes(currentUser.id)).length,
    organizing: events.filter(e => e.organizerId === currentUser.id).length,
    upcoming: events.filter(e => e.status === 'upcoming').length
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-20' : ''}`}>
      {/* Add Metropolis Font Import */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Metropolis:wght@300;400;500;600;700;800;900&display=swap');
        `}
      </style>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 sticky top-0 z-30">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 
              className="text-xl text-[#FF6F00]"
              style={{ fontFamily: METROPOLIS_FONT, fontWeight: '600' }}
            >
              Seva Events
            </h1>
            <p 
              className="text-sm text-gray-600"
              style={{ fontFamily: METROPOLIS_FONT, fontWeight: '400' }}
            >
              Join community service events
            </p>
          </div>
          {onCreateEvent && (
            <Button
              onClick={onCreateEvent}
              className="bg-[#FF6F00] hover:bg-[#E65100] text-white"
              size={isMobile ? "sm" : "default"}
              style={{ fontFamily: METROPOLIS_FONT, fontWeight: '500' }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <Card className="p-3 text-center">
            <p 
              className="text-xs text-gray-600 mb-1"
              style={{ fontFamily: METROPOLIS_FONT, fontWeight: '400' }}
            >
              Total
            </p>
            <p 
              className="text-lg font-medium text-[#FF6F00]"
              style={{ fontFamily: METROPOLIS_FONT, fontWeight: '600' }}
            >
              {stats.total}
            </p>
          </Card>
          <Card className="p-3 text-center">
            <p 
              className="text-xs text-gray-600 mb-1"
              style={{ fontFamily: METROPOLIS_FONT, fontWeight: '400' }}
            >
              Registered
            </p>
            <p 
              className="text-lg font-medium text-green-600"
              style={{ fontFamily: METROPOLIS_FONT, fontWeight: '600' }}
            >
              {stats.registered}
            </p>
          </Card>
          <Card className="p-3 text-center">
            <p 
              className="text-xs text-gray-600 mb-1"
              style={{ fontFamily: METROPOLIS_FONT, fontWeight: '400' }}
            >
              Organizing
            </p>
            <p 
              className="text-lg font-medium text-blue-600"
              style={{ fontFamily: METROPOLIS_FONT, fontWeight: '600' }}
            >
              {stats.organizing}
            </p>
          </Card>
          <Card className="p-3 text-center">
            <p 
              className="text-xs text-gray-600 mb-1"
              style={{ fontFamily: METROPOLIS_FONT, fontWeight: '400' }}
            >
              Upcoming
            </p>
            <p 
              className="text-lg font-medium text-purple-600"
              style={{ fontFamily: METROPOLIS_FONT, fontWeight: '600' }}
            >
              {stats.upcoming}
            </p>
          </Card>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search events..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ fontFamily: METROPOLIS_FONT, fontWeight: '400' }}
          />
        </div>

        {/* View Mode Tabs */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="mb-3">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="registered">Registered</TabsTrigger>
            <TabsTrigger value="organizing">Organizing</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filters */}
        {isDesktop && (
          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Seminar">Seminar</SelectItem>
                <SelectItem value="Cleaning Drive">Cleaning Drive</SelectItem>
                <SelectItem value="Food Distribution">Food Distribution</SelectItem>
                <SelectItem value="Medical Camp">Medical Camp</SelectItem>
                <SelectItem value="Blood Donation">Blood Donation</SelectItem>
                <SelectItem value="Tree Plantation">Tree Plantation</SelectItem>
                <SelectItem value="Workshop">Workshop</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Events Grid */}
      <div className="px-4 lg:px-6 py-6">
        {filteredEvents.length === 0 ? (
          <Card className="p-8 text-center">
            <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium mb-2">
              {searchTerm ? "No events found" : "No events available"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? "Try different keywords or filters"
                : viewMode === 'organizing'
                ? "You haven't created any events yet. Create your first event!"
                : viewMode === 'registered'
                ? "You haven't registered for any events yet. Browse and join events!"
                : "Be the first to create an event and bring the community together!"
              }
            </p>
            {onCreateEvent && viewMode === 'organizing' && (
              <Button
                onClick={onCreateEvent}
                className="bg-[#FF6F00] hover:bg-[#E65100] text-white"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Create Your First Event
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Event Detail Dialog */}
      <EventDetailDialog />
    </div>
  );
}