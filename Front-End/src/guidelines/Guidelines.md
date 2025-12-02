# HindaviSwarajya Design System Guidelines
*Zomato-inspired modern design with traditional Indian values*

## General Design Principles

### Typography
- **Primary Font**: Inter (clean, modern, highly readable like Zomato)
- **Secondary Font**: Poppins (for headings and special text)
- **Base Font Size**: 16px (improved readability on all devices)
- **Font Weights**: Use semantic weights (light: 300, normal: 400, medium: 500, semibold: 600, bold: 700)
- **Line Height**: 1.6 for body text, 1.3-1.4 for headings (generous spacing like Zomato)
- **Letter Spacing**: Subtle negative spacing for larger text (-0.01em to -0.02em)

### Color System
- **Primary Brand**: Saffron (#FF6F00) - represents the spirit of Hinduism and Maratha heritage
- **Secondary**: Saffron variants (light: #FFB74D, dark: #E65100)
- **Accent**: Royal Gold (#DAA520), Maratha Red (#B71C1C)
- **Neutral**: Modern grayscale with high contrast for accessibility
- **Background**: Clean whites (#ffffff) with subtle grays for sections

### Spacing & Layout
- **Base Unit**: 8px system (4px, 8px, 16px, 24px, 32px, 48px, 64px)
- **Container**: Max-width with generous side padding like Zomato
- **Cards**: Generous padding (24px-32px) with modern shadows
- **Buttons**: Ample padding (12px-24px) for better touch targets
- **Mobile**: Extra generous spacing and touch-friendly sizes (44px minimum)

### Border Radius
- **Small**: 6px (badges, small elements)
- **Medium**: 8px (buttons, inputs)
- **Large**: 12px (cards, major components)
- **Extra Large**: 16px (hero sections, featured content)
- **Rounded**: 24px (special highlight cards)

## Component Guidelines

### Buttons
- **Primary**: Saffron gradient with shadow, medium font-weight
- **Secondary**: Outlined saffron with hover fill effect
- **Sizes**: Consistent padding system (sm: 8px-16px, md: 12px-24px, lg: 16px-32px)
- **States**: Subtle hover animations (translateY(-1px) + shadow increase)
- **Touch Targets**: Minimum 44px height on mobile

### Cards
- **Style**: Clean white background with subtle shadows
- **Hover**: Gentle lift effect (translateY(-1px)) with increased shadow
- **Padding**: Generous internal spacing (16px-24px)
- **Border**: Subtle gray border with modern radius
- **Mobile**: Full-width with proper margins

### Typography Hierarchy
```css
h1: 30px, Poppins, Bold (Hero sections)
h2: 24px, Poppins, Semibold (Page titles)
h3: 20px, Poppins, Semibold (Section headers)
h4: 18px, Inter, Medium (Subsection headers)
p: 16px, Inter, Normal (Body text)
small: 14px, Inter, Normal (Supporting text)
micro: 12px, Inter, Normal (Captions, labels)
```

### Navigation
- **Desktop**: Sidebar with saffron accents and modern hover states
- **Mobile**: Bottom navigation with large touch targets and active states
- **Active State**: Saffron background with white text/icons
- **Hover**: Saffron background with subtle animation

### Forms & Inputs
- **Style**: Modern background (#f9fafb) with saffron focus states
- **Border**: 2px solid for better visibility and modern look
- **Focus**: Saffron border with subtle glow effect
- **Placeholder**: Muted gray with helpful context
- **Labels**: Medium weight, positioned above inputs

## Brand-Specific Guidelines

### HindaviSwarajya Identity
- **Logo**: Always use saffron gradient for brand elements
- **Rank Badges**: Traditional Maratha hierarchy with modern design
- **Cultural Elements**: Subtle integration of traditional patterns
- **Language**: Support for Marathi text with appropriate font weights
- **Icons**: Prefer outlined style with saffron fills for active states

### Color Usage
- **Saffron (#FF6F00)**: Primary actions, brand elements, active states
- **Saffron Light (#FFB74D)**: Hover states, secondary elements
- **Saffron Dark (#E65100)**: Pressed states, emphasis
- **Royal Gold (#DAA520)**: Special achievements, premium features
- **Maratha Red (#B71C1C)**: Emergency states, important alerts

### Animations & Interactions
- **Duration**: 200-300ms for micro-interactions (Zomato-like snappy feel)
- **Easing**: ease-in-out for most animations
- **Hover**: Subtle lift effects (translateY(-1px))
- **Loading**: Shimmer effects with saffron tints
- **Success**: Bounce-in animation with saffron celebration colors

## Mobile-First Approach

### Touch Interactions
- **Minimum Touch Target**: 44px x 44px
- **Spacing**: Extra generous spacing between interactive elements
- **Typography**: Larger base font size (16px) to prevent iOS zoom
- **Navigation**: Bottom-anchored with large, clear icons

### Responsive Breakpoints
- **Mobile**: < 768px (single column, stacked layout)
- **Tablet**: 768px - 1024px (adaptive grid)
- **Desktop**: > 1024px (sidebar + main content)

### Performance
- **Images**: WebP format with fallbacks
- **Fonts**: Preload critical font weights
- **Animations**: Respect reduced motion preferences
- **Loading**: Progressive loading with skeleton states

## Accessibility
- **Contrast**: WCAG AA compliant (4.5:1 minimum)
- **Focus**: Clear focus indicators with saffron outlines
- **Typography**: Sufficient size and spacing for readability
- **Interactive Elements**: Clear hover and active states
- **Screen Readers**: Proper ARIA labels and semantic HTML

## Examples

### Modern Card Component
```css
.card-modern {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
}

.card-modern:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

### Primary Button
```css
.btn-primary-modern {
  background: linear-gradient(135deg, #FF6F00 0%, #E65100 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
}

.btn-primary-modern:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(255, 111, 0, 0.3);
}
```

### Typography Example
```css
h2 {
  font-family: 'Poppins', sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: -0.015em;
  color: #1a1a1a;
  margin-bottom: 12px;
}
```

This design system combines Zomato's modern, clean aesthetic with HindaviSwarajya's cultural identity and saffron color palette, creating a unique and engaging user experience that honors both modern UX principles and traditional Indian values.