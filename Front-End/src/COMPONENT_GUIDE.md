# Component Guide - Hindavi Swarajya

A comprehensive guide to all custom components in the application.

## 📦 Component Overview

### Core Components (17 Total)

#### 1. **AppContext.tsx**
**Purpose**: Global state management using React Context API

**Features**:
- User management
- Posts CRUD operations
- Comments system
- Notifications structure
- Type-safe interfaces

**Usage**:
```tsx
import { useApp } from './components/AppContext';

function MyComponent() {
  const { state, likePost, addComment } = useApp();
  const { currentUser, posts } = state;
  // ...
}
```

**Key Methods**:
- `likePost(postId)` - Toggle like on a post
- `addComment(postId, content)` - Add comment to post
- `createPost(postData)` - Create new seva post
- `updateUserProfile(updates)` - Update user info
- `markNotificationRead(id)` - Mark notification as read

---

#### 2. **RankBadge.tsx**
**Purpose**: Display user rank with icon and optional label

**Props**:
```typescript
{
  rank: UserRank;        // 'Sevak' | 'Karyakarta' | 'Nayak' | 'Sardar' | 'Senapati'
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}
```

**Usage**:
```tsx
<RankBadge rank="Senapati" size="md" showLabel={true} />
```

**Features**:
- 5 unique rank icons
- Color-coded badges
- Responsive sizes
- Optional text label
- Tooltip with rank name

---

#### 3. **HomeScreen.tsx**
**Purpose**: Main feed display with all seva posts

**Features**:
- Post cards with full content
- Like/comment/share actions
- Search functionality
- Category filtering
- Sort options
- Desktop sidebar widgets
- Mobile-optimized layout
- Smooth animations

**State**:
- `commentInputs` - Track comment text per post
- `showComments` - Toggle comment sections
- `selectedPost` - Current post in modal
- `searchTerm` - Search query
- `categoryFilter` - Selected category
- `sortBy` - Sort criteria
- `savedPosts` - Bookmarked posts
- `followedUsers` - Followed user IDs

---

#### 4. **CreatePostScreen.tsx**
**Purpose**: Form for creating new seva posts

**Props**:
```typescript
{
  onBack: () => void;    // Navigation callback
}
```

**Form Fields**:
- Content (required, textarea)
- Category (required, select)
- People Helped (required, number)
- Location (optional, text)
- Tags (optional, comma-separated)
- Image URL (optional, with preview)

**Validation**:
- Content not empty
- People helped > 0
- Image URL format (if provided)

---

#### 5. **ProfileScreen.tsx**
**Purpose**: User profile display and editing

**Sections**:
- Header (avatar, name, rank, stats)
- Bio display/edit
- Statistics grid (4 metrics)
- Achievements
- Tabbed content (Posts, Activity)

**Edit Features**:
- Name update
- Location update
- Bio update (textarea)
- Modal dialog for editing

---

#### 6. **LeaderboardScreen.tsx**
**Purpose**: Rankings and top contributors

**Tabs**:
1. Seva Points - Sort by total points
2. People Helped - Sort by impact
3. Most Posts - Sort by activity

**Features**:
- Top 3 podium display
- Animated rankings
- Current user highlight
- Rank information card
- Scroll animations

---

#### 7. **BottomNav.tsx**
**Purpose**: Mobile navigation bar

**Props**:
```typescript
{
  currentScreen: string;
  onNavigate: (screen: string) => void;
}
```

**Navigation Items**:
- Home (🏠)
- Create (➕)
- Leaderboard (🏆)
- Profile (👤)

**Features**:
- Active state with color
- Layout animation on switch
- Touch-friendly tap targets

---

#### 8. **DesktopNav.tsx**
**Purpose**: Desktop top navigation

**Sections**:
- Logo and app name
- Navigation buttons
- Notification bell
- User profile button

**Features**:
- Active state highlighting
- Notification badge
- User avatar display
- Hover effects

---

#### 9. **SplashScreen.tsx**
**Purpose**: Animated app introduction

**Props**:
```typescript
{
  onComplete: () => void;  // Called when animation ends
}
```

**Animation Sequence**:
1. Logo scale + rotate (0.6s)
2. Title fade in (0.5s, delay 0.3s)
3. Stats icons fade in (0.5s, delay 0.6s)
4. Loading dots loop (starting 0.8s)

**Auto-dismiss**: 2.5 seconds

---

#### 10. **QuickGuide.tsx**
**Purpose**: Interactive help system

**Sections**:
- App introduction
- Key features (6 items)
- Rank system explanation
- Getting started steps
- Inspirational quote

**Features**:
- Dialog modal
- Animated feature cards
- Visual rank progression
- Step-by-step instructions

---

#### 11. **EmptyState.tsx**
**Purpose**: Reusable empty state display

**Props**:
```typescript
{
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}
```

**Usage**:
```tsx
<EmptyState
  icon={Zap}
  title="No posts found"
  description="Try different search terms"
  actionLabel="Create Post"
  onAction={handleCreate}
/>
```

---

#### 12. **StatsCard.tsx**
**Purpose**: Animated statistics display

**Props**:
```typescript
{
  icon: LucideIcon;
  label: string;
  value: number | string;
  color: string;
  delay?: number;
}
```

**Features**:
- Scale-in animation
- Hover effect
- Color customization
- Stagger delay support

---

#### 13. **CategoryIcon.tsx**
**Purpose**: Display icon for seva category

**Props**:
```typescript
{
  category: SevaCategory;
  className?: string;
}
```

**Icon Mapping**:
- Food → Utensils
- Education → BookOpen
- Health → Heart
- Shelter → Home
- Other → Sparkles

---

#### 14. **LoadingSpinner.tsx**
**Purpose**: Loading state indicator

**Props**:
```typescript
{
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}
```

**Features**:
- Rotating animation
- Optional text label
- Size variants
- Orange theme color

---

#### 15. **ImpactBadge.tsx**
**Purpose**: Display people helped count

**Props**:
```typescript
{
  count: number;
  label?: string;
  animated?: boolean;
}
```

**Features**:
- Gradient background
- Icon + count + label
- Scale animation (optional)
- Hover effect

---

#### 16. **ProgressBar.tsx**
**Purpose**: Visual progress indicator

**Props**:
```typescript
{
  current: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  color?: string;
}
```

**Features**:
- Animated fill
- Optional percentage
- Custom color
- Label support

---

#### 17. **NotificationBell.tsx**
**Purpose**: Notification center with popover

**Features**:
- Unread count badge
- Animated badge appearance
- Notification list
- Type-based icons (like, comment, follow, achievement)
- Mark as read on click
- Clear all functionality
- Empty state

**Icon Mapping**:
- Like → Heart (red)
- Comment → MessageCircle (blue)
- Follow → UserPlus (green)
- Achievement → Award (orange)

---

## 🎨 Shared UI Components

All components use shadcn/ui primitives:
- Button
- Card
- Input
- Textarea
- Select
- Dialog
- Tabs
- Badge
- Popover
- And more...

---

## 🔧 Utility Components

### ImageWithFallback
**Purpose**: Protected component for image handling
**Location**: `/components/figma/ImageWithFallback.tsx`
**Usage**: Use instead of `<img>` tag

---

## 📱 Responsive Behavior

### Mobile (<768px)
- Bottom navigation
- Compact cards
- Stacked layouts
- Touch-optimized
- Filter tabs

### Tablet (768px-1024px)
- Mixed layouts
- Larger touch targets
- Some sidebar content
- Hybrid navigation

### Desktop (>1024px)
- Top navigation
- Sidebar widgets
- Multi-column layouts
- Hover effects
- Larger images

---

## 🎭 Animation Patterns

### Common Animations
```typescript
// Fade in from bottom
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}

// Stagger delay
transition={{ delay: index * 0.1 }}

// Scale in
initial={{ scale: 0 }}
animate={{ scale: 1 }}

// Layout animation
<motion.div layoutId="uniqueId" />
```

---

## 🎯 Best Practices

### Component Usage
1. **Import only what you need**
2. **Use TypeScript props**
3. **Handle loading/error states**
4. **Add animations thoughtfully**
5. **Keep components focused**

### State Management
1. **Use AppContext for global state**
2. **Keep local state minimal**
3. **Update optimistically**
4. **Validate before updating**

### Styling
1. **Use Tailwind classes**
2. **Follow color system**
3. **Maintain spacing consistency**
4. **Respect responsive breakpoints**

---

## 📚 Component Dependencies

```
App.tsx
├── AppProvider (AppContext)
│   ├── HomeScreen
│   ├── CreatePostScreen
│   ├── ProfileScreen
│   └── LeaderboardScreen
├── BottomNav (mobile)
├── DesktopNav (desktop)
│   └── NotificationBell
└── SplashScreen

Shared Components:
├── RankBadge
├── QuickGuide
├── EmptyState
├── StatsCard
├── CategoryIcon
├── LoadingSpinner
├── ImpactBadge
├── ProgressBar
└── ImageWithFallback
```

---

## 🔍 Finding Components

### By Purpose
- **Navigation**: BottomNav, DesktopNav
- **Display**: RankBadge, StatsCard, ImpactBadge
- **Feedback**: LoadingSpinner, EmptyState, NotificationBell
- **Input**: CreatePostScreen
- **Data**: HomeScreen, ProfileScreen, LeaderboardScreen
- **Utility**: CategoryIcon, ProgressBar, QuickGuide

### By Size
- **Large (500+ lines)**: HomeScreen
- **Medium (200-500)**: AppContext, ProfileScreen, LeaderboardScreen
- **Small (<200)**: Most utility components

---

**Total Components**: 17 custom + 30+ UI primitives  
**Total Lines**: ~3,500+  
**All TypeScript**: 100% type-safe ✅
