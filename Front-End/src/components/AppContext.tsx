import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'sonner';
export type Rank = "mavla" | "shiledar" | "senapati" | "sardar" | "chhatrapati_senapati";

export interface User {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  location: string;
  joinDate: string;
  currentRank: Rank;
  sevaPoints: number;
  totalHelped: number;
  activeDays: number;
  categories: { name: string; count: number }[];
  achievements: string[];
}

export interface SevaPost {
  id: string;
  userId: string;
  user: {
    name: string;
    avatar: string;
    rank: Rank;
    location: string;
  };
  content: string;
  image?: string;
  category: "Food" | "Education" | "Health" | "Shelter" | "Other";
  timestamp: string;
  likes: number;
  comments: Comment[];
  likedBy: string[];
  helpedPeople: number;
  tags: string[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
}

export interface HelpRequest {
  id: string;
  title: string;
  description: string;
  category: "Food" | "Education" | "Health" | "Shelter" | "Other";
  urgency: "Low" | "Medium" | "High" | "Emergency";
  location: string;
  requesterId: string;
  requester: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  peopleNeeded: number;
  helpersJoined: string[];
  timePosted: string;
  image?: string;
  status: "Open" | "In Progress" | "Completed";
}

interface AppState {
  currentUser: User;
  posts: SevaPost[];
  helpRequests: HelpRequest[];
  users: User[];
}

type AppAction =
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'ADD_POST'; payload: Omit<SevaPost, 'id' | 'timestamp' | 'likes' | 'comments' | 'likedBy'> }
  | { type: 'LIKE_POST'; payload: { postId: string; userId: string } }
  | { type: 'ADD_COMMENT'; payload: { postId: string; comment: Omit<Comment, 'id' | 'timestamp'> } }
  | { type: 'ADD_HELP_REQUEST'; payload: Omit<HelpRequest, 'id' | 'timePosted' | 'helpersJoined' | 'status'> }
  | { type: 'JOIN_HELP_REQUEST'; payload: { requestId: string; userId: string } }
  | { type: 'UPDATE_RANK'; payload: { userId: string; newRank: Rank; points: number } }
  | { type: 'LOAD_INITIAL_DATA'; payload: { posts: SevaPost[]; helpRequests: HelpRequest[] } };

const initialUser: User = {
  id: 'user-1',
  name: 'Rahul Marathe',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  bio: 'Dedicated to serving the community following Maharaj\'s principles. Every small act of seva brings us closer to Swarajya.',
  location: 'Pune, Maharashtra',
  joinDate: 'March 2024',
  currentRank: 'senapati',
  sevaPoints: 2850,
  totalHelped: 347,
  activeDays: 89,
  categories: [
    { name: 'Food', count: 45 },
    { name: 'Education', count: 32 },
    { name: 'Health', count: 28 },
    { name: 'Shelter', count: 15 }
  ],
  achievements: [
    'Helped 50+ people in a single day',
    'Completed first month of consecutive seva',
    'Reached Senapati rank'
  ]
};

const mockUsers: User[] = [
  initialUser,
  {
    id: 'user-2',
    name: 'Priya Shinde',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    bio: 'Education advocate and community volunteer',
    location: 'Mumbai, Maharashtra',
    joinDate: 'February 2024',
    currentRank: 'sardar',
    sevaPoints: 4200,
    totalHelped: 520,
    activeDays: 95,
    categories: [
      { name: 'Education', count: 65 },
      { name: 'Food', count: 30 },
      { name: 'Health', count: 20 },
      { name: 'Other', count: 10 }
    ],
    achievements: []
  }
];

const mockPosts: SevaPost[] = [
  {
    id: 'post-1',
    userId: 'user-2',
    user: {
      name: 'Priya Shinde',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      rank: 'sardar',
      location: 'Mumbai, Maharashtra'
    },
    content: 'Organized free tuition classes for 30 underprivileged children today. Education is the true strength of our nation. Knowledge is power! 📚',
    image: 'https://images.unsplash.com/photo-1643429096345-9de0d2ab7e7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBoZWxwaW5nJTIwY2hpbGRyZW58ZW58MXx8fHwxNzU1OTM3MzIwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Education',
    timestamp: '2 hours ago',
    likes: 67,
    comments: [
      {
        id: 'comment-1',
        userId: 'user-1',
        userName: 'Rahul Marathe',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        content: 'Amazing work Priya! Education seva is so important.',
        timestamp: '1 hour ago'
      }
    ],
    likedBy: ['user-1'],
    helpedPeople: 30,
    tags: ['education', 'children', 'community']
  },
  {
    id: 'post-2',
    userId: 'user-3',
    user: {
      name: 'Arjun Patil',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rank: 'shiledar',
      location: 'Nashik, Maharashtra'
    },
    content: 'Distributed fresh meals to 50 families in flood-affected areas. Every small act of seva brings us closer to Maharaj\'s vision of Swarajya. 🙏',
    image: 'https://images.unsplash.com/photo-1710092784814-4a6f158913b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGlzdHJpYnV0aW9uJTIwY2hhcml0eSUyMGNvbW11bml0eXxlbnwxfHx8fDE3NTU5MzczMTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Food',
    timestamp: '5 hours ago',
    likes: 89,
    comments: [],
    likedBy: ['user-1', 'user-2'],
    helpedPeople: 50,
    tags: ['food', 'flood-relief', 'emergency']
  }
];

const mockHelpRequests: HelpRequest[] = [
  {
    id: 'req-1',
    title: 'Food for Flood Affected Families',
    description: 'Heavy rains have affected 100+ families in our area. Need urgent food supplies and volunteers to distribute meals.',
    category: 'Food',
    urgency: 'Emergency',
    location: 'Kolhapur, Maharashtra',
    requesterId: 'user-4',
    requester: {
      name: 'Rajesh Kulkarni',
      avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=100&h=100&fit=crop&crop=face',
      verified: true
    },
    peopleNeeded: 20,
    helpersJoined: ['user-1'],
    timePosted: '30 min ago',
    image: 'https://images.unsplash.com/photo-1562709911-a355229de124?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjb21tdW5pdHklMjBzZXJ2aWNlJTIwaGVscGluZ3xlbnwxfHx8fDE3NTU5MzczMTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'Open'
  },
  {
    id: 'req-2',
    title: 'Books & Stationery for Tribal School',
    description: 'Rural school in Gadchiroli needs books, notebooks, and stationery for 150 tribal children. Academic year starting soon.',
    category: 'Education',
    urgency: 'High',
    location: 'Gadchiroli, Maharashtra',
    requesterId: 'user-5',
    requester: {
      name: 'Sunita Bhosale',
      avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop&crop=face',
      verified: true
    },
    peopleNeeded: 10,
    helpersJoined: ['user-2'],
    timePosted: '2 hours ago',
    status: 'Open'
  }
];

const rankThresholds = {
  mavla: 0,
  shiledar: 500,
  senapati: 1500,
  sardar: 4000,
  chhatrapati_senapati: 8000
};

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

const initialState: AppState = {
  currentUser: initialUser,
  posts: mockPosts,
  helpRequests: mockHelpRequests,
  users: mockUsers
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_INITIAL_DATA':
      return {
        ...state,
        posts: action.payload.posts,
        helpRequests: action.payload.helpRequests
      };

    case 'UPDATE_USER':
      return {
        ...state,
        currentUser: { ...state.currentUser, ...action.payload }
      };

    case 'ADD_POST':
      const newPost: SevaPost = {
        ...action.payload,
        id: generateId(),
        timestamp: new Date().toLocaleString(),
        likes: 0,
        comments: [],
        likedBy: []
      };

      // Update user seva points and category counts
      const pointsToAdd = action.payload.helpedPeople * 10; // 10 points per person helped
      const updatedUser = { ...state.currentUser };
      updatedUser.sevaPoints += pointsToAdd;
      updatedUser.totalHelped += action.payload.helpedPeople;
      
      // Update category count
      const categoryIndex = updatedUser.categories.findIndex(c => c.name === action.payload.category);
      if (categoryIndex !== -1) {
        updatedUser.categories[categoryIndex].count += 1;
      }

      // Check for rank update
      const newRank = calculateRank(updatedUser.sevaPoints);
      if (newRank !== updatedUser.currentRank) {
        updatedUser.currentRank = newRank;
        toast.success(`🎉 Congratulations! You've been promoted to ${newRank.charAt(0).toUpperCase() + newRank.slice(1)}!`);
      }

      return {
        ...state,
        currentUser: updatedUser,
        posts: [newPost, ...state.posts]
      };

    case 'LIKE_POST':
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post.id === action.payload.postId) {
            const isLiked = post.likedBy.includes(action.payload.userId);
            return {
              ...post,
              likes: isLiked ? post.likes - 1 : post.likes + 1,
              likedBy: isLiked 
                ? post.likedBy.filter(id => id !== action.payload.userId)
                : [...post.likedBy, action.payload.userId]
            };
          }
          return post;
        })
      };

    case 'ADD_COMMENT':
      const comment: Comment = {
        ...action.payload.comment,
        id: generateId(),
        timestamp: new Date().toLocaleString()
      };

      return {
        ...state,
        posts: state.posts.map(post => {
          if (post.id === action.payload.postId) {
            return {
              ...post,
              comments: [...post.comments, comment]
            };
          }
          return post;
        })
      };

    case 'ADD_HELP_REQUEST':
      const newRequest: HelpRequest = {
        ...action.payload,
        id: generateId(),
        timePosted: new Date().toLocaleString(),
        helpersJoined: [],
        status: 'Open'
      };

      return {
        ...state,
        helpRequests: [newRequest, ...state.helpRequests]
      };

    case 'JOIN_HELP_REQUEST':
      return {
        ...state,
        helpRequests: state.helpRequests.map(request => {
          if (request.id === action.payload.requestId) {
            if (!request.helpersJoined.includes(action.payload.userId)) {
              toast.success('You\'ve joined the help request! The requester will be notified.');
              return {
                ...request,
                helpersJoined: [...request.helpersJoined, action.payload.userId]
              };
            }
          }
          return request;
        })
      };

    default:
      return state;
  }
}

function calculateRank(points: number): Rank {
  if (points >= rankThresholds.chhatrapati_senapati) return 'chhatrapati_senapati';
  if (points >= rankThresholds.sardar) return 'sardar';
  if (points >= rankThresholds.senapati) return 'senapati';
  if (points >= rankThresholds.shiledar) return 'shiledar';
  return 'mavla';
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addPost: (post: Omit<SevaPost, 'id' | 'timestamp' | 'likes' | 'comments' | 'likedBy'>) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  addHelpRequest: (request: Omit<HelpRequest, 'id' | 'timePosted' | 'helpersJoined' | 'status'>) => void;
  joinHelpRequest: (requestId: string) => void;
  getRankProgress: () => { current: number; next: number; progress: number };
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('hindaviSwarajya');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.currentUser) {
          dispatch({ type: 'UPDATE_USER', payload: parsedData.currentUser });
        }
        if (parsedData.posts && parsedData.helpRequests) {
          dispatch({ 
            type: 'LOAD_INITIAL_DATA', 
            payload: { 
              posts: parsedData.posts.length > 0 ? parsedData.posts : mockPosts,
              helpRequests: parsedData.helpRequests.length > 0 ? parsedData.helpRequests : mockHelpRequests
            }
          });
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('hindaviSwarajya', JSON.stringify(state));
  }, [state]);

  const addPost = (post: Omit<SevaPost, 'id' | 'timestamp' | 'likes' | 'comments' | 'likedBy'>) => {
    dispatch({ type: 'ADD_POST', payload: post });
    toast.success('Seva post shared successfully! 🙏');
  };

  const likePost = (postId: string) => {
    dispatch({ type: 'LIKE_POST', payload: { postId, userId: state.currentUser.id } });
  };

  const addComment = (postId: string, content: string) => {
    dispatch({ 
      type: 'ADD_COMMENT', 
      payload: { 
        postId, 
        comment: {
          userId: state.currentUser.id,
          userName: state.currentUser.name,
          userAvatar: state.currentUser.avatar,
          content
        }
      }
    });
    toast.success('Comment added!');
  };

  const addHelpRequest = (request: Omit<HelpRequest, 'id' | 'timePosted' | 'helpersJoined' | 'status'>) => {
    dispatch({ type: 'ADD_HELP_REQUEST', payload: request });
    toast.success('Help request created successfully!');
  };

  const joinHelpRequest = (requestId: string) => {
    dispatch({ type: 'JOIN_HELP_REQUEST', payload: { requestId, userId: state.currentUser.id } });
  };

  const getRankProgress = () => {
    const ranks = Object.keys(rankThresholds) as Rank[];
    const currentIndex = ranks.indexOf(state.currentUser.currentRank);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex >= ranks.length) {
      return { current: state.currentUser.sevaPoints, next: state.currentUser.sevaPoints, progress: 100 };
    }

    const currentThreshold = rankThresholds[ranks[currentIndex]];
    const nextThreshold = rankThresholds[ranks[nextIndex]];
    const progress = ((state.currentUser.sevaPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100;

    return { current: state.currentUser.sevaPoints, next: nextThreshold, progress: Math.min(progress, 100) };
  };

  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      addPost,
      likePost,
      addComment,
      addHelpRequest,
      joinHelpRequest,
      getRankProgress
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}