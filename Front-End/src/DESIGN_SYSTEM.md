# Design System - Hindavi Swarajya

Complete design system documentation including colors, typography, spacing, and components.

## 🎨 Color Palette

### Primary Colors
```css
--primary: #FF6F00        /* Deep Orange - Main brand color */
--primary-dark: #E65100   /* Darker orange - Hover states */
--primary-light: #FFF3E0  /* Light orange - Backgrounds */
--secondary: #F57C00      /* Orange - Secondary actions */
```

### Category Colors

#### Food (Green Theme)
```css
--food-bg: bg-green-100
--food-text: text-green-800
--food-border: border-green-200
Hex: #10B981 (main)
```

#### Education (Blue Theme)
```css
--education-bg: bg-blue-100
--education-text: text-blue-800
--education-border: border-blue-200
Hex: #3B82F6 (main)
```

#### Health (Red Theme)
```css
--health-bg: bg-red-100
--health-text: text-red-800
--health-border: border-red-200
Hex: #EF4444 (main)
```

#### Shelter (Purple Theme)
```css
--shelter-bg: bg-purple-100
--shelter-text: text-purple-800
--shelter-border: border-purple-200
Hex: #8B5CF6 (main)
```

#### Other (Gray Theme)
```css
--other-bg: bg-gray-100
--other-text: text-gray-800
--other-border: border-gray-200
Hex: #6B7280 (main)
```

### Rank Colors

#### Sevak (Gray)
```css
Color: #6B7280
Background: bg-gray-100
Icon: Star ⭐
Points: 0-499
```

#### Karyakarta (Blue)
```css
Color: #3B82F6
Background: bg-blue-100
Icon: Zap ⚡
Points: 500-999
```

#### Nayak (Green)
```css
Color: #10B981
Background: bg-green-100
Icon: Award 🏆
Points: 1000-1499
```

#### Sardar (Purple)
```css
Color: #8B5CF6
Background: bg-purple-100
Icon: Shield 🛡️
Points: 1500-1999
```

#### Senapati (Orange)
```css
Color: #FF6F00
Background: bg-orange-100
Icon: Crown 👑
Points: 2000+
```

### Semantic Colors
```css
--success: #10B981        /* Green - Success states */
--error: #EF4444          /* Red - Error states */
--warning: #F59E0B        /* Amber - Warning states */
--info: #3B82F6           /* Blue - Info states */
```

### Neutral Colors
```css
--gray-50: #F9FAFB       /* Lightest gray - Backgrounds */
--gray-100: #F3F4F6      /* Light gray - Cards */
--gray-200: #E5E7EB      /* Border color */
--gray-300: #D1D5DB      /* Disabled elements */
--gray-400: #9CA3AF      /* Placeholder text */
--gray-500: #6B7280      /* Secondary text */
--gray-600: #4B5563      /* Body text */
--gray-700: #374151      /* Headings */
--gray-800: #1F2937      /* Dark text */
--gray-900: #111827      /* Darkest */
```

### Special Colors
```css
--white: #FFFFFF
--black: #000000
--transparent: transparent
```

---

## 📝 Typography

### Font Family
```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, 
             'Segoe UI', Roboto, 'Helvetica Neue', Arial, 
             sans-serif;
```

### Font Sizes (Tailwind)
```
text-xs:    12px / 0.75rem
text-sm:    14px / 0.875rem
text-base:  16px / 1rem       /* Body text */
text-lg:    18px / 1.125rem
text-xl:    20px / 1.25rem
text-2xl:   24px / 1.5rem
text-3xl:   30px / 1.875rem
text-4xl:   36px / 2.25rem
```

### Font Weights
```css
font-normal:  400  /* Body text */
font-medium:  500  /* Buttons, labels */
font-semibold: 600 /* Emphasis */
font-bold:    700  /* Strong headings */
```

### Line Heights
```css
leading-none:     1
leading-tight:    1.25
leading-snug:     1.375
leading-normal:   1.5        /* Default */
leading-relaxed:  1.625
leading-loose:    2
```

### Text Hierarchy

#### Headings
```tsx
<h1>  // text-2xl, font-medium, leading-normal
<h2>  // text-xl, font-medium, leading-normal
<h3>  // text-lg, font-medium, leading-normal
<h4>  // text-base, font-medium, leading-normal
```

#### Body Text
```tsx
<p>   // text-base, font-normal, leading-normal
```

#### Small Text
```tsx
.caption  // text-sm
.label    // text-xs
```

---

## 📏 Spacing System

### Base Unit: 4px

```
0:    0px
0.5:  2px
1:    4px    /* Base unit */
2:    8px
3:    12px
4:    16px   /* Standard padding */
5:    20px
6:    24px   /* Card padding */
8:    32px
10:   40px
12:   48px
16:   64px
20:   80px
24:   96px
```

### Common Patterns

#### Card Padding
```tsx
Mobile:  p-4   (16px)
Desktop: p-6   (24px)
```

#### Section Spacing
```tsx
Gap between sections: mb-6 (24px)
Gap within section:   mb-4 (16px)
```

#### Component Spacing
```tsx
Icon + Text:  gap-2  (8px)
List items:   gap-3  (12px)
Form fields:  gap-4  (16px)
```

---

## 🎯 Touch Targets

### Minimum Sizes
```
Mobile button:   44px × 44px
Desktop button:  36px × 36px
Icon button:     40px × 40px
Tap area:        44px minimum
```

### Examples
```tsx
<Button size="sm">   // 32px height (desktop)
<Button size="default">  // 40px height
<Button size="lg">   // 44px height (mobile)
```

---

## 🖼️ Layout

### Breakpoints
```css
sm:   640px   /* Small devices */
md:   768px   /* Tablets */
lg:   1024px  /* Desktops */
xl:   1280px  /* Large desktops */
2xl:  1536px  /* Extra large */
```

### Container Widths
```css
max-w-sm:    384px
max-w-md:    448px
max-w-lg:    512px
max-w-xl:    576px
max-w-2xl:   672px   /* Feed width */
max-w-4xl:   896px   /* Profile width */
max-w-7xl:   1280px  /* Max app width */
```

### Grid System
```tsx
// 2 columns on mobile, 4 on desktop
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
```

---

## 🎨 Shadows

### Shadow Scale
```css
shadow-sm:    0 1px 2px rgba(0, 0, 0, 0.05)
shadow:       0 1px 3px rgba(0, 0, 0, 0.1)
shadow-md:    0 4px 6px rgba(0, 0, 0, 0.1)
shadow-lg:    0 10px 15px rgba(0, 0, 0, 0.1)
shadow-xl:    0 20px 25px rgba(0, 0, 0, 0.1)
```

### Usage
```tsx
Cards:         shadow-sm
Hover cards:   shadow-md
Modals:        shadow-xl
Buttons:       shadow-sm
```

---

## 🔘 Border Radius

### Radius Scale
```css
rounded-none:  0
rounded-sm:    2px
rounded:       4px    /* Default */
rounded-md:    6px
rounded-lg:    8px    /* Cards */
rounded-xl:    12px
rounded-2xl:   16px
rounded-3xl:   24px
rounded-full:  9999px /* Circles */
```

### Usage
```tsx
Cards:         rounded-lg
Buttons:       rounded-md
Badges:        rounded-full
Avatars:       rounded-full
Images:        rounded-lg
```

---

## 🎭 Animations

### Duration
```css
duration-75:   75ms
duration-100:  100ms
duration-150:  150ms
duration-200:  200ms  /* Fast */
duration-300:  300ms  /* Normal */
duration-500:  500ms  /* Slow */
duration-700:  700ms
duration-1000: 1000ms
```

### Easing
```css
ease-linear
ease-in         /* Accelerate */
ease-out        /* Decelerate */
ease-in-out     /* Smooth */
```

### Common Patterns
```tsx
// Fade in
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.3 }}

// Slide up
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3 }}

// Scale in
initial={{ scale: 0 }}
animate={{ scale: 1 }}
transition={{ type: "spring" }}
```

---

## 🎯 Component Patterns

### Card Component
```tsx
<Card className="p-4 lg:p-6 hover:shadow-md transition-shadow">
  {/* Content */}
</Card>
```

### Button Variants
```tsx
// Primary
<Button className="bg-[#FF6F00] hover:bg-[#E65100]">

// Secondary
<Button variant="outline">

// Ghost
<Button variant="ghost">
```

### Badge Component
```tsx
<Badge className="bg-green-100 text-green-800">
  Food
</Badge>
```

### Input Component
```tsx
<Input 
  className="border-gray-200 focus:border-[#FF6F00]"
  placeholder="Search..."
/>
```

---

## 📱 Responsive Patterns

### Mobile First
```tsx
// Base: Mobile
// md: Tablet
// lg: Desktop

<div className="text-sm md:text-base lg:text-lg">
```

### Conditional Rendering
```tsx
{isMobile && <MobileComponent />}
{isDesktop && <DesktopComponent />}
```

### Adaptive Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

---

## 🎨 Gradients

### Primary Gradient
```css
bg-gradient-to-r from-[#FF6F00] to-[#F57C00]
```

### Header Gradient
```css
bg-gradient-to-br from-[#FF6F00] to-[#F57C00]
```

### Light Gradient
```css
bg-gradient-to-br from-[#FFF3E0] to-orange-50
```

---

## ♿ Accessibility

### Color Contrast
- Text on white: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: Clear focus states

### Focus States
```css
focus-visible:outline-2
focus-visible:outline-[#FF6F00]
focus-visible:outline-offset-2
```

### Text Selection
```css
selection:bg-[#FFE0B2]
selection:text-[#FF6F00]
```

---

## 📐 Icon Sizes

### Icon Scale
```tsx
w-3 h-3:   12px  /* Tiny icons */
w-4 h-4:   16px  /* Small icons */
w-5 h-5:   20px  /* Default */
w-6 h-6:   24px  /* Medium */
w-8 h-8:   32px  /* Large */
w-12 h-12: 48px  /* Extra large */
```

### Usage
```tsx
Button icons:    w-4 h-4
Nav icons:       w-5 h-5
Feature icons:   w-6 h-6
Hero icons:      w-12 h-12
```

---

## 🎯 Z-Index Scale

```css
z-0:   0    /* Base layer */
z-10:  10   /* Dropdowns */
z-20:  20   /* Sticky elements */
z-30:  30   /* Fixed nav */
z-40:  40   /* Modals */
z-50:  50   /* Toasts */
```

---

## 📝 Form Styles

### Input States
```tsx
// Default
border-gray-200

// Focus
focus:border-[#FF6F00] focus:ring-2 focus:ring-[#FF6F00]/20

// Error
border-red-500 focus:border-red-500

// Disabled
bg-gray-100 text-gray-400 cursor-not-allowed
```

---

## 🎨 Custom Scrollbar

```css
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #FF6F00;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #E65100;
}
```

---

## 📚 Design Tokens Reference

### Colors
- ✅ 5 Primary colors
- ✅ 10 Category colors  
- ✅ 10 Rank colors
- ✅ 10 Neutral grays
- ✅ 4 Semantic colors

### Spacing
- ✅ 4px base grid
- ✅ 13 spacing values
- ✅ Consistent patterns

### Typography
- ✅ System font stack
- ✅ 8 font sizes
- ✅ 4 font weights
- ✅ 6 line heights

### Layout
- ✅ 5 breakpoints
- ✅ 8 container widths
- ✅ Responsive grid

---

**Design System Version**: 1.0.0  
**Last Updated**: December 2, 2024  
**Status**: Complete ✅
