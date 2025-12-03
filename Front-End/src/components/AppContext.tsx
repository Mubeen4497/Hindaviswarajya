dimport { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner@2.0.3';
import { emitRankUpEvent } from '../lib/rankEvents';

export type UserRank = 'Sevak' | 'Mavla' | 'Talveer' | 'Yoddha' | 'Shiledar' | 'Bargir' | 'Daryaveer' | 'Gadkari' | 'Senapati' | 'Chhava';

export interface RankInfo {
  name: UserRank;
  pointsRequired: number;
  icon: string;
  color: string;
  lore: string;
  perks: string[];
  unlocks: string[];
}

export const RANK_SYSTEM: RankInfo[] = [
  {
    name: 'Sevak',
    pointsRequired: 0,
    icon: '🙏',
    color: '#9E9E9E',
    lore: 'Seva is your first step toward Swarajya.',
    perks: ['Create seva posts', 'Join community', 'Earn seva points'],
    unlocks: ['Basic profile', 'Feed access', 'Help requests']
  },
  {
    name: 'Mavla',
    pointsRequired: 10,
    icon: '⚔️',
    color: '#795548',
    lore: 'Born from the mountains. Built for courage.',
    perks: ['Bronze badge', 'Create events (up to 2/month)', 'Priority support'],
    unlocks: ['Event creation', 'Advanced search', 'Custom profile theme']
  },
  {
    name: 'Talveer',
    pointsRequired: 100,
    icon: '🗡️',
    color: '#607D8B',
    lore: 'Sharpening skills. Rising with purpose.',
    perks: ['Silver badge', 'Create events (up to 5/month)', 'Featured posts'],
    unlocks: ['Sword badge', 'Event management tools', 'Analytics dashboard']
  },
  {
    name: 'Yoddha',
    pointsRequired: 250,
    icon: '🛡️',
    color: '#3F51B5',
    lore: 'Every battle makes you stronger.',
    perks: ['Gold badge', 'Unlimited events', 'Mentor access'],
    unlocks: ['Warrior shield', 'Team creation', 'Custom banners']
  },
  {
    name: 'Shiledar',
    pointsRequired: 1000,
    icon: '🏇',
    color: '#9C27B0',
    lore: 'Ride with honor. Fight with fire.',
    perks: ['Purple cavalry badge', 'Verified checkmark', 'Top visibility'],
    unlocks: ['Leadership board', 'Mentor program', 'Event promotion']
  },
  {
    name: 'Bargir',
    pointsRequired: 5000,
    icon: '⚜️',
    color: '#E91E63',
    lore: 'Discipline creates legends.',
    perks: ['Platinum badge', 'Priority event placement', 'Custom flair'],
    unlocks: ['Regional leadership', 'Campaign creation', 'Advanced analytics']
  },
  {
    name: 'Daryaveer',
    pointsRequired: 10000,
    icon: '🌊',
    color: '#2196F3',
    lore: 'Fearless on land. Unstoppable at sea.',
    perks: ['Diamond naval badge', 'State-wide recognition', 'Media features'],
    unlocks: ['Naval campaigns', 'Regional influence', 'VIP networking']
  },
  {
    name: 'Gadkari',
    pointsRequired: 25000,
    icon: '🏰',
    color: '#FF6F00',
    lore: 'Guard the fort. Protect the legacy.',
    perks: ['Ruby fort badge', 'National recognition', 'Exclusive events'],
    unlocks: ['State campaigns', 'Press releases', 'Partnership portal']
  },
  {
    name: 'Senapati',
    pointsRequired: 50000,
    icon: '⚡',
    color: '#F44336',
    lore: 'Lead with strategy. Win with courage.',
    perks: ['Emerald commander badge', 'Lifetime achievement', 'Legacy program'],
    unlocks: ['National campaigns', 'Legacy projects', 'Hall of fame']
  },
  {
    name: 'Chhava',
    pointsRequired: 100000,
    icon: '🔱',
    color: '#FFD700',
    lore: 'Born a warrior. Rise as a legend.',
    perks: ['Golden Trident badge', 'Immortal status', 'Monument dedication'],
    unlocks: ['Lifetime membership', 'Historical archive', 'Eternal legacy']
  }
];

export interface RankHistory {
  rank: UserRank;
  achievedDate: string;
  points: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  location: string;
  rank: UserRank;
  sevaPoints: number;
  totalHelped: number;
  postsCount: number;
  bio?: string;
  joinedDate: string;
  rankHistory: RankHistory[];
}

export interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  userId: string;
  content: string;
  timestamp: string;
}

export type SevaCategory = 'Food' | 'Education' | 'Health' | 'Shelter' | 'Other';

export interface SevaPost {
  id: string;
  userId: string;
  user: User;
  content: string;
  image?: string;
  category: SevaCategory;
  helpedPeople: number;
  likes: number;
  likedBy: string[];
  comments: Comment[];
  tags: string[];
  timestamp: string;
  location: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'achievement';
  message: string;
  timestamp: string;
  read: boolean;
  postId?: string;
  userId?: string;
}

export interface HelpRequest {
  id: string;
  title: string;
  description: string;
  category: SevaCategory;
  urgency: 'Low' | 'Medium' | 'High' | 'Emergency';
  location: string;
  requesterId: string;
  requester: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  peopleNeeded: number;
  helpersJoined: string[];
  timestamp: string; // ISO timestamp for backend
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  deadline?: string; // ISO timestamp
  contactInfo?: string;
  timePosted?: string; // Human-readable format
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface ServiceOffered {
  id: string;
  title: string;
  description: string;
  category: SevaCategory;
  provider: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    rank: string;
  };
  location: string;
  availability: 'Available' | 'Busy' | 'Limited';
  skills: string[];
  experienceYears?: number;
  contactInfo?: string;
  requestsReceived: string[]; // User IDs who requested this service
  timestamp: string;
  rating?: number;
  reviewsCount?: number;
  // Category-specific fields
  mealsCapacity?: number;
  dietaryOptions?: string;
  subjects?: string;
  gradeLevels?: string;
  teachingMethod?: string;
  specialization?: string;
  certifications?: string;
  constructionSkills?: string;
  toolsAvailable?: string;
  serviceType?: string;
}

export type EventType = 'Seminar' | 'Cleaning Drive' | 'Food Distribution' | 'Medical Camp' | 'Blood Donation' | 'Tree Plantation' | 'Awareness Campaign' | 'Workshop' | 'Other';

export interface SevaEvent {
  id: string;
  title: string;
  description: string;
  eventType: EventType;
  category: SevaCategory;
  date: string;
  time: string;
  location: string;
  address: string;
  organizerId: string;
  organizer: {
    name: string;
    avatar: string;
    rank: UserRank;
  };
  volunteersNeeded: number;
  volunteersRegistered: string[]; // User IDs
  image?: string;
  tags: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  duration?: string; // e.g., "3 hours"
  requirements?: string; // What volunteers should bring
  contactInfo?: string;
  timestamp: string; // When the event was created
}

interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  users: User[];
  posts: SevaPost[];
  notifications: Notification[];
  helpRequests: HelpRequest[];
  servicesOffered: ServiceOffered[];
  events: SevaEvent[];
}

interface AppContextType {
  state: AppState;
  login: (email: string, password: string) => boolean;
  signup: (userData: { name: string; email: string; password: string; location: string }) => boolean;
  logout: () => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  createPost: (post: Omit<SevaPost, 'id' | 'user' | 'likes' | 'likedBy' | 'comments' | 'timestamp'>) => void;
  markNotificationRead: (notificationId: string) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  addHelpRequest: (request: Omit<HelpRequest, 'id' | 'timestamp' | 'helpersJoined' | 'status'>) => void;
  joinHelpRequest: (requestId: string) => void;
  addServiceOffered: (service: Omit<ServiceOffered, 'id' | 'timestamp' | 'requestsReceived' | 'rating' | 'reviewsCount'>) => void;
  requestService: (serviceId: string) => void;
  createEvent: (event: Omit<SevaEvent, 'id' | 'organizer' | 'volunteersRegistered' | 'status' | 'timestamp'>) => void;
  registerForEvent: (eventId: string) => void;
  cancelEventRegistration: (eventId: string) => void;
  onRankUp?: (newRank: RankInfo) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Rajesh Patil',
    email: 'demo@hindaviswarajya.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    location: 'Pune, Maharashtra',
    rank: 'Shiledar',
    sevaPoints: 1500,
    totalHelped: 350,
    postsCount: 45,
    bio: 'Dedicated to serving the community through education and food distribution.',
    joinedDate: '2024-01-15',
    rankHistory: [
      { rank: 'Sevak', achievedDate: '2024-01-15', points: 0 },
      { rank: 'Mavla', achievedDate: '2024-02-01', points: 10 },
      { rank: 'Talveer', achievedDate: '2024-02-15', points: 100 },
      { rank: 'Yoddha', achievedDate: '2024-03-01', points: 250 },
      { rank: 'Shiledar', achievedDate: '2024-03-15', points: 1000 },
    ],
  },
  {
    id: '2',
    name: 'Priya Deshmukh',
    email: 'priya@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    location: 'Mumbai, Maharashtra',
    rank: 'Yoddha',
    sevaPoints: 600,
    totalHelped: 280,
    postsCount: 32,
    bio: 'Passionate about healthcare and wellness in rural communities.',
    joinedDate: '2024-02-20',
    rankHistory: [
      { rank: 'Sevak', achievedDate: '2024-02-20', points: 0 },
      { rank: 'Mavla', achievedDate: '2024-03-01', points: 10 },
      { rank: 'Talveer', achievedDate: '2024-03-15', points: 100 },
      { rank: 'Yoddha', achievedDate: '2024-04-01', points: 250 },
    ],
  },
  {
    id: '3',
    name: 'Amit Kulkarni',
    email: 'amit@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    location: 'Nashik, Maharashtra',
    rank: 'Talveer',
    sevaPoints: 180,
    totalHelped: 180,
    postsCount: 28,
    bio: 'Building shelters and providing basic amenities to the needy.',
    joinedDate: '2024-03-10',
    rankHistory: [
      { rank: 'Sevak', achievedDate: '2024-03-10', points: 0 },
      { rank: 'Mavla', achievedDate: '2024-04-01', points: 10 },
      { rank: 'Talveer', achievedDate: '2024-04-15', points: 100 },
    ],
  },
  {
    id: '4',
    name: 'Sneha Joshi',
    email: 'sneha@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    location: 'Nagpur, Maharashtra',
    rank: 'Mavla',
    sevaPoints: 45,
    totalHelped: 120,
    postsCount: 18,
    bio: 'Supporting education for underprivileged children.',
    joinedDate: '2024-04-05',
    rankHistory: [
      { rank: 'Sevak', achievedDate: '2024-04-05', points: 0 },
      { rank: 'Mavla', achievedDate: '2024-05-01', points: 10 },
    ],
  },
];

// Demo credentials for testing
const DEMO_CREDENTIALS = {
  email: 'demo@hindaviswarajya.com',
  password: 'demo123',
};

// Helper function to get rank based on points
export function getRankFromPoints(points: number): RankInfo {
  // Find the highest rank the user qualifies for
  for (let i = RANK_SYSTEM.length - 1; i >= 0; i--) {
    if (points >= RANK_SYSTEM[i].pointsRequired) {
      return RANK_SYSTEM[i];
    }
  }
  return RANK_SYSTEM[0]; // Default to Sevak
}

const mockPosts: SevaPost[] = [
  {
    id: '1',
    userId: '1',
    user: mockUsers[0],
    content: 'Organized a free meal distribution drive in the local community. Fed over 150 families today with nutritious food. The smiles on their faces made all the effort worthwhile! 🙏',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800',
    category: 'Food',
    helpedPeople: 150,
    likes: 234,
    likedBy: ['2', '3', '4'],
    comments: [
      {
        id: 'c1',
        userName: 'Priya Deshmukh',
        userAvatar: mockUsers[1].avatar,
        userId: '2',
        content: 'This is amazing work! Keep it up! 🙏',
        timestamp: '2 hours ago',
      },
      {
        id: 'c2',
        userName: 'Amit Kulkarni',
        userAvatar: mockUsers[2].avatar,
        userId: '3',
        content: 'Truly inspiring. How can I join your next drive?',
        timestamp: '1 hour ago',
      },
    ],
    tags: ['fooddistribution', 'community', 'seva'],
    timestamp: '3 hours ago',
    location: 'Pune, Maharashtra',
  },
  {
    id: '2',
    userId: '2',
    user: mockUsers[1],
    content: 'Conducted a free health checkup camp in rural areas. Screened over 200 people for diabetes, blood pressure, and general wellness. Prevention is better than cure!',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    category: 'Health',
    helpedPeople: 200,
    likes: 189,
    likedBy: ['1', '3'],
    comments: [
      {
        id: 'c3',
        userName: 'Rajesh Patil',
        userAvatar: mockUsers[0].avatar,
        userId: '1',
        content: 'Excellent initiative! Healthcare is so important.',
        timestamp: '30 mins ago',
      },
    ],
    tags: ['healthcare', 'checkup', 'rural'],
    timestamp: '5 hours ago',
    location: 'Mumbai, Maharashtra',
  },
  {
    id: '3',
    userId: '3',
    user: mockUsers[2],
    content: 'Built 5 temporary shelters for homeless families in the city. Each shelter has basic amenities including water and electricity. Everyone deserves a roof over their head.',
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
    category: 'Shelter',
    helpedPeople: 25,
    likes: 312,
    likedBy: ['1', '2', '4'],
    comments: [],
    tags: ['shelter', 'housing', 'homeless'],
    timestamp: '1 day ago',
    location: 'Nashik, Maharashtra',
  },
  {
    id: '4',
    userId: '4',
    user: mockUsers[3],
    content: 'Started a weekend tutoring program for underprivileged children. 45 students enrolled in the first batch. Education is the foundation of a strong future!',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    category: 'Education',
    helpedPeople: 45,
    likes: 156,
    likedBy: ['1', '2'],
    comments: [
      {
        id: 'c4',
        userName: 'Sneha Joshi',
        userAvatar: mockUsers[1].avatar,
        userId: '2',
        content: 'Education transforms lives. Great work!',
        timestamp: '4 hours ago',
      },
    ],
    tags: ['education', 'tutoring', 'children'],
    timestamp: '2 days ago',
    location: 'Nagpur, Maharashtra',
  },
  {
    id: '5',
    userId: '1',
    user: mockUsers[0],
    content: 'Distributed school supplies and books to 80 students in remote villages. Every child deserves the tools to learn and grow.',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800',
    category: 'Education',
    helpedPeople: 80,
    likes: 203,
    likedBy: ['3', '4'],
    comments: [],
    tags: ['education', 'books', 'students'],
    timestamp: '3 days ago',
    location: 'Pune, Maharashtra',
  },
];

const mockHelpRequests: HelpRequest[] = [
  {
    id: 'hr1',
    title: 'Urgent: Food needed for flood-affected families',
    description: 'Need volunteers to help prepare and distribute food packets to 50+ families affected by recent floods in our area.',
    category: 'Food',
    urgency: 'Emergency',
    location: 'Pune, Maharashtra',
    requesterId: '2',
    requester: {
      name: 'Sneha Joshi',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      verified: true
    },
    peopleNeeded: 10,
    helpersJoined: ['1', '3'],
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    timePosted: '2 hours ago',
    status: 'open',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'hr2',
    title: 'Teachers needed for weekend classes',
    description: 'Looking for volunteers to teach basic English and Math to underprivileged children every Saturday.',
    category: 'Education',
    urgency: 'Medium',
    location: 'Mumbai, Maharashtra',
    requesterId: '3',
    requester: {
      name: 'Amit Sharma',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      verified: true
    },
    peopleNeeded: 5,
    helpersJoined: ['1'],
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    timePosted: '5 hours ago',
    status: 'open',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'hr3',
    title: 'Blood donation camp volunteers needed',
    description: 'Organizing a blood donation camp next Sunday. Need volunteers to help with registration and coordination.',
    category: 'Health',
    urgency: 'Medium',
    location: 'Nagpur, Maharashtra',
    requesterId: '4',
    requester: {
      name: 'Anjali Desai',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      verified: true
    },
    peopleNeeded: 8,
    helpersJoined: ['2', '3'],
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    timePosted: '1 day ago',
    status: 'open',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'hr4',
    title: 'Help needed to repair community center roof',
    description: 'Our community center\'s roof was damaged in the storm. Looking for volunteers with carpentry/repair skills.',
    category: 'Shelter',
    urgency: 'High',
    location: 'Nashik, Maharashtra',
    requesterId: '1',
    requester: {
      name: 'Rajesh Patil',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      verified: true
    },
    peopleNeeded: 12,
    helpersJoined: ['4'],
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    timePosted: '3 days ago',
    status: 'open',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const mockServicesOffered: ServiceOffered[] = [
  {
    id: 'srv1',
    title: 'Free Tutoring for Underprivileged Children',
    description: 'I offer free tutoring in Mathematics and Science for students from classes 5-10. Available on weekends and weekday evenings.',
    category: 'Education',
    provider: {
      id: '2',
      name: 'Priya Deshmukh',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      verified: true,
      rank: 'Yoddha'
    },
    location: 'Mumbai, Maharashtra',
    availability: 'Available',
    skills: ['Mathematics', 'Science', 'English'],
    experienceYears: 5,
    contactInfo: 'priya@example.com',
    requestsReceived: ['1', '3'],
    timestamp: '2 days ago',
    rating: 4.8,
    reviewsCount: 12,
    subjects: 'Mathematics, Science, English',
    gradeLevels: 'Classes 5-10',
    teachingMethod: 'Both'
  },
  {
    id: 'srv2',
    title: 'Medical Check-up Camps for Rural Areas',
    description: 'Organizing free health check-up camps in rural areas. Can provide basic health screening, blood pressure monitoring, and health education.',
    category: 'Health',
    provider: {
      id: '4',
      name: 'Dr. Sneha Joshi',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      verified: true,
      rank: 'Mavla'
    },
    location: 'Pune, Maharashtra',
    availability: 'Limited',
    skills: ['General Medicine', 'Health Screening', 'Community Health'],
    experienceYears: 8,
    contactInfo: '+91-9876543210',
    specialization: 'General Medicine, Preventive Healthcare',
    certifications: 'MBBS, Community Health Certification',
    requestsReceived: ['1'],
    timestamp: '5 days ago',
    rating: 4.9,
    reviewsCount: 25
  },
  {
    id: 'srv3',
    title: 'Community Kitchen - Free Meal Service',
    description: 'Running a community kitchen every Sunday to provide free meals to those in need. Can serve up to 100 people. Always looking for volunteers and donations.',
    category: 'Food',
    provider: {
      id: '3',
      name: 'Amit Kulkarni',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      verified: true,
      rank: 'Talveer'
    },
    location: 'Nashik, Maharashtra',
    availability: 'Available',
    skills: ['Cooking', 'Food Distribution', 'Community Service'],
    experienceYears: 3,
    requestsReceived: [],
    timestamp: '1 week ago',
    rating: 4.7,
    reviewsCount: 18,
    mealsCapacity: 100,
    dietaryOptions: 'Vegetarian, Vegan options available'
  },
  {
    id: 'srv4',
    title: 'Construction & Repair Services for Community',
    description: 'Professional carpenter with 15 years of experience. Offering free repair services for schools, community centers, and homes of elderly people.',
    category: 'Shelter',
    provider: {
      id: '1',
      name: 'Rajesh Patil',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      verified: true,
      rank: 'Shiledar'
    },
    location: 'Pune, Maharashtra',
    availability: 'Busy',
    skills: ['Carpentry', 'Repair Work', 'Construction'],
    experienceYears: 15,
    contactInfo: '+91-9123456789',
    requestsReceived: ['2', '4'],
    timestamp: '3 days ago',
    rating: 5.0,
    reviewsCount: 31,
    constructionSkills: 'Carpentry, Masonry, Roofing, General Repairs',
    toolsAvailable: 'Complete carpentry toolkit, power tools'
  },
  {
    id: 'srv5',
    title: 'Digital Literacy Training for Seniors',
    description: 'Teaching basic computer skills, smartphone usage, and internet safety to senior citizens. One-on-one sessions available.',
    category: 'Education',
    provider: {
      id: '2',
      name: 'Priya Deshmukh',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      verified: true,
      rank: 'Yoddha'
    },
    location: 'Mumbai, Maharashtra',
    availability: 'Available',
    skills: ['Computer Training', 'Digital Literacy', 'Patient Teaching'],
    experienceYears: 3,
    subjects: 'Computer Basics, Internet, Smartphone Usage',
    gradeLevels: 'Senior Citizens',
    teachingMethod: 'In-person',
    requestsReceived: ['3'],
    timestamp: '4 days ago',
    rating: 4.6,
    reviewsCount: 8
  }
];

const mockEvents: SevaEvent[] = [
  {
    id: 'evt1',
    title: 'Health Awareness Seminar',
    description: 'Join us for a seminar on health awareness and preventive healthcare. Learn about common diseases and how to stay healthy.',
    eventType: 'Seminar',
    category: 'Health',
    date: '2024-05-15',
    time: '10:00 AM - 12:00 PM',
    location: 'Pune, Maharashtra',
    address: 'Community Hall, Pune',
    organizerId: '1',
    organizer: {
      name: 'Rajesh Patil',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      rank: 'Shiledar'
    },
    volunteersNeeded: 20,
    volunteersRegistered: ['2', '3'],
    image: 'https://images.unsplash.com/photo-1557682250-338b453de804?w=800',
    tags: ['health', 'seminar', 'awareness'],
    status: 'upcoming',
    duration: '2 hours',
    requirements: 'Notebook and pen',
    contactInfo: 'rajesh@example.com',
    timestamp: '2024-04-25'
  },
  {
    id: 'evt2',
    title: 'Food Distribution Drive',
    description: 'Help distribute food packets to families in need. This drive will provide essential food items to over 100 families.',
    eventType: 'Food Distribution',
    category: 'Food',
    date: '2024-05-20',
    time: '9:00 AM - 12:00 PM',
    location: 'Mumbai, Maharashtra',
    address: 'Community Center, Mumbai',
    organizerId: '2',
    organizer: {
      name: 'Priya Deshmukh',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      rank: 'Yoddha'
    },
    volunteersNeeded: 30,
    volunteersRegistered: ['1', '3'],
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800',
    tags: ['food', 'distribution', 'drive'],
    status: 'upcoming',
    duration: '3 hours',
    requirements: 'Volunteer T-shirt',
    contactInfo: 'priya@example.com',
    timestamp: '2024-04-30'
  },
  {
    id: 'evt3',
    title: 'Medical Check-up Camp',
    description: 'Organizing a free health check-up camp in rural areas. Can provide basic health screening, blood pressure monitoring, and health education.',
    eventType: 'Medical Camp',
    category: 'Health',
    date: '2024-05-25',
    time: '10:00 AM - 2:00 PM',
    location: 'Nagpur, Maharashtra',
    address: 'Village Hall, Nagpur',
    organizerId: '4',
    organizer: {
      name: 'Dr. Sneha Joshi',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      rank: 'Mavla'
    },
    volunteersNeeded: 15,
    volunteersRegistered: ['1', '2'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    tags: ['health', 'checkup', 'camp'],
    status: 'upcoming',
    duration: '4 hours',
    requirements: 'Stethoscope, blood pressure monitor',
    contactInfo: '+91-9876543210',
    timestamp: '2024-05-01'
  },
  {
    id: 'evt4',
    title: 'Tree Plantation Drive',
    description: 'Join us in planting trees to improve the environment and provide green spaces in our community.',
    eventType: 'Tree Plantation',
    category: 'Other',
    date: '2024-06-01',
    time: '10:00 AM - 12:00 PM',
    location: 'Nashik, Maharashtra',
    address: 'Community Park, Nashik',
    organizerId: '3',
    organizer: {
      name: 'Amit Kulkarni',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      rank: 'Talveer'
    },
    volunteersNeeded: 25,
    volunteersRegistered: ['1', '2', '4'],
    image: 'https://images.unsplash.com/photo-1557682250-338b453de804?w=800',
    tags: ['tree', 'plantation', 'drive'],
    status: 'upcoming',
    duration: '2 hours',
    requirements: 'Gloves, spade',
    contactInfo: 'amit@example.com',
    timestamp: '2024-05-15'
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  // Check local storage for saved auth state
  const getInitialAuthState = (): AppState => {
    const savedAuth = localStorage.getItem('hindavi_auth');
    if (savedAuth) {
      try {
        const { userId } = JSON.parse(savedAuth);
        const user = mockUsers.find(u => u.id === userId);
        if (user) {
          return {
            currentUser: user,
            isAuthenticated: true,
            users: mockUsers,
            posts: mockPosts,
            notifications: [],
            helpRequests: mockHelpRequests,
            servicesOffered: mockServicesOffered,
            events: mockEvents,
          };
        }
      } catch (e) {
        // Invalid saved data, clear it
        localStorage.removeItem('hindavi_auth');
      }
    }
    return {
      currentUser: null,
      isAuthenticated: false,
      users: mockUsers,
      posts: mockPosts,
      notifications: [],
      helpRequests: mockHelpRequests,
      servicesOffered: mockServicesOffered,
      events: mockEvents,
    };
  };

  const [state, setState] = useState<AppState>(getInitialAuthState());

  // Authentication methods
  const login = (email: string, password: string): boolean => {
    // Check demo credentials
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      const user = mockUsers.find(u => u.email === email);
      if (user) {
        setState(prev => ({
          ...prev,
          currentUser: user,
          isAuthenticated: true,
        }));
        // Save to local storage
        localStorage.setItem('hindavi_auth', JSON.stringify({ userId: user.id }));
        toast.success(`Welcome back, ${user.name}! 🙏`);
        return true;
      }
    }
    
    // Check if user exists (in real app, this would be API call)
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      setState(prev => ({
        ...prev,
        currentUser: user,
        isAuthenticated: true,
      }));
      localStorage.setItem('hindavi_auth', JSON.stringify({ userId: user.id }));
      toast.success(`Welcome back, ${user.name}! 🙏`);
      return true;
    }
    
    toast.error('Invalid email or password');
    return false;
  };

  const signup = (userData: { name: string; email: string; password: string; location: string }): boolean => {
    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      toast.error('Email already registered');
      return false;
    }

    // Create new user
    const newUser: User = {
      id: `user${Date.now()}`,
      name: userData.name,
      email: userData.email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
      location: userData.location,
      rank: 'Sevak',
      sevaPoints: 0,
      totalHelped: 0,
      postsCount: 0,
      bio: '',
      joinedDate: new Date().toISOString().split('T')[0],
      rankHistory: [
        { rank: 'Sevak', achievedDate: new Date().toISOString().split('T')[0], points: 0 },
      ],
    };

    setState(prev => ({
      ...prev,
      users: [...prev.users, newUser],
      currentUser: newUser,
      isAuthenticated: true,
    }));

    // Save to local storage
    localStorage.setItem('hindavi_auth', JSON.stringify({ userId: newUser.id }));
    toast.success(`Welcome to Hindavi Swarajya, ${newUser.name}! 🎉`);
    return true;
  };

  const logout = () => {
    setState(prev => ({
      ...prev,
      currentUser: null,
      isAuthenticated: false,
    }));
    localStorage.removeItem('hindavi_auth');
    toast.success('Logged out successfully');
  };

  const likePost = (postId: string) => {
    if (!state.currentUser) return;
    setState(prev => ({
      ...prev,
      posts: prev.posts.map(post => {
        if (post.id === postId) {
          const isLiked = post.likedBy.includes(prev.currentUser.id);
          return {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1,
            likedBy: isLiked
              ? post.likedBy.filter(id => id !== prev.currentUser.id)
              : [...post.likedBy, prev.currentUser.id],
          };
        }
        return post;
      }),
    }));
  };

  const addComment = (postId: string, content: string) => {
    if (!state.currentUser) return;
    
    const newComment: Comment = {
      id: `c${Date.now()}`,
      userName: state.currentUser.name,
      userAvatar: state.currentUser.avatar,
      userId: state.currentUser.id,
      content,
      timestamp: 'Just now',
    };

    setState(prev => ({
      ...prev,
      posts: prev.posts.map(post =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      ),
    }));

    toast.success('Comment added! 💬');
  };

  const createPost = (postData: Omit<SevaPost, 'id' | 'user' | 'likes' | 'likedBy' | 'comments' | 'timestamp'>) => {
    if (!state.currentUser) return;
    
    // Calculate new points
    const pointsEarned = postData.helpedPeople * 5;
    const oldPoints = state.currentUser.sevaPoints;
    const newPoints = oldPoints + pointsEarned;
    
    // Get old and new ranks
    const oldRank = getRankFromPoints(oldPoints);
    const newRank = getRankFromPoints(newPoints);
    
    const newPost: SevaPost = {
      ...postData,
      id: `post${Date.now()}`,
      user: state.currentUser,
      likes: 0,
      likedBy: [],
      comments: [],
      timestamp: 'Just now',
    };

    // Check if rank changed
    const rankChanged = oldRank.name !== newRank.name;
    
    // Update rank history if rank changed
    const updatedRankHistory = rankChanged
      ? [
          ...state.currentUser.rankHistory,
          {
            rank: newRank.name,
            achievedDate: new Date().toISOString().split('T')[0],
            points: newPoints,
          },
        ]
      : state.currentUser.rankHistory;

    setState(prev => ({
      ...prev,
      posts: [newPost, ...prev.posts],
      currentUser: {
        ...prev.currentUser,
        postsCount: prev.currentUser.postsCount + 1,
        totalHelped: prev.currentUser.totalHelped + postData.helpedPeople,
        sevaPoints: newPoints,
        rank: newRank.name,
        rankHistory: updatedRankHistory,
      },
    }));

    toast.success('Seva post created! 🎉');
    
    // Trigger rank celebration if rank changed
    if (rankChanged && prev.onRankUp) {
      setTimeout(() => {
        prev.onRankUp?.(newRank);
      }, 500);
    }

    // Emit rank up event
    if (rankChanged) {
      emitRankUpEvent(newRank);
    }
  };

  const markNotificationRead = (notificationId: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      ),
    }));
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (!state.currentUser) return;
    
    setState(prev => ({
      ...prev,
      currentUser: prev.currentUser ? {
        ...prev.currentUser,
        ...updates,
      } : null,
    }));
    toast.success('Profile updated! ✓');
  };

  const addHelpRequest = (requestData: Omit<HelpRequest, 'id' | 'timestamp' | 'helpersJoined' | 'status'>) => {
    const now = new Date().toISOString();
    const newRequest: HelpRequest = {
      ...requestData,
      id: `hr${Date.now()}`,
      timestamp: now,
      timePosted: 'Just now',
      helpersJoined: [],
      status: 'open',
      createdAt: now,
      updatedAt: now,
    };

    setState(prev => ({
      ...prev,
      helpRequests: [newRequest, ...prev.helpRequests],
    }));
  };

  const joinHelpRequest = (requestId: string) => {
    if (!state.currentUser) return;

    const now = new Date().toISOString();
    setState(prev => ({
      ...prev,
      helpRequests: prev.helpRequests.map(request => {
        if (request.id === requestId && !request.helpersJoined.includes(prev.currentUser!.id)) {
          const newHelpersJoined = [...request.helpersJoined, prev.currentUser!.id];
          const isFulfilled = newHelpersJoined.length >= request.peopleNeeded;
          
          return {
            ...request,
            helpersJoined: newHelpersJoined,
            status: isFulfilled ? 'completed' : (newHelpersJoined.length > 0 ? 'in-progress' : 'open'),
            updatedAt: now,
          };
        }
        return request;
      }),
    }));
  };

  const addServiceOffered = (service: Omit<ServiceOffered, 'id' | 'timestamp' | 'requestsReceived' | 'rating' | 'reviewsCount'>) => {
    if (!state.currentUser) return;

    const newService: ServiceOffered = {
      ...service,
      id: `srv${Date.now()}`,
      timestamp: 'Just now',
      requestsReceived: [],
      rating: undefined,
      reviewsCount: undefined,
    };

    setState(prev => ({
      ...prev,
      servicesOffered: [newService, ...prev.servicesOffered],
    }));
  };

  const requestService = (serviceId: string) => {
    if (!state.currentUser) return;

    setState(prev => ({
      ...prev,
      servicesOffered: prev.servicesOffered.map(service =>
        service.id === serviceId && !service.requestsReceived.includes(prev.currentUser!.id)
          ? {
              ...service,
              requestsReceived: [...service.requestsReceived, prev.currentUser!.id],
            }
          : service
      ),
    }));
  };

  const createEvent = (event: Omit<SevaEvent, 'id' | 'organizer' | 'volunteersRegistered' | 'status' | 'timestamp'>) => {
    if (!state.currentUser) return;

    const newEvent: SevaEvent = {
      ...event,
      id: `evt${Date.now()}`,
      organizer: {
        name: state.currentUser.name,
        avatar: state.currentUser.avatar,
        rank: state.currentUser.rank,
      },
      volunteersRegistered: [],
      status: 'upcoming',
      timestamp: 'Just now',
    };

    setState(prev => ({
      ...prev,
      events: [newEvent, ...prev.events],
    }));
  };

  const registerForEvent = (eventId: string) => {
    if (!state.currentUser) return;

    setState(prev => ({
      ...prev,
      events: prev.events.map(event =>
        event.id === eventId && !event.volunteersRegistered.includes(prev.currentUser!.id)
          ? {
              ...event,
              volunteersRegistered: [...event.volunteersRegistered, prev.currentUser!.id],
            }
          : event
      ),
    }));
  };

  const cancelEventRegistration = (eventId: string) => {
    if (!state.currentUser) return;

    setState(prev => ({
      ...prev,
      events: prev.events.map(event =>
        event.id === eventId && event.volunteersRegistered.includes(prev.currentUser!.id)
          ? {
              ...event,
              volunteersRegistered: event.volunteersRegistered.filter(id => id !== prev.currentUser!.id),
            }
          : event
      ),
    }));
  };

  return (
    <AppContext.Provider
      value={{
        state,
        login,
        signup,
        logout,
        likePost,
        addComment,
        createPost,
        markNotificationRead,
        updateUserProfile,
        addHelpRequest,
        joinHelpRequest,
        addServiceOffered,
        requestService,
        createEvent,
        registerForEvent,
        cancelEventRegistration,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}