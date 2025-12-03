# हिंदवी स्वराज्य (Hindavi Swarajya) - Community Seva Platform

A beautiful, modern social media platform for sharing and celebrating community service (seva) activities. Built with React, TypeScript, Tailwind CSS, and Motion animations.

## 🌟 Features

### Core Features
- **Seva Feed**: Browse and interact with community service posts
- **Create Posts**: Share your seva activities with photos, categories, and impact metrics
- **Leaderboard**: Gamified ranking system with 5 rank levels (Sevak → Senapati)
- **User Profiles**: View and edit your profile, track achievements and impact
- **Comments & Likes**: Engage with posts through comments and likes
- **Real-time Stats**: Track total people helped, seva points, and community impact

### Advanced Features
- **Smart Filtering**: Filter by category (Food, Education, Health, Shelter, Other)
- **Search**: Search posts by content, user names, or hashtags
- **Sort Options**: Sort by recent, likes, impact, or comments
- **Save Posts**: Bookmark posts for later viewing
- **Follow Users**: Follow other sevaks to stay updated
- **Trending Tags**: Discover popular seva topics
- **Responsive Design**: Optimized for mobile, tablet, and desktop

### Gamification
- **Rank System**: 5 progressive ranks based on seva points
  - Sevak (0-499 points)
  - Karyakarta (500-999 points)
  - Nayak (1000-1499 points)
  - Sardar (1500-1999 points)
  - Senapati (2000+ points)
- **Achievements**: Unlock badges for milestones
- **Points System**: Earn points based on impact (1 person helped = 5 points)

## 🎨 Design Features

### Animations
- Smooth page transitions with Motion
- Interactive micro-animations on buttons and cards
- Staggered list animations for feed items
- Collapsible comment sections
- Animated splash screen on load

### UI/UX
- Clean, modern interface with orange (#FF6F00) accent color
- Card-based layout for better content organization
- Intuitive navigation (bottom nav for mobile, top nav for desktop)
- Toast notifications for user feedback
- Modal dialogs for detailed post views
- Category color coding for quick identification

### Responsive Design
- Mobile-first approach
- Adaptive layouts for tablet and desktop
- Touch-friendly controls on mobile
- Enhanced desktop features (sidebar widgets, hover effects)

## 🚀 Getting Started

### Prerequisites
- Modern web browser
- Internet connection (for Unsplash images)

### Installation
This is a Figma Make application. Simply open the application in your browser to start using it.

## 📱 Usage

### Mobile Experience
1. **Home Screen**: Scroll through seva posts
2. **Create**: Tap the + icon to share your seva
3. **Leaderboard**: View top contributors
4. **Profile**: Manage your account and view stats

### Desktop Experience
- Enhanced sidebar with live stats and trending content
- Top navigation bar with quick access to all features
- Larger images and better use of screen space
- Hover effects and smoother interactions

## 🏗️ Architecture

### Components Structure
```
/components
├── AppContext.tsx          # Global state management
├── RankBadge.tsx          # User rank display component
├── HomeScreen.tsx         # Main feed screen
├── CreatePostScreen.tsx   # Post creation form
├── ProfileScreen.tsx      # User profile view
├── LeaderboardScreen.tsx  # Rankings and leaderboard
├── BottomNav.tsx          # Mobile navigation
├── DesktopNav.tsx         # Desktop navigation
├── SplashScreen.tsx       # App loading screen
└── ui/                    # UI component library
```

### State Management
- React Context API for global state
- Local state for UI interactions
- Optimistic updates for better UX

### Data Model
```typescript
User {
  id, name, avatar, location, rank,
  sevaPoints, totalHelped, postsCount,
  bio, joinedDate
}

Post {
  id, userId, user, content, image,
  category, helpedPeople, likes, likedBy,
  comments, tags, timestamp, location
}

Comment {
  id, userName, userAvatar, userId,
  content, timestamp
}
```

## 🎯 Key Features Explained

### Seva Points Calculation
- Points = People Helped × 5
- Example: Feeding 100 people = 500 points

### Rank Progression
- Automatic rank upgrades as you earn points
- Visual badges for each rank level
- Special colors and icons per rank

### Category System
- Food (Green) - Meal distributions, food drives
- Education (Blue) - Teaching, books, supplies
- Health (Red) - Medical camps, checkups
- Shelter (Purple) - Housing, temporary shelters
- Other (Gray) - General community service

### Engagement Features
- Like posts to show appreciation
- Comment to discuss and share ideas
- Share posts via native share or copy
- Save posts for later reference
- Follow users to see their content

## 🎨 Design System

### Colors
- Primary: #FF6F00 (Deep Orange)
- Secondary: #F57C00 (Orange)
- Background: #F9FAFB (Gray 50)
- Cards: #FFFFFF (White)

### Typography
- System font stack for optimal readability
- Responsive font sizes
- Proper heading hierarchy

### Spacing
- Consistent 4px grid system
- Comfortable touch targets (44px minimum)
- Adequate whitespace for readability

## 🔮 Future Enhancements

- [ ] Push notifications for new interactions
- [ ] Direct messaging between users
- [ ] Photo upload from device
- [ ] Location-based seva discovery
- [ ] Volunteer event scheduling
- [ ] Team/Organization profiles
- [ ] Seva challenges and campaigns
- [ ] Export impact reports
- [ ] Multi-language support
- [ ] Dark mode theme

## 📄 License

This project is created for community service promotion and social good.

## 🙏 Acknowledgments

- Built with Figma Make
- Images from Unsplash
- Icons from Lucide React
- UI components from shadcn/ui
- Animations powered by Motion (Framer Motion)

---

**Built with ❤️ for the community**

*"गवार राज्यापेक्षा स्वराज्य बरे" - Self-rule is better than foreign rule*
