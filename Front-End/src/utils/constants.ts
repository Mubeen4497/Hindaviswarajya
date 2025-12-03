/**
 * Application-wide constants
 */

export const APP_NAME = 'हिंदवी स्वराज्य';
export const APP_NAME_EN = 'Hindavi Swarajya';
export const APP_TAGLINE = 'Serving the Community Together';

export const COLORS = {
  primary: '#FF6F00',
  primaryDark: '#E65100',
  primaryLight: '#FFF3E0',
  secondary: '#F57C00',
} as const;

export const RANK_LEVELS = {
  SEVAK: { name: 'Sevak', minPoints: 0, maxPoints: 499 },
  KARYAKARTA: { name: 'Karyakarta', minPoints: 500, maxPoints: 999 },
  NAYAK: { name: 'Nayak', minPoints: 1000, maxPoints: 1499 },
  SARDAR: { name: 'Sardar', minPoints: 1500, maxPoints: 1999 },
  SENAPATI: { name: 'Senapati', minPoints: 2000, maxPoints: Infinity },
} as const;

export const CATEGORIES = {
  FOOD: 'Food',
  EDUCATION: 'Education',
  HEALTH: 'Health',
  SHELTER: 'Shelter',
  OTHER: 'Other',
} as const;

export const CATEGORY_COLORS = {
  Food: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  Education: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  Health: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  Shelter: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
  Other: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
} as const;

export const SORT_OPTIONS = {
  RECENT: { value: 'recent', label: 'Most Recent' },
  LIKES: { value: 'likes', label: 'Most Liked' },
  IMPACT: { value: 'impact', label: 'Highest Impact' },
  COMMENTS: { value: 'comments', label: 'Most Discussed' },
} as const;

export const POINTS_PER_PERSON = 5;

export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
} as const;

export const ANIMATION_DURATION = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.5,
} as const;

export const MAX_COMMENT_LENGTH = 500;
export const MAX_POST_LENGTH = 1000;
export const MAX_TAGS = 5;

export const INSPIRATIONAL_QUOTES = [
  {
    marathi: 'गवार राज्यापेक्षा स्वराज्य बरे',
    english: 'Self-rule is better than foreign rule',
  },
  {
    marathi: 'सेवा परमो धर्म:',
    english: 'Service is the highest duty',
  },
  {
    marathi: 'सर्वे भवन्तु सुखिनः',
    english: 'May all be happy',
  },
] as const;

export const ACHIEVEMENT_TYPES = {
  FIRST_POST: { id: 'first_post', name: 'First Seva', description: 'Created your first seva post' },
  HUNDRED_LIKES: { id: 'hundred_likes', name: '100 Likes', description: 'Received 100 total likes' },
  HUNDRED_HELPED: { id: 'hundred_helped', name: '100+ Helped', description: 'Helped 100+ people' },
  RANK_KARYAKARTA: { id: 'rank_karyakarta', name: 'Karyakarta Rank', description: 'Reached Karyakarta rank' },
  RANK_NAYAK: { id: 'rank_nayak', name: 'Nayak Rank', description: 'Reached Nayak rank' },
  RANK_SARDAR: { id: 'rank_sardar', name: 'Sardar Rank', description: 'Reached Sardar rank' },
  RANK_SENAPATI: { id: 'rank_senapati', name: 'Senapati Rank', description: 'Reached Senapati rank' },
  TEN_POSTS: { id: 'ten_posts', name: '10 Posts', description: 'Created 10 seva posts' },
  COMMUNITY_LEADER: { id: 'community_leader', name: 'Community Leader', description: 'Helped 500+ people' },
} as const;

export const NOTIFICATION_TYPES = {
  LIKE: 'like',
  COMMENT: 'comment',
  FOLLOW: 'follow',
  ACHIEVEMENT: 'achievement',
} as const;

export const ROUTES = {
  HOME: 'home',
  CREATE: 'create',
  LEADERBOARD: 'leaderboard',
  PROFILE: 'profile',
} as const;
